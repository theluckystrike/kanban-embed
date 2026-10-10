// Pure logic of Kanban Embed: read a board file of the Kanban plugin (markdown lists under headings), and change
// one card at a time while every other line of the file stays byte for byte the same.
// Board format (obsidian-kanban 2.x): frontmatter "kanban-plugin: board"; each heading is a lane; "## Title (3)"
// sets a limit of 3 cards; a "**Complete**" line under the heading marks the lane's cards done; "***" followed
// by "## Archive" starts the archive; "%% kanban:settings" ... "%%" holds the board settings.

export interface Card {
	/** Card text: first line plus continuation lines, dedented, with the block id removed. */
	text: string;
	/** Card text with the date, time and block id tokens removed, for display. */
	title: string;
	checked: boolean;
	/** The character between the brackets, or null for a list item without a checkbox. */
	checkChar: string | null;
	/** Line index of the "- [ ]" line. */
	line: number;
	/** Line index after the last line of the card. */
	end: number;
	tags: string[];
	date: string | null;
	time: string | null;
}

export interface Lane {
	title: string;
	maxItems: number;
	/** True when the lane has the "**Complete**" marker: cards moved here are checked. */
	complete: boolean;
	/** Line index of the heading. */
	line: number;
	/** Line index of the "**Complete**" marker, or -1. */
	markerLine: number;
	cards: Card[];
}

export interface Board {
	/** True when the frontmatter has a kanban-plugin key. */
	isBoard: boolean;
	lanes: Lane[];
	archive: Card[];
	eol: string;
}

const CARD_RE = /^[-*+] (?:\[(.)\] ?)?(.*)$/;
const HEADING_RE = /^(#{1,6})[ \t]+(.*?)[ \t]*#*[ \t]*$/;
const CONT_RE = /^(?: {4}|\t)/;
const BLOCK_ID_RE = /[ \t]+\^[A-Za-z0-9-]+$/;
const DATE_RE = /@\{([^}\n]+)\}|@\[\[([^\]\n]+)\]\]/;
const TIME_RE = /@@\{([^}\n]+)\}/;
const TAG_RE = /(?:^|\s)#([^\s#.,;:!?()[\]{}"'`]+)/g;
const COMPLETE = '**Complete**';

/** Splits text into lines and remembers the line ending, so a write keeps it. */
export function splitLines(md: string): { lines: string[]; eol: string } {
	const eol = md.includes('\r\n') ? '\r\n' : '\n';
	return { lines: md.split(/\r?\n/), eol };
}

/** Index of the first line after the frontmatter (0 when there is none) and whether it marks a board. */
function frontmatter(lines: string[]): { body: number; isBoard: boolean } {
	if (lines[0] !== '---') return { body: 0, isBoard: false };
	for (let i = 1; i < lines.length; i++) {
		if (lines[i] === '---' || lines[i] === '...') {
			const isBoard = lines.slice(1, i).some((l) => /^kanban-plugin:\s*\S/.test(l));
			return { body: i + 1, isBoard };
		}
	}
	return { body: 0, isBoard: false };
}

/** Lane title and card limit from heading text, "Doing (3)" gives Doing and 3. */
export function parseLaneTitle(raw: string): { title: string; maxItems: number } {
	const s = raw.replace(/<br>/g, '\n').trim();
	const m = /^(.*?)\s*\((\d+)\)$/s.exec(s);
	if (!m) return { title: s, maxItems: 0 };
	return { title: m[1] ?? '', maxItems: Number(m[2]) };
}

/** Tags, date and time of a card, and its title without the date, time and block id tokens. */
export function cardMeta(text: string): Pick<Card, 'title' | 'tags' | 'date' | 'time'> {
	const time = TIME_RE.exec(text)?.[1] ?? null;
	const dm = DATE_RE.exec(text.replace(TIME_RE, ''));
	const date = dm ? (dm[1] ?? dm[2] ?? null) : null;
	const tags: string[] = [];
	for (const m of text.matchAll(TAG_RE)) if (m[1] && !tags.includes(`#${m[1]}`)) tags.push(`#${m[1]}`);
	const title = text
		.replace(new RegExp(`[ \\t]*(?:${TIME_RE.source})`, 'g'), '')
		.replace(new RegExp(`[ \\t]*(?:${DATE_RE.source})`, 'g'), '')
		.replace(/[ \t]+$/gm, '')
		.trim();
	return { title, tags, date, time };
}

