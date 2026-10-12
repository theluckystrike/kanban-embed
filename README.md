# Kanban Embed

Shows a Kanban board inside any note, read from the board file, with live updates, lane picking and card check-off.

Put a small code block in a project page, a daily note or a dashboard, and a board of the Kanban plugin shows there. The board stays one Markdown file. The request is issue 4 of the Kanban plugin, open since April 2021 with more than 250 reactions. Kanban Embed is a separate plugin by a different author. It does not need the Kanban plugin.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/kanban-embed.gif" alt="Open the project page, check off a card, then move a card to Review" width="720">

## Features

### A board inside any note

Add a `kanban-embed` code block with the name of the board. The block shows the lanes side by side, with the board name as a link and the number of cards. Each lane shows its card count. A lane with a card limit, such as `## In progress (3)`, shows `4/3` and gets a warning border when it is over the limit.

Cards show their links, tags and formatting. A date such as `@{2026-10-14}` shows as a chip. The block works in Reading view and in Live Preview.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/board-in-note.png" alt="The Website redesign board embedded in a project page, with four lanes and the over-limit lane" width="720">

### Pick lanes and hide done cards

Add `lanes: In progress, Review` to show only those lanes, in that order. Add `hide-done: true` to hide checked cards; the header says how many are hidden. A lane name that the board does not have shows a warning.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/pick-lanes.png" alt="A standup note that shows only the In progress and Review lanes, with done cards hidden" width="720">

### Check off cards and live update

Each card has a checkbox. Select it to check or uncheck the card. Only that one line of the board file changes.

When the Tasks plugin is on, a card that you check gets the Tasks done date, such as `✅ 2026-10-10`, and loses it when you uncheck the card. Kanban Embed hands the card line to Tasks, as the Kanban plugin does, so recurring tasks and the date format follow your Tasks settings. Without Tasks the card gets a plain `[x]`.

When the board file changes, in the Kanban plugin or after a sync, every embed of that board draws again. Before each change, Kanban Embed checks that the card line is still the same as on screen. If it is not, it does not write.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/check-off.png" alt="A checked card in the embed, with the same card checked in the board file" width="720">

### Move cards (Pro)

Drag a card to another lane, or to another place in the same lane. On a touch screen, use the card menu and choose "Move to" and a lane. A card that moves into a lane with the `**Complete**` marker is checked, with the Tasks done date when Tasks is on. A card that moves out of one is unchecked and loses the date.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/move-cards.png" alt="The card menu with the Move to items for the other lanes" width="720">

### Add cards (Pro)

Select "Add a card" at the bottom of a lane, type the text and press Enter. The card goes to the end of the lane. Escape cancels.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/add-card.png" alt="The add card field at the bottom of the Backlog lane" width="720">

### Several boards in one embed (Pro)

List more than one board, such as `board: [[Website redesign]], [[Mobile app]]`. Lanes with the same name become one column. Each card shows the name of its board. Moves stay inside the board of the card.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/several-boards.png" alt="The In progress and Review lanes of two boards merged into one embed" width="720">

### Card filter (Pro)

Add a line such as `filter: #design` or `filter: login #dev`. A card shows only when it has every word. A word with `#` must be a tag of the card, and `#design` also matches `#design/web`.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/filter.png" alt="Only the cards tagged design from both boards" width="720">

### Swimlanes (Pro)

Add `swimlane: #project/` to group the cards into rows. Each row is one project tag, such as `#project/launch`, and the lanes stay as columns. Select a row header to fold the row or open it again. Kanban Embed remembers which rows are folded.

Other forms are `swimlane: tag` (the first tag of each card), `swimlane: #now, #next, #later` (these rows in this order) and `swimlane: @{owner}` (one row for each value of a card field such as `[owner:: Ana]`). Cards without a value go to an Unassigned row.

Drag a card to another lane inside its row, or use Move to. The card text does not change, so it stays in its row. A drop on another row does nothing. "Add a card" in a row adds that row's tag or field.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/swimlanes.png" alt="The Team sprint board in two rows, launch and pricing, with the lanes as columns and a folded row" width="720">

## Install

Open Settings, then Community plugins, then Browse, and search for "Kanban Embed". Select Install, then Enable.

To install by hand, download `main.js`, `manifest.json` and `styles.css` from the latest release. Put them in `<vault>/.obsidian/plugins/kanban-embed/`. Reload the community plugins, then turn on Kanban Embed.

## Usage

Put the cursor where the board should go, run the command "Insert a board embed" and pick a board. It inserts this block:

