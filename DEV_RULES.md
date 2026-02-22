# DEV RULES

## Commit message

- `feat:` 機能追加
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `chore:` 依存更新・設定・雑多な整理
- `refactor:` 振る舞いを変えない改善
- `style:` 見た目・整形など（挙動は変えない）

## Notes

- 迷ったら `chore:` でOK
- このルールは将来的に変更してもOK

## Branch naming

- 形式: `type/short-description`
- `type` は commit と同じカテゴリを使う
- 例: `feat/profile-home`, `fix/basepath-links`, `docs/dev-rules`, `chore/deps`, `refactor/section-data`, `style/color-tune`

## PR workflow

- `main` からブランチ作成 → 作業 → PR
- PR タイトルは commit と同じ prefix を使う（例: `feat: add works page`）
- PR には必ず以下を1行ずつ書く
- Summary（何を変えたか）
- Testing（`npm run build` など）
- UI変更があるときはスクショ
- マージ方式は `Squash and merge` 推奨（履歴を短く保つ）