/** Reads one card that starts at line i. Continuation lines are indented by a tab or four spaces. */
function readCard(lines: string[], i: number): Card | null {
	const m = CARD_RE.exec(lines[i] ?? '');
	if (!m) return null;
	let end = i + 1;
	while (end < lines.length && CONT_RE.test(lines[end] ?? '')) end++;
	const parts = [m[2] ?? '', ...lines.slice(i + 1, end).map((l) => l.replace(CONT_RE, ''))];
	const text = parts.join('\n').replace(/<br>/g, '\n').replace(BLOCK_ID_RE, '').trim();
	const checkChar = m[1] ?? null;
	return { text, ...cardMeta(text), checked: checkChar !== null && checkChar !== ' ', checkChar, line: i, end };
}

/** True when the last non-blank line before i is a thematic break (the archive follows one). */
function afterBreak(lines: string[], i: number): boolean {
	for (let j = i - 1; j >= 0; j--) {
		const l = (lines[j] ?? '').trim();
		if (l === '') continue;
		return /^(\*\s*){3,}$|^(-\s*){3,}$|^(_\s*){3,}$/.test(l);
	}
	return false;
}

/** Parses a board file. Text that is not a heading or a card (notes, blank lines, the settings block) is skipped. */
export function parseBoard(md: string): Board {
	const { lines, eol } = splitLines(md);
	const fm = frontmatter(lines);
	const lanes: Lane[] = [];
	const archive: Card[] = [];
	let lane: Lane | null = null;
	let inArchive = false;
	let fence = false;
	for (let i = fm.body; i < lines.length; i++) {
		const l = lines[i] ?? '';
		if (/^%% kanban:settings/.test(l)) break;
		if (/^(```|~~~)/.test(l)) fence = !fence;
		if (fence) continue;
		const h = HEADING_RE.exec(l);
		if (h) {
			inArchive = (h[2] ?? '').trim() === 'Archive' && afterBreak(lines, i);
			lane = inArchive ? null : { ...parseLaneTitle(h[2] ?? ''), complete: false, line: i, markerLine: -1, cards: [] };
			if (lane) lanes.push(lane);
			continue;
		}
		if (lane && lane.cards.length === 0 && l.trim() === COMPLETE) {
			lane.complete = true;
			lane.markerLine = i;
			continue;
		}
		const card = lane || inArchive ? readCard(lines, i) : null;
		if (!card) continue;
		(inArchive ? archive : lane!.cards).push(card);
		i = card.end - 1;
	}
	return { isBoard: fm.isBoard, lanes, archive, eol };
}

export interface CardRef {
	lane: number;
	card: number;
	/** The first line of the card as it was when the embed was drawn. A change returns stale when it differs. */
	expect?: string;
}

export type EditResult = { ok: true; md: string } | { ok: false; reason: 'stale' | 'missing' | 'no-checkbox' | 'empty' };

/** Finds a card and checks that its first line is still what the caller saw. */
function locate(board: Board, lines: string[], ref: CardRef): Card | EditResult {
	const card = board.lanes[ref.lane]?.cards[ref.card];
	if (!card) return { ok: false, reason: 'missing' };
	if (ref.expect !== undefined && lines[card.line] !== ref.expect) return { ok: false, reason: 'stale' };
	return card;
}

/** Sets the checkbox character of the first card line. */
function withCheck(line: string, checked: boolean): string {
	return line.replace(/^([-*+] )\[.\]/, `$1[${checked ? 'x' : ' '}]`);
}

/** Checks or unchecks one card. */
export function toggleCard(md: string, ref: CardRef, checked?: boolean): EditResult {
	const board = parseBoard(md);
	const { lines, eol } = splitLines(md);
	const card = locate(board, lines, ref);
	if ('ok' in card) return card;
	if (card.checkChar === null) return { ok: false, reason: 'no-checkbox' };
	lines[card.line] = withCheck(lines[card.line] ?? '', checked ?? !card.checked);
	return { ok: true, md: lines.join(eol) };
}

/** Line index where a card goes so that it becomes card number `index` of the lane (after removal of nothing). */
export function insertLine(lines: string[], lane: Lane, index: number): number {
	const cards = lane.cards;
	if (cards.length > 0) {
		const at = Math.max(0, Math.min(index, cards.length));
		return at < cards.length ? cards[at]!.line : cards[cards.length - 1]!.end;
	}
	if (lane.markerLine >= 0) return lane.markerLine + 1;
	const h = lane.line;
	// A lane heading on the last line before the final newline: the card goes before that newline.
	if (h + 1 === lines.length - 1 && lines[h + 1] === '') return h + 1;
	return (lines[h + 1] ?? '').trim() === '' && h + 1 < lines.length ? h + 2 : h + 1;
}

/** Inserts card lines at line `at`. An empty lane keeps a blank line between the heading and the card. */
function insertAt(lines: string[], at: number, cardLines: string[]): string[] {
	const out = lines.slice();
	out.splice(at, 0, ...cardLines);
	return out;
}

/**
 * Moves one card to another lane (or another place in the same lane). `to.index` is the place among the cards of
 * the target lane as the caller sees them, with the moved card still in its old place.
 * A card that enters a Complete lane is checked; a card that leaves one for a normal lane is unchecked.
 */
export function moveCard(md: string, from: CardRef, to: { lane: number; index: number }): EditResult {
	const board = parseBoard(md);
	const { lines, eol } = splitLines(md);
	const card = locate(board, lines, from);
	if ('ok' in card) return card;
	const src = board.lanes[from.lane]!;
	const dst = board.lanes[to.lane];
	if (!dst) return { ok: false, reason: 'missing' };
	let block = lines.slice(card.line, card.end);
	if (card.checkChar !== null && dst.complete !== src.complete) block[0] = withCheck(block[0] ?? '', dst.complete);
	if (from.lane === to.lane && (to.index === from.card || to.index === from.card + 1)) return { ok: true, md };
	const at = insertLine(lines, dst, to.index);
	const removed = lines.slice(0, card.line).concat(lines.slice(card.end));
	const shift = at > card.line ? card.end - card.line : 0;
	block = block.slice();
	return { ok: true, md: insertAt(removed, at - shift, block).join(eol) };
}

/** Adds a card at the end of a lane. The text becomes one line; a Complete lane gets a checked card. */
export function addCard(md: string, lane: number, text: string): EditResult {
	const clean = text.replace(/\s*\r?\n\s*/g, ' ').trim();
	if (clean === '') return { ok: false, reason: 'empty' };
	const board = parseBoard(md);
	const { lines, eol } = splitLines(md);
	const dst = board.lanes[lane];
	if (!dst) return { ok: false, reason: 'missing' };
	const at = insertLine(lines, dst, dst.cards.length);
	return { ok: true, md: insertAt(lines, at, [`- [${dst.complete ? 'x' : ' '}] ${clean}`]).join(eol) };
}

export type EditOp =
	| { type: 'toggle'; lane: number; card: number; checked?: boolean; expect?: string }
	| { type: 'move'; lane: number; card: number; toLane: number; index: number; expect?: string }
	| { type: 'add'; lane: number; text: string };

/** One change to a board file, as the embed asks for it. The golden vectors call this. */
export function applyEdit(md: string, op: EditOp): EditResult {
	if (op.type === 'toggle') return toggleCard(md, { lane: op.lane, card: op.card, expect: op.expect }, op.checked);
	if (op.type === 'move') return moveCard(md, { lane: op.lane, card: op.card, expect: op.expect }, { lane: op.toLane, index: op.index });
	return addCard(md, op.lane, op.text);
}
