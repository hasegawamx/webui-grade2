---
name: javascript
description: JavaScript / TypeScript を書く・修正する際の最低限のベストプラクティス（モダン構文、非同期、エラーハンドリング、DOM 操作）。ユーザーが .js / .ts / .jsx / .tsx ファイルを編集する、関数やモジュールを追加する、非同期処理やイベントハンドラを書く、といった場面では必ずこのスキルを参照すること。JS スニペットのレビュー時も、安全性と可読性の観点から使うこと。
---

# JavaScript ベストプラクティス（最低限）

ブラウザでも Node でも通用する最低限の指針。言語機能はモダン（ES2020 以降）を前提とする。

## 変数と等価比較

- `var` は使わない。`const` を基本、再代入が必要な場合のみ `let`。
- 比較は `===` / `!==`。`==` による暗黙変換はほぼバグの温床。
- オブジェクトや配列の存在チェックに truthy 判定を使うときは、`0` や `""` が弾かれる副作用を意識する。値の有無を見たいなら `x == null` や `x !== undefined` を明示。

## 非同期は async/await

- Promise チェーンより `async/await` を優先する。読める・エラーが追える・try/catch が効く。
- `await` を並列化したいときは `Promise.all([...])`。ループ内で順次 `await` するとシリアル実行になる。
- Promise を返す関数は**常に**返す。裸で投げ捨てない（未処理の reject が迷子になる）。

```js
// 逐次（遅い）
for (const id of ids) {
  const user = await fetchUser(id);
  // ...
}

// 並列（速い）
const users = await Promise.all(ids.map(fetchUser));
```

## エラーハンドリング

- `try/catch` で握りつぶさない。最低でもログを出すか、上位に再 throw する。
- `catch (e)` の `e` は `unknown`（TS）として扱い、`instanceof Error` で絞る。
- ユーザー入力や外部 API の結果は境界で検証する。内部関数では信頼する。

## DOM 操作とイベント

- 文字列を `innerHTML` に入れない。XSS の窓口になる。テキストなら `textContent`、構造なら `createElement` + `append`。
- イベントリスナは解除できる形で追加する（`AbortController` を渡すのが最短）。
- クリック可能な要素は `<button>` を使う（HTML スキル参照）。JS で `div` にクリックを付けない。

```js
const controller = new AbortController();
button.addEventListener("click", onClick, { signal: controller.signal });
// 後で controller.abort() で一括解除
```

## モジュールと関数

- ES Modules（`import` / `export`）を使う。CommonJS との混在は環境が許すまで。
- 関数は小さく、1 つのことをする。副作用（I/O、DOM 変更）と純粋な計算を分けると、後からテストしやすい。
- デフォルトエクスポートよりも名前付きエクスポートを基本にする（grep しやすい／リネーム事故が減る）。

## 型と安全性

- TypeScript が使える環境なら `any` を禁忌とし、`unknown` + 絞り込みで書く。
- `// @ts-ignore` / `// @ts-expect-error` は理由をコメントで残す。
- オプショナルチェーン `?.` と nullish 合体 `??` を積極的に使う。`||` は 0 / "" / false を潰すので意図が違うことが多い。

## コレクション操作

- `map` / `filter` / `reduce` / `for...of` を状況で選ぶ。`forEach` は `await` と相性が悪いので非同期なら `for...of`。
- イミュータブルに書く（元配列を書き換えない）。`push` より `[...arr, x]`、`sort` は `[...arr].sort(...)`。配列を破壊するメソッド（`splice`, `reverse`, `sort`）には注意。

## 絶対にやらないこと

- `eval` / `Function` コンストラクタで文字列を実行する
- ユーザー入力をそのまま SQL / シェル / `innerHTML` / `new URL` に渡す
- Promise を await も return も catch もせず捨てる（floating promise）
- グローバルスコープへの変数汚染（`window.foo = ...` を気軽にやらない）

## チェックリスト

1. `var` が残っていないか
2. `==` を書いていないか
3. await の必要なところを抜かしていないか、逆に直列化してしまっていないか
4. catch で握り潰していないか
5. `innerHTML` にユーザー入力が流れていないか
6. イベントリスナや setInterval を張りっぱなしにしていないか（解除経路があるか）
