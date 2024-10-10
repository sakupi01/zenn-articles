---
title: "CSS新機能のWorking Draft公開など: Cybozu Frontend Weekly (2024-10-08号)" # 目立ったニュースを選ぶ
emoji: "🍁" # お好きな絵文字を
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["CybozuFrontendWeekly", "frontend"]
published: true
publication_name: "cybozu_frontend"
published_at: 2024-10-10 12:00 # 未来の日時を指定する
---

こんにちは！サイボウズ株式会社フロントエンドエンジニアの[saku (@sakupi01)](https://x.com/sakupi01)です。

# はじめに

サイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。

今回は、2024/10/8のFrontend Weeklyで取り上げた記事や話題を紹介します。

# 取り上げた記事・話題

## CSS Values and Units Module Level 5

https://alvaromontoro.com/blog/68062/new-values-and-functions-in-CSS
https://www.w3.org/TR/css-values-5/

CSS Values and Units Module Level 5のWorking Draftリリースの紹介記事です。
CSS Values and Units Module Level 5には[Level4](https://www.w3.org/TR/css-values-4/)から多くの機能が追加されており、その差分仕様となっています。
`attr()`関数 や Chrome 129 Betaに入った`calc-size()`関数に関するspecもここに追加されていて、それぞれについてコードベースを交えつつ明快に説明されています。

## CSS Masonry & CSS Grid | CSS-Tricks

https://css-tricks.com/css-masonry-css-grid/

Masonryレイアウトの標準化を図る2つのプロポーザルに関する記事です。
Masonryレイアウトに関してはすでにSafari Technology Previewで実装されていますが、Working Draftの公開には至っていない状況です。
Masonryレイアウトに関しては、以下2つのProposalがある状態となっています。

1. CSS Grid Layout Module Level 3内の[Masonry Layout Model](https://drafts.csswg.org/css-grid-3/#masonry-model)
2. Display Masonryとして独立して提案する[CSS Masonry (alt proposal)](https://tabatkins.github.io/specs/css-masonry/)

1が最初に提案されましたが、Columnサイズの計算方法にGridと違いがあることや、支援技術の読み上げ順序などアクセシビリティに関する問題が指摘されていました。
記事中では、1と2、それぞれのメリット・デメリットについて詳しくまとめられています。

Masonryの標準化に関してはGitHubのIssueを介してフィードバックが募られています。
https://developer.chrome.com/blog/masonry-syntax?hl=en
https://github.com/w3c/csswg-drafts/issues/9041

## Prototype: CookieStore API

https://groups.google.com/a/mozilla.org/g/dev-platform/c/OkoMESRn_uc

CookieStore APIがIntent to Prototypeとなり、Firefoxでも実装が始まろうとしています。

[`document.cookie`](https://html.spec.whatwg.org/multipage/dom.html#dom-document-cookie)は同期APIであることや、エンコード・デコードの観点などからさまざまな問題が指摘されてきました。[CookieStore API](https://wicg.github.io/cookie-store/)はブラウザのCookieにアクセスするための非同期APIかつ、`document.cookie`の抱えるさまざまな問題を改善したAPIとなります。

[ChromeではすでにShip](https://chromestatus.com/feature/5658847691669504)されていますが、FirefoxではChromeよりも機能を絞った形で実装される見込みで、最低限の機能のみを提供する非同期`document.cookie`となることを目指しているようです。
先日の[Safari Technology Preview 204](https://webkit.org/blog/15978/release-notes-for-safari-technology-preview-204/)でもサポートが開始されたため、近々主要ブラウザでCookieStore APIの最低限は利用可能になることが期待されます。

## Typed Linting: The Most Powerful TypeScript Linting Ever

https://typescript-eslint.io/blog/typed-linting

typescript-eslintが、型情報を利用したlintの優位性や実際の使い方を改めて解説した記事です。

型情報を利用することで、安全でないany型のチェックが可能になり、より正確なlintが可能になります。

## Announcing VoidZero - Next Generation Toolchain for JavaScript

https://voidzero.dev/posts/announcing-voidzero-inc

Evan You氏 が資金調達をして、VoidZero Inc.（void(0)）を立ち上げ、次世代 JS ツールチェーンを開発することが公表されました。
void(0)はオープンソースかつハイパフォーマンスな、JavaScriptエコシステムの統一的な開発者ツールを提供することを目指しています。

## Tauri 2.0 Stable Release

https://v2.tauri.app/blog/tauri-20/

Rust製のデスクトップアプリ開発フレームワークtauriの2.0がstableになりました。

特筆すべき変更点としては、以下が挙げられます。

- TauriアプリケーションをビルドしてiOSおよびAndroid上で実行することが可能に
- プラグインシステムで機能拡張が容易に
- IPCレイヤー（プロセス間通信）の書き換えで大容量データ転送の効率化

デスクトップだけではなく、モバイルも含めたクロスプラットフォーム開発ツールとして進化しているTauriの今後に期待ができそうです。

## Webの同意を考えようプロジェクト｜さよなら、ダークパターン。

https://www.non-deceptivedesign.jp/
https://prtimes.jp/main/html/rd/p/000000001.000150490.html

「Webの同意を考えようプロジェクト」の流れで、IIJ が主導して「非ダ―クパターンWebサイト(Non-Deceptive Design Accreditation)」制度を運用する一般社団法人ダークパターン対策協会が発足しました。

消費者が内容を読まずに安易に同意ボタンをクリックする「形骸化した同意」の問題や、ブラウザの設定でCookieが頻繁に削除されるために何度もCookieバナーが出てくる「同意疲れ」の問題などに対応していくと述べられています。
年末までに有識者/政府とガイドライン v1.0 を構築し、2025/7 から審査を開始予定とのことです。

## Benchmarking the performance of CSS `@property`

https://www.bram.us/2024/10/03/benchmarking-the-performance-of-css-property/
https://web.dev/blog/at-property-performance

最近BaselineのNewly Availableとなった`@property` のベンチマークとったことに関する記事です。

CSSのベンチマークを取るために[CSS Selector Benchmark](https://github.com/GoogleChromeLabs/css-selector-benchmark)というテストスイートを作成し、`@property` のパフォーマンスを測定しました。CSS Selector Benchmarkは、内部的にPerfTestRunnerというBlinkがパフォーマンステストに使用しているテストランナーを使用しているとのことです。

計測方法としては、`measureRunsPerSecond` メソッドを用いて、Blinkが秒間にStyleを再計算できる回数が多いほどパフォーマンスがいいとみなしています。

結果として、一般的なカスタムプロパティは最も遅かったですが、UnRegistered（`inherit: false;`・`--unregistered`）状態のカスタムプロパティは最高速で、Registered（`inherit: true`;・`--registered` ）なカスタムプロパティよりも早かったとのことです。

考察として、`@property`を用いたカスタムプロパティは`inherit: false`にして使うとパフォーマンス的には良くなると述べられています。

CSSのベンチマークの取り方としてもとても勉強になる記事です。

## Vite Conf

https://docs.google.com/presentation/d/1Kt020NyY0LE3G7NtqM67OHt-bAI1HKM4zKKd0vH9RHQ/edit#slide=id.p
https://www.youtube.com/watch?v=mWK3Y_1kmaM&t=30808s

Vite Conf の keynote が公開されました。社内では、ViteConfでのQwikの発表が話題を席巻していました。

# あとがき

個人的には、CSS Values and Units Module Level 5の内容がとても興味深かったです。
CSSだけでさまざまなことが可能になっており、特に`random()`や`random-item()`関数を用いることでCSSでランダムな値を生成できるようになるのは面白いなと思いました。
