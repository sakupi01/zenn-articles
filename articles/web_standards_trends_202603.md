---
title: "Web 標準動向 2026年3月版"
emoji: "🌸"
type: "idea"
topics: ["cybozuwebstandards", "frontend"]
published: true
publication_name: "cybozu_frontend"
published_at: 2026-03-31 12:00
---

こんにちは！ サイボウズ株式会社 デザインテクノロジストの [saku (@sakupi01)](https://x.com/sakupi01) です。

## はじめに

サイボウズは 2025 年 4 月より、W3C のメンバーに加入しました。
https://blog.cybozu.io/entry/joining-w3c
標準化プロセスに関わることができるようになるための最初の一歩として、フロントエンドエンジニアの一部のメンバーは積極的に Web 標準のキャッチアップを行っています。
そこで、毎月メンバーが興味を持った Web 標準に関する話題や、実際に標準化プロセスに関わることができた場合にはその報告などを 1 つの記事としてまとめ、紹介していきます。
また、ここでは W3C に限らず、TC39 や WHATWG などの標準化団体のトピックについても扱います。
:::message
今月の執筆者は以下の 3 名です。

- [saku](https://x.com/sakupi01)
  - HTML, CSS に関連するトピックを執筆
- [くらっち](https://x.com/kuracchi04)
  - ECMA262 周りのトピックを執筆
- [mehm8128](https://x.com/mehm8128)
  - 主にアクセシビリティに関連するトピックを執筆

:::

## イベントのお知らせ

https://web-study.connpass.com/event/387935/

4/17（金）に、サイボウズ東京オフィスにて#縦書き\_studyが開催されます。ぜひご参加ください。

## HTML

### Request for developer feedback: `focusgroup`

https://developer.chrome.com/blog/focusgroup-rfc?hl=ja

[9月版の記事](https://zenn.dev/cybozu_frontend/articles/web_standards_monthly_202509#intent-to-prototype%3A-focusgroup "https://zenn.dev/cybozu_frontend/articles/web_standards_monthly_202509#intent-to-prototype%3A-focusgroup")で紹介した FocusGroupが、Chromium系ブラウザでフラグつきで利用可能になりました。

Open UIのリポジトリにてフィードバックを求めているとのことです。

### Prototype: HTML toolbar element

https://groups.google.com/a/chromium.org/g/blink-dev/c/jitI6P4LHzc

頻出するコンポーネントである `<toolbar>` を、ネイティブで実装する提案です。

特にキーボード操作などを JS で実装する必要がなくなり、ネイティブに近い使用感で組み込める予定です。

### Prototype: Platform-provided behaviors

https://groups.google.com/a/chromium.org/g/blink-dev/c/ETKzYhB6BbI

WebComponents を作る際に、いくつかのネイティブな挙動は JS で再実装する必要がありました。

そこで ElementInternals に標準的な挙動を継承させられるようにすることで、 WebComponents の挙動をネイティブに近づけられるようにする提案です。

まずは、 form submission に関わる挙動からはじめ、 Popover の挙動や、 label の挙動、ラジオボタンのグループ化などにも広げて行く予定です。

## CSS

### Blink: Intent to Ship: CSS `contrast-color()`

https://groups.google.com/a/chromium.org/g/blink-dev/c/x6nAOI0kVsg/m/fiZQrYpXAgAJ

[1月版の記事](https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202601#prototype%3A-css-contrast-color\(\) "https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202601#prototype%3A-css-contrast-color()")で取り上げた`contrast-color()`が、BlinkでIntent to Shipになりました。

Chrome 147でShipされると全主要ブラウザで揃うことになり、Newly Availableになります。

`contrast-color()`は、[Interop 2026](https://wpt.fyi/interop-2026 "https://wpt.fyi/interop-2026")のFocus Areaの1つになっていました。

### Prototype: CSS sticky positioning in single-axis scroll containers

https://groups.google.com/a/chromium.org/g/blink-dev/c/mnATiT8Eu8A/m/DmAUckUsAAAJ

水平スクロールと垂直スクロールが異なるコンテナーで発生する場合に、`position: sticky`が上手く動かない問題がありました。例えばコンテナー内で横スクロール可能なテーブルにおいて、縦スクロールしたときにテーブル見出しをページ上部に固定したい場合などが挙げられます。

これまではこの問題に対処するために、テーブルを複製してスクロール状態をJSから同期させたり、無理やりな実装をする必要がありました。しかし、今回の変更でそれが解決されるようです。

### **Ship: `at-rule`: CSS Feature Detection**

https://groups.google.com/a/chromium.org/g/blink-dev/c/iYcuP_HQjDs

`@supports` は CSS プロパティのサポート検出に使われてきましたが、`@starting-style` や `@view-transition` といった At-rules 自体への Feature Detection をこれまで CSS だけで判定する手段はなく、JavaScript に頼るしかありませんでした。

今回仕様策定と実装が進んでいる `@supports at-rule(@keyword)` 構文により、 At-rules のサポート検出も純粋な CSS で記述できるようになります。  
Chromium 148 での Ship が確定しており、`@import` の `supports()` 条件と組み合わせてスタイルシートの条件付き読み込みにも活用が考えられます。

```css
@import "entry-animations.css" supports(at-rule(@starting-style));
```

なお、ディスクリプタやプレリュードを渡す拡張構文（`@supports at-rule(@container style(…)) { … }`など）は仕様から除外されたため、検出できるのはあくまでも純粋な At-rules の有無のみとなります。

### Ship: `light-dark()` for CSS images

https://groups.google.com/a/mozilla.org/g/dev-platform/c/R9ksQx372_g/m/fcZoqwBtAgAJ

- Intent to Prototype: CSS `light-dark()` with image values
  - https://groups.google.com/a/chromium.org/g/blink-dev/c/We0pqxS4IcQ/m/yZ6AwYW8BgAJ
- \[css-images-4\] Add `light-dark-image()`, or generalize `light-dark()` for images too?
  - https://github.com/w3c/csswg-drafts/issues/12513

ダークモード対応の画像切り替えを CSS だけで書けるよう、 `light-dark()` 関数が拡張され、Blink と Gecko での Ship が見込まれています。

これまで `light-dark()` はカラー値のみに対応しており、画像の切り替えには `@media (prefers-color-scheme: ...)` を別途記述する必要がありました。今回の拡張により、 `background-image` などのプロパティでも `light-dark(url(light.png), url(dark.png))` のように画像を直接指定できるようになります。また `@media` クエリと異なり、 `color-scheme` プロパティによるローカルなスキーム上書きにも追従できる点が大きな利点です。  
Firefox 150（4月リリース予定）ではすでに実装済みで、Chrome も148以降でフラグ付きで試験的に利用可能となっています。

### Prototype: CSS `fit-content()` function for sizing properties

https://groups.google.com/a/chromium.org/g/blink-dev/c/RtqvX4CCnoI

Flex や Grid に限らない Box Model で、「`min-content` 以上、`max-content` 以下の範囲で、できるだけ 基準値に近づける」といったサイズ指定が可能になります。

例えば、300px の基準値に Box のサイズを近似したい場合、以下のように記述することが可能です。

```css
width: fit-content(300px); /* = min(max-content, max(min-content, 300px)) */
```

## ARIA・WCAG

### Add browser accessibility heuristics wiki page

https://github.com/w3c/aria/pull/2742

ブラウザはWeb開発者のミスと思われる記述を検知して、特定の条件下でARIA属性を無視したり、`aria-labelledby`を`aria-labeledby`という綴りでも利用可能にしたりという回避を行っている場合があります。

そういったヒューリスティックを標準化したりWPTでテストしたりできるように、新たに[Open Issues in Browser Accessibility Heuristics](https://github.com/w3c/aria/blob/main/documentation/browser_accessibility_heuristics.md "https://github.com/w3c/aria/blob/main/documentation/browser_accessibility_heuristics.md")というドキュメントが作成されました。

例えばページのルート要素に誤って`aria-hidden`がついてしまっている場合や、`aria-modal`によって永続的なモーダルが表示されている場合に、それらの要素を無視する例が挙げられています。

### Add CSS-AAM editor’s draft

https://github.com/w3c/aria/pull/2673

[11月版の記事で紹介](https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202511#wip%3A-add-css-aam-editor%E2%80%99s-draft "https://zenn.dev/cybozu_frontend/articles/web_standards_trends_202511#wip%3A-add-css-aam-editor%E2%80%99s-draft")した、TPACをきっかけに作成されたCSS-AAMに関するPRがマージされました。

[w3c/css-aam](https://github.com/w3c/css-aam "https://github.com/w3c/css-aam") はissue用のリポジトリになり、spec自体はariaのリポジトリに移動しました。

### Defining Accessibility Support Sets

https://github.com/w3c/wcag3/discussions/621

WCAG3におけるアクセシビリティ サポーテッドの扱いに関する議論が進んでいます。

アクセシビリティ サポーテッドについては[アクセシビリティ サポーテッド（AS）情報 | ウェブアクセシビリティ基盤委員会（WAIC）](https://waic.jp/guideline/as/ "https://waic.jp/guideline/as/")や[アクセシビリティサポートを理解する | WAI | W3C](https://waic.jp/translations/WCAG22/Understanding/conformance.html#accessibility-support "https://waic.jp/translations/WCAG22/Understanding/conformance.html#accessibility-support")をご覧ください。

WCAGの達成基準を満たすためのテクニックがアクセシビリティ サポーテッドであることを確認するためのデフォルトのユーザーエージェントや支援技術の組み合わせを、Accessibility Support Setsとして定義しようとしています。しかし、W3Cの公式文書に具体的な製品名を出せないことなどから、何を基準としてデフォルトのセットを定義するべきかという議論になっています。

### Support for testing additional accessibility properties beyond name and role.

https://github.com/web-platform-tests/wpt/pull/55784

[Interop 2026](https://wpt.fyi/interop-2026 "https://wpt.fyi/interop-2026")のActive Investigationsの1つであるAccessibility Testingの分野で注力されている、WPTでaccessible nameとrole以外のプロパティをテストできるようにする動きが進んでいます。

[Interop 2026 Accessibility Investigation · Issue #202](https://github.com/web-platform-tests/interop-accessibility/issues/202 "https://github.com/web-platform-tests/interop-accessibility/issues/202")のコメント欄にある割合を見ると、今回のWPT側での実装PRがマージされたことで全体の25%の進捗が進んだことになります。実際に様々なARIA属性をテストできるようになるにはブラウザ側でも対応が必要ですが、アクセシビリティに関する相互運用性が前進するための大きな一歩になると考えられます。

### 41st CSUN Assistive Technology Conference

https://conference.csun.at/event/2026/summary

3月の第二週に1週間、アナハイムにてCSUN Assistive Technology Conferenceが開催されました。

支援技術に関するブース出展とともに、多くのセッションが行われました。W3Cのアクセシビリティ系のWGに所属するメンバーも登壇されたようです。

日本人も複数名が現地参加していて、3/18にオンラインで参加報告会が開催されました。

[【DEI担当者必聴！】世界最大の障害者カンファレンスCSUN ATC参加報告会 | Peatix](https://csunatc2026.peatix.com/ "https://csunatc2026.peatix.com/")

4/17にはオフラインでも参加報告会が予定されています。

[オフライン交流会 ＋ CSUNカンファレンス2026 参加報告｜A11y Tokyo Meetup - connpass](https://a11ytyo.connpass.com/event/388425/?utm_campaign=event_participate_to_follower&utm_source=notifications&utm_medium=twitter "https://a11ytyo.connpass.com/event/388425/?utm_campaign=event_participate_to_follower&utm_source=notifications&utm_medium=twitter")

## JavaScript

### ECMA262

#### Temporal Reaches Stage 4 | Igalia

[https://www.igalia.com/2026/03/13/Temporal-Reaches-Stage-4.html](https://www.igalia.com/2026/03/13/Temporal-Reaches-Stage-4.html "https://www.igalia.com/2026/03/13/Temporal-Reaches-Stage-4.html")

日付操作 API の Temporal が Stage 4 になりました。

#### **Import Text** **Reaches Stage 3**

https://github.com/tc39/proposal-import-text

`type: "text"` というimport attributeを追加し、テキストファイルを文字列として直接importできるようにする提案です。

すでに、DenoやBunなどでは import 属性として `type: "text"` もサポートされています。

Deno : https://docs.deno.com/examples/importing_text/

Bun: https://bun.com/docs/guides/runtime/import-html

TC39 第 113 回の MTG（2026 年 3 月）で Stage 2.7 から Stage 3 に昇格しました。

#### **Iterator Includes** **Reaches Stage 2.7**

https://github.com/tc39/proposal-iterator-includes

イテレータが特定の値を含むかを確認する `includes` メソッドを追加する提案です。

現在は `some` メソッドとカスタムコンパレータで代替可能ですが、意図が直接的に表現されず煩雑という問題を解決します。

同 MTG で Stage 0 から Stage 2.7 に昇格しました。

## Baseline

### 📃 March 2026 release notes

[https://web-platform-dx.github.io/web-features-explorer/release-notes/march-2026/](https://web-platform-dx.github.io/web-features-explorer/release-notes/march-2026/ "https://web-platform-dx.github.io/web-features-explorer/release-notes/march-2026/")

## Misc

### Breakouts Day 2026

https://github.com/w3c/breakouts-day-2026

毎年開催されているBreakouts Dayが、日本時間で3/25の夜及び3/27の朝に開催されました。

議題やタイムテーブルは[Calendar | W3C Breakouts Day 2026 | W3C](https://www.w3.org/calendar/breakouts-day-2026/grid/ "https://www.w3.org/calendar/breakouts-day-2026/grid/")から確認できます。

### **Experiment: Agentic Federated Login**

[https://groups.google.com/a/chromium.org/g/blink-dev/c/FLaenhru3zo](https://groups.google.com/a/chromium.org/g/blink-dev/c/FLaenhru3zo "https://groups.google.com/a/chromium.org/g/blink-dev/c/FLaenhru3zo")

AI Agent は UI を確率的に解析して操作するため、FedCM API を用いたフェデレーテッドログイン（Googleでサインイン等）において、ログインと新規アカウント作成などを区別できず、意図しないアカウントを作ってしまうリスクがあります。

それを防ぐために Agent 型ブラウザ用に FedCM を拡張して AI が安全に使える形にするものです。

### **Get features faster with Chrome's two-week release cycle**

https://developer.chrome.com/blog/chrome-two-week-release

Chrome ブラウザのリリースサイクルが、2026年9月から 4週から2週間に移行するとのことです。  
全プラットフォームで 2 週間ごとに Beta, Stable がリリースされます。Extended Stable は引き続き 8 週間サイクルです。
