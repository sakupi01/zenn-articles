---
title: "Fit-to-Width , CSS Carousel など: Cybozu Frontend Weekly (2025-05-20号)" # 目立ったニュースを選ぶ
emoji: "🌏" # お好きな絵文字を
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ["CybozuFrontendWeekly", "frontend"]
published: true
publication_name: "cybozu_frontend"
published_at: 2025-05-22 12:00 # 未来の日時を指定する
---

こんにちは！サイボウズ株式会社フロントエンドエンジニアの[saku (@sakupi01)](https://x.com/sakupi01)です。

# はじめに

サイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。

今回は、2025/05/20のFrontend Weeklyで取り上げた記事や話題を紹介します。

# 取り上げた記事・話題

## React Compiler RC – React

https://react.dev/blog/2025/04/21/react-compiler-rc

React Compiler の Release Candidate（RC）がリリースされました。
React Compiler は自動的にメモ化を行うビルドタイムツールで、これまで手動で行っていた `useMemo` や `useCallback` による最適化を自動化できます。
また、 ESLint プラグインが `eslint-plugin-react-hooks` にマージされ、設定が簡素化されました。
加えて、SWC サポートが追加され、Next.js などでの利用も想定されています。現在は Stable リリースに向けて最終的なフィードバックを収集している段階です。

## @wdio/visual-service@7.0.0 Release

https://github.com/webdriverio/visual-testing/releases/tag/%40wdio%2Fvisual-service%407.0.0

WebdriverIO の Visual Testing 機能を提供する `@wdio/visual-service` のメジャーバージョン 7.0.0 がリリースされました。
この Visual Testing サービスは、スクリーンショットベースのビジュアル回帰テストを実行するためのツールで、ブラウザやモバイルブラウザでの画面比較を行うことができます。
今回のメジャーアップデートでは、モバイルデバイスでのタブ実行のサポートや、テスト実行の改善が含まれています。

## 高速でスケーラブルなE2E実行基盤を目指して - freee Developers Hub

https://developers.freee.co.jp/entry/renewal-e2e-foundation

freee 社の E2E テスト実行基盤の刷新についての記事です。
従来の Ruby（RSpec、Capybara、SitePrism）+ Jenkins の構成から、Playwright+ GitHub Actions の TypeScript をベースとした構成に移行が進められています。
特に並列実行数の動的スケーリングが簡単になったこと、別ブランチでのテスト実行が容易になったことが大きなメリットとして挙げられています。
CPU コア数の多い専用の self-hosted runner を作成し、ワーカー数 12 で約 80% の CPU 使用率を達成しているとのことです。

## Tiptap Editor 3.0 Beta

https://x.com/tiptap_editor/status/1912128836537397503

https://tiptap.dev/docs/ui-components/components/overview

Tiptap Editor 3.0 Beta がリリースされました。
Tiptap は ProseMirror をベースにしたヘッドレスエディターフレームワークで、React や Vue などのフレームワークと組み合わせて使用できます。
3.0 では拡張性の向上や UI コンポーネントの改善が行われ、100 以上の拡張機能が提供されています。

## Vitest の In-Source Testing が便利

https://speakerdeck.com/taro28/vitestnoin-source-testinggabian-li

Vitest の In-Source Testing 機能について解説したスライドです。
In-Source Testing はソースコードファイル内に `if (import.meta.vitest)` ブロックを使ってテストコードを直接記述できる機能で、テスト対象のコードと同じファイルに書くことで、コードの変更時にテストも同時に更新しやすくなります。
特に、エクスポートしていない内部関数のテストや、定数の参照が容易になるなどのメリットが紹介されています。
ただし、本番環境では `import.meta.vitest` は false になるため、テストコードがバンドルされることはありません。

## Contextual logging with console.context() - Microsoft Edge Blog

https://blogs.windows.com/msedgedev/2025/04/22/contextual-logging-with-console-context/

Microsoft Edge から、`console.context()` メソッドを使ったコンテクスト別ログ出力機能の Explainer についての記事です。
この機能により、アプリケーションの異なる部分からのログメッセージを分類・フィルタリングすることが可能になります。
`console.context("contextName")` を使って作成したロガーはコンテクスト名付きでログを出力し、DevTools のサイドバーでコンテクスト別にフィルタ表示できるようになる予定です。
また、カラー表示機能も提案されており、コンテクストを視覚的に区別しやすくすることが検討されています。

## Storybook 9 is now in beta

https://storybook.js.org/blog/storybook-9-beta/

Storybook 9 Beta がリリースされました。
今回のメジャーアップデートでは、コンポーネントテスト機能の強化が目玉で、Vitest との連携によりブラウザ内でのテスト実行が可能になりました。
バンドルサイズが 48% 軽量化され、タグベースでのストーリー整理機能が追加されています。
また、React Native の Web サポートが正式に追加され、アクセシビリティテストやビジュアルテスト機能も向上しました。

## Pull Request #202 - microsoft/vscode-html-languageservice

https://github.com/microsoft/vscode-html-languageservice/pull/202

VS Code の HTML で Baseline のステータスを確認できるようにする Language Service 機能追加のプルリクエストです。

## React Labs: View Transitions, Activity, and more – React

https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more

React Labs から実験的な新機能である View Transitions と Activity が紹介されました。
View Transitions は UI 遷移時のアニメーション機能を提供し、`<ViewTransition>` コンポーネントでブラウザの View Transitions API を活用できます。
`<Activity>` コンポーネントは、画面が非表示になった際にコンポーネントの状態を保持する機能で、タブ切り替えやページ遷移時のUX向上を図ります。
これらの機能は `react@experimental` で試すことができ、将来的にはReact Compiler や Fragment Refs などの機能も計画されています。

## Staged Proposals at the WHATWG

https://blog.whatwg.org/staged-proposals-at-the-whatwg

WHATWG が導入していた「Staged Proposals」プロセスでが始まってから、機能が初めて Stage 4 にあがりました。
このプロセスは、TC39のJavaScript提案のステージモデルに着想を得たもので、Webプラットフォームの新機能提案を体系的に評価・実装するためのものです。
提案は5つのステージ（Stage 0から4）を経て進められ、Stage 4に到達すると仕様に正式に統合されます。
今回初めて Stage 4 に到達したのは、`moveBefore()` DOM API で、Customizable Select Element が Stage 3 に到達したことについても言及されています。

## DeepWiki

https://deepwiki.com/

Cognition AI が開発した AI ドキュメント生成ツール DeepWiki が公開されました。
現在 30,000 以上のリポジトリがインデックス化されており、開発者のコード理解を大幅に効率化することが期待されます。

## Rspack に移行したらフロントエンドのビルドがめっちゃ速くなりました

https://buildersbox.corp-sansan.com/entry/2025/04/14/110000

Sansan の Eight チームが webpack から Rspack に移行して大幅なビルド時間短縮を実現した事例です。
dev-server 起動は 2.3 倍、本番ビルドは 5.4 倍、テスト実行は 1.5 倍高速化されました。
移行時の課題として、文字コードの問題による本番ビルドの失敗や一部プラグインの未対応がありましたが、継続的な改善により解決されています。
Rspack の webpack 互換性の高さにより、設定の大幅な変更なしに移行でき、開発者体験の向上につながったとのことです。

## Storybook Play function で AHA testing のすゝめ

https://tech.layerx.co.jp/entry/2025/04/21/114307

LayerX バクラク事業部での Storybook Play function と AHA testing を組み合わせたフロントエンドテスト手法の紹介です。
AHA（Avoid Hasty Abstractions）testing は性急な抽象化を避けてテストの可読性を高める考え方で、Storybook の Play function と組み合わせることで統合テストを効率的に書けます。
GraphQL Code Generator を活用したモックデータの自動生成により、テスト作成の手間を削減している点も特徴的です。
ユーザー操作のシナリオベースなテストが書きやすく、UI の仕様変更にも強いテスト構造を実現しています。

## Giving V8 a Heads-Up: Faster JavaScript Startup with Explicit Compile Hints

https://v8.dev/blog/explicit-compile-hints

Chrome 136 から Ship される、Explicit Compile Hints に関する記事です。
Explicit Compile Hints を用いると、どの関数を事前コンパイルするかをコメントで明示して制御することができます。
ファイル全体を eager compilation する場合は `//# allFunctionsCalledOnLoad` をファイル上部に追加するだけで、平均 630ms のパースとコンパイル時間短縮が可能とのことです。
ただし、事前コンパイルしすぎるとページ初期読み込み時の処理時間やメモリを圧迫する可能性があるので注意との言及もあります。

## Fit-to-Width Discussions & Feedback — Roma's Unpolished Posts

https://blog.kizu.dev/fit-to-width-discussions-and-feedback/

Blink でプロトタイプが進んでいる「fit-width」の抱える懸念とその議論の現状と Explainer への著者からのフィードバックです。
fit-width はコンテナサイズに合わせたフォントサイズを指定するといったもので、`text-grow`と`text-shrink`の2つの提案から成ります。
fit-width の懸念として、View Port幅に依存して`font-size`が変わる場合、ブラウザのZoom Inをしても文字サイズが大きくならないといったことが起こる懸念があります。
記事中では、現時点での解決策の提案や、`text-shrink` にはプログレッシブエンハンスメント的な問題がある点、その他シンタックスに関する意見が述べられています。

## ESLint v9.26.0 released

https://eslint.org/blog/2025/05/eslint-v9.26.0-released/

ESLint v9.26.0 がリリースされました。
主な変更点として、MCP サーバーのサポートが追加され、AI × 静的解析による開発支援が期待されます。

## Building Accessible CSS Carousels

https://www.sarasoueidan.com/blog/css-carousels-accessibility/

CSS Overflow Module 5 で定義された 擬似要素を利用した CSS のみのカルーセル UI のアクセシビリティに関する考察記事です。
著者である Sara Soueidan は、CSS カルーセルにはさまざまなアクセシビリティ上の懸念が残っているほか、CSS による見た目の実装と HTML による意味論の分離を保つべきとし、OpenUI による HTML ネイティブ要素としての標準化に期待しています。
現状では CSS Carousels は実験的で本番環境での使用には適していないと結論づけています。

# あとがき

React Compiler の RC リリースや Storybook 9 の Beta リリースなど、エコシステムまわりの進歩が目立ちました。
また、V8 の Explicit Compile Hints や CSS fit-width、Carousels のアクセシビリティに関する考察なども興味深く、今後の議論にも注目していきたいです。
