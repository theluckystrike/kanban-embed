import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from 'obsidian-test-mocks/obsidian';
import KanbanEmbedPlugin from '../src/main';
import { FREE_MAX_BOARDS, PRO_UI, SPONSORS, bindPro, isPro, onProChange, resetPro } from '../src/pro';
import { DEFAULT_SETTINGS, normalizeSettings } from '../src/settings';
import manifest from '../manifest.json';

afterEach(() => resetPro());

/** A stand-in for the SponsorsManager: only isPro and onChange, which the facade uses. */
function fakeManager(start: boolean) {
	let pro = start;
	const fns = new Set<() => void>();
	return {
		isPro: () => pro,
		onChange: (fn: () => void) => {
			fns.add(fn);
			return () => fns.delete(fn);
		},
		set(v: boolean) {
			pro = v;
			for (const fn of fns) fn();
		},
		listeners: () => fns.size,
	};
}

describe('settings', () => {
	it('loads with default settings against an in-memory vault', async () => {
		const app = App.createConfigured__({ files: { 'Board.md': '---\nkanban-plugin: board\n---\n\n## A\n' } });
		const plugin = new KanbanEmbedPlugin(app as never, manifest as never);
		await plugin.loadSettings();
		expect(plugin.settings).toEqual(DEFAULT_SETTINGS);
		expect(isPro()).toBe(false);
	});

	it('repairs bad saved settings and clamps the lane width', () => {
		expect(normalizeSettings({ laneWidth: 'x' as never, hideDone: 'yes' as never })).toEqual(DEFAULT_SETTINGS);
		expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
		expect(normalizeSettings({ laneWidth: 10 }).laneWidth).toBe(180);
		expect(normalizeSettings({ laneWidth: 9999 }).laneWidth).toBe(480);
		expect(normalizeSettings({ laneWidth: 300.4, hideDone: true })).toEqual({ laneWidth: 300, hideDone: true });
	});
});

describe('pro facade', () => {
	it('is off with no manager', () => {
		expect(isPro()).toBe(false);
	});

	it('follows the GitHub Sponsors manager and tells listeners on each change', () => {
		const m = fakeManager(false);
		bindPro(m as never);
		const cb = vi.fn();
		const off = onProChange(cb);
		m.set(true);
		expect(isPro()).toBe(true);
		expect(cb).toHaveBeenCalledTimes(1);
		off();
		m.set(false);
		expect(cb).toHaveBeenCalledTimes(1);
		expect(isPro()).toBe(false);
	});

	it('reset unbinds the manager', () => {
		const m = fakeManager(true);
		bindPro(m as never);
		expect(m.listeners()).toBe(1);
		resetPro();
		expect(m.listeners()).toBe(0);
		expect(isPro()).toBe(false);
	});

	it('free shows one board per embed and the sponsor terms match product.yaml', () => {
		expect(FREE_MAX_BOARDS).toBe(1);
		expect(SPONSORS).toMatchObject({ clientId: 'Ov23lic5UPGPZqhBlBGg', sponsorLogin: 'theluckystrike', minMonthlyUsd: 5, oneTimeUsd: 15, scope: 'read:user' });
		expect(PRO_UI.priceText).toBe('Sponsor $5 a month, or $15 once. When you have paid $15 in total, Pro stays on.');
	});
});

describe('Pro gates', () => {
	const card = { lane: 0, index: 0, raw: '- [ ] a' } as never;

	it('move and add refuse without Pro and do not touch the board', async () => {
		const app = App.createConfigured__({ files: { 'Board.md': '## A\n- [ ] a\n## B\n' } });
		const plugin = new KanbanEmbedPlugin(app as never, manifest as never);
		const edit = vi.spyOn(plugin, 'edit');
		expect(await plugin.move('Board.md', card, 1, 0)).toBe(false);
		expect(await plugin.add('Board.md', 0, 'x')).toBe(false);
		expect(edit).not.toHaveBeenCalled();
	});

	it('move with Pro writes the board file', async () => {
		const app = App.createConfigured__({ files: { 'Board.md': '## A\n- [ ] a\n## B\n' } });
		const plugin = new KanbanEmbedPlugin(app as never, manifest as never);
		bindPro(fakeManager(true) as never);
		expect(await plugin.move('Board.md', card, 1, 0)).toBe(true);
		const f = app.vault.getFileByPath('Board.md')!;
		expect(await app.vault.read(f)).toBe('## A\n## B\n- [ ] a\n');
	});
});
