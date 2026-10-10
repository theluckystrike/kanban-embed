# Kanban Embed

Shows a Kanban board inside any note, read from the board file, with live updates, lane picking and card check-off.

Put a small code block in a project page, a daily note or a dashboard, and a board of the Kanban plugin shows there, next to your other text. The board stays one Markdown file. The request to embed a board in a page is issue 4 of the Kanban plugin, open since April 2021 with more than 250 reactions. Kanban Embed is a separate plugin by a different author, and it does not need the Kanban plugin to be installed.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/kanban-embed.gif" alt="Open the project page, check off a card, then move a card to Review" width="720">

## Features

### A board inside any note

Add a `kanban-embed` code block with the name of the board. The block shows the lanes side by side. The header shows the board name as a link and the number of cards. Each lane shows its card count. When a lane has a card limit, such as `## In progress (3)`, the count shows as `4/3` and an over-limit lane gets a warning border.

Cards show their text with links, tags and formatting. A date such as `@{2026-10-14}` shows as a chip under the card. The block works in Reading view and in Live Preview.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/board-in-note.png" alt="The Website redesign board embedded in a project page, with four lanes and the over-limit lane" width="720">

### Pick lanes and hide done cards

Add `lanes: In progress, Review` to show only those lanes, in that order. Add `hide-done: true` to hide checked cards; the header then says how many are hidden. A lane name that the board does not have shows a warning, so a typo is easy to find.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/pick-lanes.png" alt="A standup note that shows only the In progress and Review lanes, with done cards hidden" width="720">

### Check off cards and live update

Each card has a checkbox. Select it to check or uncheck the card. Kanban Embed changes only that one line of the board file.

When the board file changes, for example in the Kanban plugin or after a sync, every embed of that board draws again. Before each change, Kanban Embed checks that the card line is still the same as on screen. If it is not, it does not write, and the embed draws again.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/check-off.png" alt="A checked card in the embed, with the same card checked in the board file" width="720">

### Move cards (Pro)

Drag a card to another lane, or to another place in the same lane. On a touch screen, open the card menu with the button on the card, then choose "Move to" and a lane. A card that moves into a lane with the `**Complete**` marker becomes checked, and a card that moves out of one becomes unchecked. The card keeps its other lines, tags, dates and block ID.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/move-cards.png" alt="The card menu with the Move to items for the other lanes" width="720">

### Add cards (Pro)

Select "Add a card" at the bottom of a lane, type the text and press Enter. The card goes to the end of that lane in the board file. Escape cancels.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/add-card.png" alt="The add card field at the bottom of the Backlog lane" width="720">

### Several boards in one embed (Pro)

List more than one board, such as `board: [[Website redesign]], [[Mobile app]]`. Lanes with the same name become one column, so the In progress cards of all your projects sit side by side. Each card shows the name of its board. Moves stay inside the board of the card.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/several-boards.png" alt="The In progress and Review lanes of two boards merged into one embed" width="720">

### Card filter (Pro)

Add a line such as `filter: #design` or `filter: login #dev`. A card shows only when it has every word of the filter. A word that starts with `#` must be a tag of the card, and `#design` also matches `#design/web`.

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/filter.png" alt="Only the cards tagged design from both boards" width="720">

## Install

When Kanban Embed is listed in the community directory, open Settings, then Community plugins, then Browse, and search for "Kanban Embed". Select Install, then Enable.

To install by hand, download `main.js`, `manifest.json` and `styles.css` from the latest release. Put the three files in `<vault>/.obsidian/plugins/kanban-embed/`. Restart Obsidian or reload the list of community plugins, then turn on Kanban Embed.

## Usage

Put the cursor where the board should go, run the command "Insert a board embed" and pick a board. The list shows every note with `kanban-plugin` in its frontmatter. The command inserts this block:

~~~markdown
```kanban-embed
board: [[Website redesign]]
```
~~~

All the lines a block can have:

| Line | What it does |
| --- | --- |
| `board: [[Name]]` | The board to show. Also `boards:`. More than one board is a Pro feature. |
| `lanes: A, B` | Show only these lanes, in this order. |
| `hide-done: true` | Hide checked cards. `false` shows them even when the setting hides them. |
| `filter: words` | Show only cards with every word. `#tag` words match tags. Pro. |
| `title: Text` | Text for the header instead of the board name. |

