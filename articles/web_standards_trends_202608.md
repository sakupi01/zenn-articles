---
title: "Web 標準動向 2026年8月版"
emoji: "🏄‍♂️"
type: "idea"
topics: ["cybozuwebstandards", "frontend"]
published: true
publication_name: "cybozu_frontend"
published_at: 2026-09-01 17:00
---

こんにちは！ サイボウズ株式会社 デザインテクノロジストの [saku (@sakupi01)](https://x.com/sakupi01) です。

## はじめに

サイボウズは 2025 年 4 月より、W3C のメンバーに加入しました。
https://blog.cybozu.io/entry/joining-w3c
標準化プロセスに関わることができるようになるための最初の一歩として、フロントエンドエンジニアの一部のメンバーは積極的に Web 標準のキャッチアップを行っています。
そこで、毎月メンバーが興味を持った Web 標準に関する話題や、実際に標準化プロセスに関わることができた場合にはその報告などを 1 つの記事としてまとめ、紹介していきます。
また、ここでは W3C に限らず、TC39 や WHATWG などの標準化団体のトピックについても扱います。

:::message
今月の執筆者は以下の 5 名です。

- [saji](https://x.com/sajikix)
  - 主に国際化まわりのトピックを執筆
- [saku](https://x.com/sakupi01)
  - HTML, CSS に関連するトピックを執筆
- [くらっち](https://x.com/kuracchi04)
  - ECMA262 周りのトピックを執筆
- [mehm8128](https://x.com/mehm8128)
  - 主にアクセシビリティに関連するトピックを執筆
- [kosakin](https://x.com/karintou)
  - 主に editing まわりのトピックを執筆

:::

## イベントのお知らせ

https://w3c-japan.connpass.com/event/402633/

9/4（金）に、サイボウズ東京オフィスにて「W3C Japan 30 周年記念イベント - Web Together」が開催されます。ぜひご参加ください。

## HTML

### Gecko: Intent to Unship: XSLT

https://groups.google.com/a/mozilla.org/g/dev-platform/c/ZRyt5CzAGfA

[10月版の記事](https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202510)で Chromium の Deprecate and Remove を紹介した XSLT について、Firefox も段階的に無効化する Intent to Unship を出しました。利用率が 0.1% 未満にとどまる一方で、多くのセキュリティ問題の原因になってきたことが理由です。Nightly での早期無効化を経て、2027 年 8 月に全チャネルで無効化＆削除する計画です。

Chromium は Chrome 152 で Deprecation Trial を開始済みです。Chrome 158（2026/11 予定）で Stable でもデフォルト無効になり、Chrome 176（2027/8 予定）で Trial と Policy も終了するタイムラインが共有されています。WebKit も削除には前向きなようです。

仕様側でも、XSLT に触れる箇所へ client-side XSLT の使用を避けるよう促す警告を追加する PR がマージされ、「Web プラットフォームから削除する過程にある」ことが明記されました。

- Mark XSLT deprecated
  - https://github.com/whatwg/html/pull/12805

`XSLTProcessor` や `<?xml-stylesheet?>` に依存しているページ向けには、polyfill が移行先として案内されています。

- https://github.com/mfreed7/xslt_polyfill

### Generalizing command invokers

https://github.com/openui/open-ui/issues/1487

`command` / `commandfor` 属性による Invoker Commands を一般化し、1 つの操作対象へ複数の `trigger` と `command` や `interest` を宣言できる汎用的な `<command>` 要素の案が Open UI で議論されています。

### Intent to Prototype: Persistent Widgets

https://groups.google.com/a/chromium.org/g/blink-dev/c/DGHoP1k2t2E

同一 Origin であれば、ページを遷移しても中身が維持される `<iframe>` のような要素が提案されています。特に `<iframe>` で何かを埋め込み、その状態を維持するために、画面遷移を SPA にしているタイプのサービスが、MPA で実装できるようになる可能性があります。

### Intent to Ship: Remove FencedFrame element and window.fence APIs

https://groups.google.com/a/chromium.org/g/blink-dev/c/c9w5uH3eSuo/m/vAwMPoL5AgAJ

Privacy Sandbox の一環として策定された `<fencedframe>` が段階的に削除されることになりました。この要素は Protected Audience / Shared Storage `selectURL` という仕様と連携しており、それらが削除されることに伴う変更でもあります。Privacy Sandbox はすでに終了しているため、その後始末の一部と言えます。

## CSS

### Gecko: Intent to Ship: CSS at-rule() function for @supports

https://groups.google.com/a/mozilla.org/g/dev-platform/c/aSM-iNla8CM/m/E_u53o93AAAJ

[3月版の記事](https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202603)で紹介した `@supports at-rule()` が、Firefox 157 でデフォルト有効にする Intent to Ship です。

Chrome は 148 で Ship 済み、WebKit も Safari Technology Preview 251 で対応が入っています。`property` と `value` の組では判定できなかった機能検出が、近々 3 エンジンで揃う見通しです。

- Release Notes for Safari Technology Preview 251
  - https://webkit.org/2026/08/26/release-notes-for-safari-technology-preview-251/

```css
@import "entry-animations.css" supports(at-rule(@starting-style));
```

非対応ブラウザでは `@supports` の条件が偽になるだけなので、progressive enhancement としても導入しやすいでしょう。

### CSS Mixins converges on `@private` and `@mixin`

https://github.com/w3c/csswg-drafts/issues/14243

[7月版の記事](https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202607)で Blink の Intent to Prototype を紹介した CSS Mixins について、改めて文法を整理する動きです。

これまでの案では、mixin の出力を `@result` で包み、内側を結果、外側を内部変数として扱っていました。

```css
@mixin --foo {
  --local: 10px;
  @result {
    padding: var(--local);
  }
}
```

今回の合意で `@result` は廃止され、反対に内部変数の側を `@private` で包み、`@private` 以外の mixin body 全体を結果として返す構文へ変わります。これにより、内部変数を使わない mixin では、宣言をそのまま並べるだけで済むようになります。

```css
@mixin --foo {
  @private {
    --local: 10px;
  }
  padding: var(--local);
}
```

`@private` は mixin 専用の仕組みではなく、`style rule` にネストして `custom property` を局所化する一般的なルールとして仕様化を始めることも同じく合意されました。

今回の仕様の修正の結果、`@mixin` と `@macro` の 2 本立てだった構文は `@mixin` へ統合されます。両者の差分だった `@scope` 相当の制約の有無がなく、機能的な差分が実質なくなったためです。

### Wildcard class selector syntax `.foo-*`

https://github.com/w3c/csswg-drafts/issues/10001

ハイフン区切りの class 名の prefix に一致する `.foo-*` 構文を採用することが合意されました。utility class のように prefix を共有する class を、まとめて選択できるようになります。

一致の区切りをハイフンに限定するのは、`.foo-*` のような指定が `.foobar` のような別の単語の一部に一致しないようにするためと、パフォーマンスのためです。現時点の対象は class selector のみですが、将来的な構想として、属性セレクタや要素セレクタなどへ拡張する展望も議論されています。

- The Future of CSS: Target Multiple Classes with the Class Prefix Selector
  - https://www.bram.us/2026/08/20/the-future-of-css-target-multiple-classes-with-the-class-prefix-selector/

## ARIA・WCAG

### Updated W3C Recommendation: ARIA in HTML | 2026 | News | W3C

https://www.w3.org/news/2026/updated-w3c-recommendation-aria-in-html/

`html-aria` が 4 ヶ月ぶりに更新されました。

- `<selectedcontent>` 要素の追加
- `img` 要素に `math` role を許可
- `button` や `input` 要素の一部の type に `separator` role を許可

など、いくつかの変更が含まれています。

### CORE-AAM: Require ariaNotify announcements to be translated when the page is auto-translated

https://github.com/w3c/aria/pull/2860

[先月紹介した](https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202607#add-explicit-language-and-direction-metadata-to-arianotificationoptions-%C2%B7-issue-%232828-%C2%B7-w3c%2Faria) `ariaNotify` の翻訳についての続報です。

先月の時点では、`ariaNotify` に新しくオプションを追加し、指定された言語に翻訳してアナウンスするという提案が行われていました。しかし今回 `w3c/aria` リポジトリに作成された PR では、「ページが翻訳されている場合に、自動的にその言語に翻訳してアナウンスする」という仕様になっています。

既にこの仕様で WebKit 側の実装が行われ、マージまで進んでいるようです。

https://github.com/WebKit/WebKit/pull/71083

## JavaScript

### ECMA262

#### Iterator Join for stage 4

https://github.com/tc39/proposal-iterator-join

イテレータの内容を区切り文字で連結して文字列にする `Iterator.prototype.join` を追加する提案です。TC39 第 116 回の MTG（2026 年 9 月）で Stage 4 への昇格が提案されています。

`Iterator.prototype.join` は `Array.prototype.join` と同じ挙動をイテレータのまま行えるようにするものです。セパレータ省略時は `","` が使われ、`undefined` や `null` の要素が空文字列になる点も `Array.prototype.join` と揃えられています。

```javascript
// これまで: いったん配列に変換する必要があった
Array.from(map.keys()).join(', ');

// この提案: イテレータのまま連結できる
map.keys().join(', ');

// ジェネレータなど任意のイテレータにもそのまま使える
function* fruits() {
  yield 'apple';
  yield 'banana';
}
fruits().join(' / '); // "apple / banana"
```

すでに Stage 3 の要件である仕様書と `test262` テストが揃っています。

実装も Firefox 154 でデフォルト有効になっているほか、Chrome 153 beta でも利用可能になっており、Stage 4 の要件は揃いつつある状況です。

#### Composites for stage 2

https://github.com/tc39/proposal-composites

`Map` や `Set` のキーとして使える、値ベースの等価性を持つ `Composite` を導入する提案です。

TC39 第 116 回の MTG（2026 年 9 月）で Stage 1 から Stage 2 への昇格が提案されています。

現在の `Map` / `Set` は要素の同一性判定に `SameValueZero` を使うため、オブジェクトは「自分自身とだけ等しい」扱いになります。

構造化された値をキーにしたくても、中身が同じ 2 つのオブジェクトは別物と判定されてしまい、この挙動を変える手段はありません。

回避策として `JSON.stringify` で文字列化してキーにする方法がありますが、キーの列挙順で結果が変わる、循環参照で例外になるなど、正しく使うのが難しいものでした。

`Composite` は「中身で等価判定したい場合に明示的に選べる別の手段」で、これを使うと同じ中身なら同じ参照になるオブジェクトを作れるようになります。

```javascript
const pos1 = Composite({ x: 1, y: 4 });
const pos2 = Composite({ x: 1, y: 4 });
pos1 === pos2; // true（同じ値の組からは同じオブジェクトが返る）

// 既存の Map / Set でそのままキーとして機能する
const itemAtPosition = new Map();
itemAtPosition.set(pos1, "book");
itemAtPosition.get(Composite({ x: 1, y: 4 })); // "book"

// キーはソートされ正規形を持つため、記述順は等価性に影響しない
Composite({ b: 2, a: 1 }) === Composite({ a: 1, b: 2 }); // true
```

## Editing

### EditContext needs a way to inform IMEs of vertical writing modes

https://github.com/w3c/edit-context/issues/149

`EditContext` で縦書きの IME に対応するための API が議論されています。`EditContext` はレイアウト情報を明示的に定義できるのが理想のため、現在位置の DOM の `writing-mode` から判定するのではなく、API 経由となります。

## Baseline

### 📃 August 2026 release notes

https://web-platform-dx.github.io/web-features-explorer/release-notes/august-2026/

## Misc

### Web Sustainability Guidelines を読む会 #3

https://zenn.dev/wsgj/articles/77361bd8af1307

Web Sustainability Guidelines を読む会の第三回が開催されました。

今回も「Prosperity」を軸としてフィルタリングし、いくつかの項目を眺めながら意見交換が行われました。

また、7 月のリリースノートや、Web Sustainability Guidelines を読む意義について説明する記事も出ているので、併せてご覧ください。

- [2026年7月のWeb Sustainability Guidelinesリリースノート](https://zenn.dev/wsgj/articles/0a8f9edd4482f3)
- [なぜ、今Web Sustainability Guidelinesを読むのか](https://zenn.dev/wsgj/articles/4df34dbee6e5c9)

### 消費者庁、「ダークパターン」規制へ　特商法改正視野に中間取りまとめ案

https://www.itmedia.co.jp/news/article/2608/24/2000000728/

消費者庁が、ダークパターンを法律で規制できるようにする中間取りまとめ案を公表しました。

従来は特定商取引法や景品表示法に間接的に当てはめて規制することしかできませんでしたが、特定商取引法を改正する形で、より直接的に規制できるようにすることを視野に入れているとのことです。

### TPAC 2026 | W3C TPAC | News and events | W3C

https://www.w3.org/news-events/tpac/2026/

W3C の年次会議 TPAC 2026 の参加登録が始まりました。10/26（月）〜 10/30（金）にアイルランドのダブリンで開催され、オンラインでも参加できるハイブリッド形式です。登録締切は 10/16 です。

Breakout Sessions の登録も始まっています。

- Issues · w3c/tpac2026-breakouts
  - https://github.com/w3c/tpac2026-breakouts/issues
