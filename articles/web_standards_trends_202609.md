---
title: "Web 標準動向 2026年9月版"
emoji: "🍇"
type: "idea"
topics: ["cybozuwebstandards", "frontend"]
published: true
publication_name: "cybozu_frontend"
published_at: 2026-09-30 18:00
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
- [mehm8128](https://x.com/mehm8128)
  - 主にアクセシビリティに関連するトピックを執筆

:::

## イベントのお知らせ

https://www.w3.org/news-events/tpac/2026/

TPAC 2026（10/26〜10/30）の締切が近づいています。参加登録は 10/16 まで、月〜水の Breakout Sessions の提案は 10/8 までです。9 月には agentic web 関連を中心に 20 件ほどの Breakout Session の提案が出ています。

- w3c/tpac2026-breakouts
  - https://github.com/w3c/tpac2026-breakouts

## HTML

### Gecko: Intent to ship: Scoped Custom Element Registries

https://groups.google.com/a/mozilla.org/g/dev-platform/c/lYP_ZPcrKOg

Scoped Custom Element Registries が、Firefox 159 で ship されます。Safari と Chrome は Ship 済みのため、今回で主要ブラウザでの実装が揃う見通しです。

prototype 中に Sanitizer API との統合で問題が見つかったため、[8月版の記事](https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202608)で紹介した Sanitize While Parsing を前提としている点も興味深いかもしれません。

- Intent to ship: Sanitize While Parsing
  - https://groups.google.com/a/mozilla.org/g/dev-platform/c/pBp2LDM2vqI
- Sanitizer: add javascriptURLs option to SanitizerConfig and Sanitizer
  - https://github.com/whatwg/html/pull/12898

### HTML-in-Canvas

https://github.com/whatwg/html/issues/10650

[2025年11月版の記事](https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202511)で紹介した HTML-in-Canvas が WHATNOT で Stage 3 になりました。2 つめの実装として WebKit も実装に着手しています。

他ベンダーの feedback を受けて API も変わっています。描画できるのは canvas の直接の子に限られなくなったり、`<canvas>` の opt-in 属性が `layoutsubtree` から `content=drawable` に改名されたりなど、多くのアップデートが行われています。

- Add HTML-in-Canvas APIs
  - https://github.com/whatwg/html/pull/11588

canvas のテキストを細かく扱う Enhanced Canvas TextMetrics の Intent to Ship も出ており、API Owner から「HTML-in-Canvas と同時に ship したい」という意見が出て、判断が持ち越されています。WebKit は accessibility や i18n を正しく扱える HTML-in-Canvas を先に出すべきという立場で、この API の設計もこれから検討が繰り返されていきそうです。

- Intent to Ship: Enhanced Canvas TextMetrics
  - https://groups.google.com/a/chromium.org/g/blink-dev/c/Wf1iK1bc_00/m/JDtlgk-eAwAJ

HTML-in-Canvas のアップデートについては、専用のメーリングリストも活用できます。

- HTML-in-Canvas developer newsletter
  - https://groups.google.com/g/html-in-canvas-developer-newsletter

### SpellCheck Custom Dictionary / exemptions

https://github.com/whatwg/html/issues/12388

ページから spell check の辞書に単語を追加する SpellCheck Custom Dictionary が WHATWG で Stage 2 になりました。固有名詞や造語に波線が出るのを抑えるためのもので、追加した語は文書の中だけで有効です。
現在、Chromium と WebKit で prototype が行われているとのことです。

```javascript
document.spellCheckCustomDictionary.addWords(["kintone"]);
```

### Blink: Intent to Prototype: `<rangegroup>` element

https://groups.google.com/a/chromium.org/g/blink-dev/c/QbFxuQM1UHU/m/UBHtDtFgCQAJ

複数の `<input type="range">` を 1 本の track にまとめ、価格帯の下限と上限のようなスライダーを作れる `<rangegroup>` 要素の Intent to Prototype です。子は通常の range input なので、Form Controls としての機能や、アクセシビリティの機能をそのまま利用できます。

```html
<rangegroup>
  <legend>価格帯</legend>
  <label>下限 <input type="range" name="min" value="20"></label>
  <label>上限 <input type="range" name="max" value="80"></label>
</rangegroup>
```

現在も Open UI で議論が進められており、特に Thumb（range のツマミ部分）が 3 つ以上になるケースなど、多くのユースケースに対応できる柔軟な API 設計が引き続き検討されています。

- `<rangegroup>` proposal — Open UI
  - https://brechtdr.github.io/enhanced-range-slider-poc/

## CSS

### Add prefers-bold-text user preference media feature

https://github.com/w3c/csswg-drafts/issues/14477

新しいメディアクエリ `prefers-bold-text` の提案です。

モバイル端末では、読みやすさ向上のために「テキストを太字にする」のような設定をすることができるようになっています。

しかし Web 上でその設定を検出し、タイポグラフィを調整できるような機能は備わっていませんでした。

そこで今回、`@media (prefers-bold-text: bold)` という形式でテキストの太さの好みを検出し、タイポグラフィを調整できるような機能が提案されています。

併せて、アクセシビリティの観点からのレビューも行われています。

- [css-fonts][mediaqueries-5] Add prefers-bold-text user preference media feature · Issue #351 · w3c/a11y-tracking
  - https://github.com/w3c/a11y-tracking/issues/351

### [css-forms-1] Improve appearance: base `<select>` styling to be usable as-is

https://github.com/w3c/csswg-drafts/issues/14256

`appearance: base` の form control の既定スタイルについて、CSSWG で見直す検討が続いています。角丸は `4px`、disabled なら `cursor: not-allowed`、border の色は `currentColor` を薄めた色、といった具合に、何も指定しなくても使える見た目を目指しています。

Safari 27.0 が customizable select を ship したことで、Chromium に続く 2 つ目のエンジンでも使えるようになっており、今後も関係者を広げてさらに議論が進んでいく見込みです。

- WebKit Features for Safari 27.0
  - https://webkit.org/blog/18325/webkit-features-for-safari-27-0/

### Blink: Intent to Ship: CSS text-overflow: `<string>` value

https://groups.google.com/a/chromium.org/g/blink-dev/c/nxS-FiaEZM0/m/_086uukUCgAJ

`text-overflow` に任意の文字列を指定できるようにする Intent to Ship です。Firefox は対応済みで、WebKit も実装がマージされています。

```css
.title {
  text-overflow: "…(more)";
}
```

### [css-conditional-5] Allow writing-mode in style queries

https://github.com/w3c/csswg-drafts/issues/14527

style queries で、custom property 以外に `writing-mode` も例外的に判定できるようにする提案です。縦書きのときだけ装飾の矢印を回転させるなど、論理プロパティへの置き換えでは済まないデザインの切り替えが用途です。

```css
/* issue で挙げられた例 */
@container style(writing-mode: vertical-rl) {
  .decorative-arrow {
    rotate: 90deg;
  }
}
```

`writing-mode` は値が keyword だけで継承され、animation もしないため、任意のプロパティで生じる難しさを避けられることが例外対応の理由として挙げられています。

## ARIA・WCAG

### Deprecate aria-flowto

https://github.com/w3c/aria/issues/2889

要素の id を指定して次に読み上げてほしい要素を指定する `aria-flowto` 属性が、非推奨化される動きが出てきています。

理由としては、ループに関する問題や、[aria-flowto_attribute (aria) | Accessibility Support](https://a11ysupport.io/tech/aria/aria-flowto_attribute) を見ても分かるようにスクリーンリーダーのサポート率が低いことなどがあり、issue にいくつか関連リンクが貼られています。

### WCAG 3.0 の更新（2026 年 9 月版）

https://www.mitsue.co.jp/knowledge/blog/a11y/202609/14_1608.html

https://accessible-usable.net/2026/09/entry_260914.html

WCAG 3 の更新がありました。

記事内で詳細に解説されているのでここでの具体的な変更内容の紹介は省きますが、「適合」に関する記述が大幅に書き換えられ、改善されたようです。

### posinset/setsize for radiogroups

https://github.com/w3c/html-aam/issues/598

`<input type="radio">` において、`role="radiogroup"` によるグルーピングと、`name` 属性に同じ値を指定することによるグルーピングを、同時に行った場合の競合についての議論です。`posinset` や `setsize`（`aria-` prefix をつけて指定できる属性と同じ、ブラウザ側で指定される値）はこのグルーピングに基づいて値を計算するため、競合が発生したときに問題が発生するようです。

結論としては、これらのグルーピングを混在して使うことが禁止（`AUTHORS must`）されることになりました。もし混在した場合には、`role="radiogroup"` の指定を無視して `name` 属性によるグルーピングを優先するように、ブラウザ側に変更を入れることを検討していくようです。

## Baseline

### 📃 September 2026 release notes

https://web-platform-dx.github.io/web-features-explorer/release-notes/september-2026/

## Misc

### W3C opens 2026 community survey

https://www.w3.org/news/2026/w3c-opens-2026-community-wide-survey/

9 月の 1 ヶ月間、W3C のコミュニティ調査が行われました。W3C の活動を改善するための設問があり、W3C 会員メンバー向けのアンケートとは別で、W3C 会員でなくても W3C に関わっているコミュニティの一員向けのアンケートも用意されていました。

### Interop 2027

https://www.igalia.com/news/interop-2027-cfp.html

Interop 2027 のプロポーザルの募集が開始しました。

https://github.com/web-platform-tests/interop

[interop/proposal_guide.md](https://github.com/web-platform-tests/interop/blob/main/proposal_guide.md) を読んでプロポーザルを提出しても良いし、[既に提出されているプロポーザル](https://github.com/web-platform-tests/interop/issues?q=sort%3Aupdated-desc+is%3Aissue+state%3Aopen+)で気になったものに 👍 を押すことで投票することもできます。

### Unicode 18.0.0

https://www.unicode.org/versions/Unicode18.0.0/

毎年 9 月ごろに発表される Unicode の新仕様が、今年も公表されました。

9 個の絵文字が追加されたり、「小篆」という表意文字が 11,328 文字収録されたりといったアップデートがありました。

以下の記事に分かりやすくまとめられています。

- 「Unicode 18.0」がリリース ～秦代の「小篆」、女真文字を追加。新しい絵文字は9種 - 窓の杜
  - https://forest.watch.impress.co.jp/docs/news/2142260.html

### Fresher features, faster fixes: The two-week release cycle is here

https://developer.chrome.com/blog/chrome-two-week-start

[3月版の記事](https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202603)で紹介した Chrome の 2 週間リリースが始まりました。9 月は Chrome 154 が 9/22 に Stable になり、155 は 10/6 の予定です。Firefox も 155（9/1）、156（9/15）、157（9/29 予定）と 2 週間間隔のリリースに移っています。また、Edge も Edge 152（8/27）から 2 週間サイクルになり、9 月は 153（9/10）、154（9/24）がリリースされました。

Safari を除く主要ブラウザでは、2 週間のリリースサイクルが当たり前になりつつあります。

- Faster updates, enterprise-friendly schedule: the new Microsoft Edge release cycle
  - https://blogs.windows.com/msedgedev/2026/06/11/faster-updates-enterprise-friendly-schedule-the-new-microsoft-edge-release-cycle/

### Consortium Members elect Board of Directors

https://www.w3.org/news/2026/consortium-members-elect-board-of-directors/

W3C の Board of Directors の選挙結果が発表されました。任期は 9/30 から 2 年間です。

### Blink: Intent to Prototype: Text Detection API

https://groups.google.com/a/chromium.org/g/blink-dev/c/P2dn1LHygIU/m/Y3urilA5CgAJ

Text Detection API は、画像や動画、canvas 要素などの文字を検出・認識できる API です。

ネットワークを介した処理ではなくてブラウザから API を直接提供することで、パフォーマンスやセキュリティの懸念を解消できます。

### Building a certificate authority for the whole Internet | Cloudflare Blog

https://blog.cloudflare.com/cloudflare-certificate-authority/

Cloudflare が CA への参入計画を発表しました。

GlobalSign のルート CA を取得し、主要ブラウザのルートプログラムに参加を申請して、2027 年 Q1 の提供開始を目指していく予定です。

ACME での自動化や、耐量子暗号対応などもサポートしていく予定です。

現状、無料の証明書は Let's Encrypt に集中しており、その代替となる CA はありませんでした。Cloudflare の参入によって選択肢が増えることは、インターネット全体の冗長性を高めることにも繋がるため、期待されています。
