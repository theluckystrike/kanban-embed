# kanban-embed

## 1.1.1

### Patch Changes

- efdff8f: Correct the GitHub Sponsors payment, check and token storage text in the README.

## 1.1.0

### Minor Changes

- dbb2711: Add swimlane rows (Pro): a `swimlane:` line groups the cards of an embed into rows by a tag, a tag prefix, a list of tags or a card field such as `@{owner}`. Rows fold and unfold, and a card moved or added inside a row keeps its row value. Fix, free and Pro: a card that is checked or moved into the Complete lane now gets the Tasks plugin done date, and loses it when unchecked or moved out, the same way the Kanban plugin does it.
