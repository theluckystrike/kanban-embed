# kanban-embed

## 1.2.2

### Patch Changes

- 85e6f8b: Treat a GitHub sponsorship reply without an amount as a failed check, not a refusal, and stop the GitHub sign in when the settings close or the plugin unloads.

## 1.2.1

### Patch Changes

- 15c0583: Keep a lane title such as C# whole, unload the rendered card text of the old board on each redraw, and make the README claims match the code.

## 1.2.0

### Minor Changes

- afca65e: Priority tags such as `#high` and `#low` give a card a colored border and a priority chip.

## 1.1.1

### Patch Changes

- efdff8f: Correct the GitHub Sponsors payment, check and token storage text in the README.

## 1.1.0

### Minor Changes

- dbb2711: Add swimlane rows (Pro): a `swimlane:` line groups the cards of an embed into rows by a tag, a tag prefix, a list of tags or a card field such as `@{owner}`. Rows fold and unfold, and a card moved or added inside a row keeps its row value. Fix, free and Pro: a card that is checked or moved into the Complete lane now gets the Tasks plugin done date, and loses it when unchecked or moved out, the same way the Kanban plugin does it.