~~~markdown
```kanban-embed
board: [[Website redesign]]
```
~~~

All the lines a block can have:

| Line | What it does |
| --- | --- |
| `board: [[Name]]` | The board to show. Also `boards:`. More than one board is Pro. |
| `lanes: A, B` | Show only these lanes, in this order. |
| `hide-done: true` | Hide checked cards. `false` overrides the setting. |
| `filter: words` | Only cards with every word. `#tag` words match tags. Pro. |
| `swimlane: value` | Rows across the lanes: `tag`, `#prefix/`, `#a, #b` or `@{field}`. Pro. |
| `title: Text` | Header text instead of the board name. |

The board name works like a link, so `[[Website redesign]]` finds the note anywhere in the vault. A line that starts with `#` or `//` is a comment. An unknown line shows a warning.

## Pro

The free version shows one board per embed, with lane picking, hidden done cards, check-off and live update. It has no time or card limit.

Pro adds moving cards (drag and drop or the Move to menu), adding cards, several boards in one embed, the card filter, and swimlane rows. To get it:

1. Sponsor [theluckystrike on GitHub Sponsors](https://github.com/sponsors/theluckystrike) with $5 a month, or $15 once. A total payment of $15 meets the payment requirement for Pro without further payment. Sign-in and the checks below still apply.
2. In Obsidian, open the settings of Kanban Embed and select "Sign in with GitHub".
3. Paste the code the plugin shows at github.com/login/device and approve.

If you sponsor after you sign in, select Refresh. A negative sponsorship answer turns Pro off.

## Settings

| Setting | What it does |
| --- | --- |
| Pro | Sign in, status, Refresh and Sign out. |
| Lane width | Width of one lane in pixels, from 180 to 480. The default is 240. |
| Hide done cards | Hide checked cards in every embed. A `hide-done` line wins for its block. |

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/settings.png" alt="The settings tab with the Pro section, lane width and hide done cards" width="720">

## FAQ

### Do I need the Kanban plugin?

No. Kanban Embed reads the board file itself. The Kanban plugin gives the full board view.

### Does Kanban Embed change my board files?

Only when you check, move or add a card. Each change edits only the lines of that card. The board settings and the archive stay as they are.

### Does it work on a phone or tablet?

Yes. Only drag and drop needs a mouse or trackpad. On a touch screen, use the Move to menu.

### Which board format does it read?

The Markdown format of the Kanban plugin: `kanban-plugin: board` in the frontmatter, one heading per lane and one list item per card. Archived cards do not show.

### How is this different from an embed with `![[Board]]`?

A normal embed shows the board as Markdown, one heading under the other. Kanban Embed shows the lanes side by side.

## Payment, account and network

The core features are free. Pro features need a GitHub Sponsors sponsorship of theluckystrike: $5 a month or more, or $15 once. A total payment of $15 meets the payment requirement for Pro without further payment. Sign-in and the checks below still apply. Your notes stay readable and editable with or without Pro.

GitHub handles the payment. Sponsor at https://github.com/sponsors/theluckystrike. You need no account for the free features. Pro needs the GitHub account that sponsors.

Until you select "Sign in with GitHub" in the settings, Kanban Embed makes no network requests. Sign in uses the GitHub device flow. Kanban Embed sends its public client ID and the scope `read:user` to `https://github.com/login/device/code` and shows you a code. While you enter the code at https://github.com/login/device, it asks `https://github.com/login/oauth/access_token` every few seconds to check the sign-in status. The scope permits profile reads only. GitHub needs this access to show the sponsorship tier. It grants no repository scope and no write access.

After sign in, Kanban Embed sends one query to `https://api.github.com/graphql`. It checks if the signed-in account sponsors theluckystrike. It asks for the tier and the total payment to theluckystrike. The plugin reuses a successful check for 7 days. Failed checks can retry after 6 hours. Select Refresh to request an earlier check. It sends no note content, file names or other vault data, and it has no telemetry.

After a successful check, Pro can work offline for up to 14 days. Sign out or a negative sponsorship answer turns Pro off. The plugin stores the GitHub token through the secret storage API of Obsidian. It does not put the token in its saved settings or its local sponsorship data. The local storage of this device keeps your GitHub login, the tier and the time of the last check. Sign out clears the token. You can also revoke the access in your GitHub settings, under Applications.

## Support

Report a bug or ask for a feature in the issue tracker of this repository. To support the work, use [GitHub Sponsors](https://github.com/sponsors/theluckystrike).

```
npm ci
npm run build
npm test
```

## License

MIT
