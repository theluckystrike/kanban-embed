import { PluginSettingTab, type SettingDefinitionItem } from 'obsidian';
import { sponsorsSettingItems } from './license/github-obsidian';
import { PRO_UI, isPro } from './pro';
import type KanbanEmbedPlugin from './main';

export interface KanbanEmbedSettings {
	/** Width of one lane in pixels. */
	laneWidth: number;
	/** Hide checked cards in embeds that have no hide-done line. */
	hideDone: boolean;
}

export const LANE_MIN = 180;
export const LANE_MAX = 480;

export const DEFAULT_SETTINGS: KanbanEmbedSettings = {
	laneWidth: 240,
	hideDone: false,
};

/** Fills gaps and drops bad values from saved data, so old or hand-edited data.json never breaks the plugin. */
export function normalizeSettings(saved: Partial<KanbanEmbedSettings> | null | undefined): KanbanEmbedSettings {
	const s = saved ?? {};
	const w = typeof s.laneWidth === 'number' && Number.isFinite(s.laneWidth) ? Math.round(s.laneWidth) : DEFAULT_SETTINGS.laneWidth;
	return {
		laneWidth: Math.min(LANE_MAX, Math.max(LANE_MIN, w)),
		hideDone: typeof s.hideDone === 'boolean' ? s.hideDone : DEFAULT_SETTINGS.hideDone,
	};
}

export class KanbanEmbedSettingTab extends PluginSettingTab {
	plugin: KanbanEmbedPlugin;

	constructor(app: ConstructorParameters<typeof PluginSettingTab>[0], plugin: KanbanEmbedPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			...(this.plugin.pro ? sponsorsSettingItems(this.plugin.pro, PRO_UI) : []),
			{
				name: 'Lane width',
				desc: `Width of one lane in pixels, from ${LANE_MIN} to ${LANE_MAX}. Lanes that do not fit scroll sideways.`,
				control: { type: 'slider', key: 'laneWidth', defaultValue: DEFAULT_SETTINGS.laneWidth, min: LANE_MIN, max: LANE_MAX, step: 20 },
			},
			{
				name: 'Hide done cards',
				desc: 'Hide checked cards in every embed. A hide-done line in a block overrides this for that block.',
				control: { type: 'toggle', key: 'hideDone', defaultValue: DEFAULT_SETTINGS.hideDone },
			},
			{
				name: 'Pro features',
				desc: isPro()
					? 'Pro is on: move cards by drag and drop or the Move to menu, add cards, several boards in one embed, and the card filter.'
					: 'Free version: one board per embed, lane picking, check off cards, live update. Pro adds moving cards, adding cards, several boards in one embed, and the card filter.',
			},
		];
	}

	async setControlValue(key: string, value: unknown): Promise<void> {
		await super.setControlValue(key, value);
		this.plugin.settings = normalizeSettings(this.plugin.settings);
		for (const e of this.plugin.embeds) e.schedule(0);
	}
}