The board name works like a link, so `[[Website redesign]]` finds the note anywhere in the vault. A line that starts with `#` or `//` is a comment. An unknown line shows a warning and the board still shows.

## Pro

The free version shows one board per embed, with lane picking, hidden done cards, check-off and live update. It has no time or card limit.

Pro adds moving cards (drag and drop or the Move to menu), adding cards, several boards in one embed, and the card filter. To get it:

1. Sponsor [theluckystrike on GitHub Sponsors](https://github.com/sponsors/theluckystrike) with $5 a month, or $15 once. When you have paid $15 in total, Pro stays on.
2. In Obsidian, open the settings of Kanban Embed and select "Sign in with GitHub".
3. The plugin copies a code and opens github.com/login/device. Paste the code there and approve.

The status line then shows your GitHub login and the tier. If you sponsor after you sign in, select Refresh. If a monthly sponsorship ends before you have paid $15 in total, Pro turns off at the next check, within 7 days. Your code blocks stay as they are.

## Settings

| Setting | What it does |
| --- | --- |
| Pro | Sign in with GitHub, the status line, Refresh and Sign out. |
| Lane width | Width of one lane in pixels, from 180 to 480. The default is 240. |
| Hide done cards | Hide checked cards in every embed. A `hide-done` line in a block wins over this setting for that block. |

<img src="https://raw.githubusercontent.com/theluckystrike/kanban-embed/HEAD/docs/settings.png" alt="The settings tab with the Pro section, lane width and hide done cards" width="720">

## FAQ

### Do I need the Kanban plugin?

No. Kanban Embed reads the board file itself. You need the Kanban plugin for the full board view and its other features.

### Does Kanban Embed change my board files?

Only when you check, move or add a card. Each change edits only the lines of that card, so the board settings and the archive stay as they are.

### Does it work on a phone or tablet?

Yes. Everything works on mobile except drag and drop, which needs a mouse or trackpad. On a touch screen, use the Move to menu.

### Which board format does it read?

The Markdown format of the Kanban plugin: `kanban-plugin: board` in the frontmatter, one heading per lane, one list item per card, and the archive after `***`. Archived cards do not show.

### How is this different from an embed with `![[Board]]`?

A normal embed shows the board as Markdown, one heading under the other. Kanban Embed shows the lanes side by side and can move and add cards.

## Payment, account and network

The core features are free and stay free. Pro features need a GitHub Sponsors sponsorship of theluckystrike: $5 a month or more, or $15 once. When you have paid $15 in total, Pro stays on. Your notes stay readable and editable with or without Pro.

GitHub handles the payment. Sponsor at https://github.com/sponsors/theluckystrike. You need no account for the free features. Pro needs the GitHub account that sponsors.

Until you select "Sign in with GitHub" in the settings, Kanban Embed makes no network requests. Sign in uses the GitHub device flow. Kanban Embed sends its public client ID and the scope `read:user` to `https://github.com/login/device/code` and shows you a code. While you enter the code at https://github.com/login/device, it asks `https://github.com/login/oauth/access_token` every few seconds whether sign in is done. The scope `read:user` is read-only access to your profile, which GitHub needs to show the sponsorship tier. It gives no access to repositories and no write access.

After sign in, Kanban Embed sends one query to `https://api.github.com/graphql`: does the signed-in account sponsor theluckystrike, at which tier, and how much it has paid theluckystrike in total. It asks again at most once every 7 days, or when you select Refresh. It sends no note content, file names or other vault data, and it has no telemetry.

Pro keeps working for 14 days without a successful check. The GitHub token stays in the secret storage of Obsidian on this device. It is not written to data.json or other vault files, so it does not sync or reach a git repository. The local storage of this device keeps your GitHub login, the tier and the time of the last check. Sign out deletes the token. You can also revoke the access in your GitHub settings, under Applications.

## Support

Report a bug or ask for a feature in the issue tracker of this repository. To support the work, use [GitHub Sponsors](https://github.com/sponsors/theluckystrike).

```
npm ci
npm run build
npm test
```

## License

MIT
