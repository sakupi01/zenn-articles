---
title: "Form Control Styling Level 1 など: Cybozu Frontend Weekly (2025-03-25号)" # 目立ったニュースを選ぶ
emoji: "😍" # お好きな絵文字を
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["CybozuFrontendWeekly", "frontend"]
published: true
publication_name: "cybozu_frontend"
published_at: 2025-03-28 12:00 # 未来の日時を指定する
---

こんにちは！サイボウズ株式会社フロントエンドエンジニアの[saku (@sakupi01)](https://x.com/sakupi01)です。

# はじめに

サイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。

今回は、2025/03/25のFrontend Weeklyで取り上げた記事や話題を紹介します。

# 取り上げた記事・話題

## CSS Form Control Styling Level 1 First Public Working Draft

https://www.w3.org/TR/css-forms-1/

https://lists.w3.org/Archives/Public/www-style/2025Mar/0004.html

CSS Form Control Styling Level 1 の First Public Working Draft が公開されました。
長年OSやブラウザ間で一貫したフォームコントロールのスタイリングや拡張を行うことは難しいとされてきましたが、近年それを Web 標準側で解決しようという動きが出てきており、それを反映する1stステップとなるモジュールです。

## Intent to Experiment: Speculation rules `target_hint` field

https://groups.google.com/a/chromium.org/g/blink-dev/c/J8pXGgUIuBQ/m/my-groups

Speculation Rules APIに`target_hint`フィールドを追加するIntent to Experimentです。

この機能は、プリレンダリングされたページが最終的にどのターゲットで表示されるかを指定できるようにするものです。現時点では`_self`サポートされており、`_blank`が指定されたリンクの場合はプリレンダリングが無駄になっていました。

`target_hint`フィールドに`_blank`を指定することで、ターゲットが`_blank`に指定されている場合のプリレンダリングにも対応できるようになる予定です。

## Lynx: Unlock Native for More - Lynx

https://lynxjs.org/blog/lynx-unlock-native-for-more

ByteDanceが開発したクロスプラットフォームフレームワーク「Lynx」がオープンソース化されました。
技術的には、HTML/CSSでネイティブUIを構築できることが特徴としてあげられます。
LynxはByteDance社内で広く活用されており、今回のオープンソース化によって、より多くの開発者がクロスプラットフォームアプリ開発に取り組めるようになることが期待されています。

## Introducing `command` and `commandfor`

https://developer.chrome.com/blog/command-and-commandfor?hl=en

https://chromestatus.com/feature/5142517058371584

今週リリースされたChrome 135 Stableからサポートされる、`command`と`commandfor`属性に関する概要記事です。
`command`/`commandfor`属性は、現時点では`<button />`に対して付与可能で、ボタンをクリックした際に関連する要素に対してCommandEventを発火できます。

## Model Context Protocol の現在地

https://zenn.dev/layerx/articles/9bdefe4d435882

Anthropicが2024年11月に発表したクライアント-サーバー間通信のプロトコルであるModel Context Protocol(MCP)について解説した記事です。

MCPはLLMアプリケーションにおいて外部データの参照やツール呼び出しなどのインテグレーションを標準化することを目的としています。プロトコルの仕様策定やエコシステムはオープンコミュニティで開発されており、各言語のSDKもオープンソースで提供されています。

## Let's call these little crabs "Rstack", which is short for Rspack stack.

https://x.com/rspack_dev/status/1899007455381897697

Rspack, Rsbuild, Rspress, RslibなどのRspack stackのことをRstackと呼ぶそうです。

## 🚀 Playwright 1.51 is here!

https://x.com/playwrightweb/status/1898041995102195916

https://github.com/microsoft/playwright/releases/tag/v1.51.0

Playwright 1.51がリリースされました。
エラーが出た際に、エラーメッセージとその修正に役立つコンテキストを含むプロンプトをコピーできる機能などが追加されました。

## The Clean ArchitectureがWebフロントエンドでしっくりこないのは何故か / Why The Clean Architecture does not fit with Web Frontend

https://speakerdeck.com/twada/why-the-clean-architecture-does-not-fit-with-web-frontend

クリーンアーキテクチャがWebフロントエンド開発において、その原則が必ずしも適合しない理由についての考察をした[@t_wada](https://x.com/t_wada) 氏の発表です。
フロントエンドとバックエンドのアーキテクチャの違いや、それぞれの設計における考慮事項についても触れられています。

## Enable moveBefore in experimental releases

https://github.com/facebook/react/pull/32549

https://groups.google.com/a/chromium.org/g/blink-dev/c/YE_xLH6MkRs/m/_7CD0NYMAAAJ

ReactのExperimentalリリースにおいて、 DOM APIである`moveBefore()` のサポートを有効化するフラグが追加されました。

## ESLint v9.22.0 released - ESLint - Pluggable JavaScript Linter

https://eslint.org/blog/2025/03/eslint-v9.22.0-released/

ESLint v9.22.0がリリースされました。主な変更点として、`defineConfig()`と`globalIgnores()`が追加されました。
特に、`defineConfig()`の利用で、Flat Config設定ファイルにおいて`extends`を指定できるようになります。

## CSS Modules を便利に使うためのツールキット作った

https://www.mizdra.net/entry/2025/03/07/130150

CSS Modulesのコードジャンプを可能にするなどのための補助ツール「happy-css-modules」の上位互換となるツールとして、CSS Modules Kitが公開されました。

## TypeScript 5.8

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html

TypeScript 5.8が公開されました。一部機能を抜粋します：

- Granular Checks for Branches in Return Expressions
- Support for require() of ECMAScript Modules in `--module` nodenext
`--module` node18
- The -`-erasableSyntaxOnly` Option

そのほか、パフォーマンスの向上のアップデートなども含まれています。

## VSCodeに新機能「Copilot Vision」プレビュー版が登場。モックアップ画像を読み込ませてHTML/CSSを作成、エラーのスクリーンショットから分析を依頼など

https://www.publickey1.jp/blog/25/vscodecopilot_visionhtmlcss.html

GitHub Copilotに画像認識機能「Copilot Vision」のプレビュー版が搭載されたことを紹介する記事です。
これにより、画像からのHTML/CSS生成や、エラー画面のスクリーンショットによる分析依頼が可能となり、開発の効率化が期待されます。

## A 10x Faster TypeScript

https://devblogs.microsoft.com/typescript/typescript-native-port/

TypeScript Compiler を TypeScript から Go に書き換えてネイティブポートすることで10倍早くする記事です。

以下のDiscussions になぜGoを選定したのかなどの詳細な理由が書かれています。

https://github.com/microsoft/typescript-go/discussions/411

社内では、ts-eslintではすでに Go 版を使ってみようといったIssueが立ってることも取り上げられました。

https://github.com/typescript-eslint/typescript-eslint/issues/10940

## Deep Dive into deno lint plugin

https://www.docswell.com/s/magurotuna/5YDLWV-2025-03-14-toranoana-deno-20#p1

Deno 2.2 の目玉機能として追加された `deno lint`のプラグイン対応の背景に関する深掘りです。

## Multiple tags in this action are compromised · Issue #2463 · tj-actions/changed-files

https://github.com/tj-actions/changed-files/issues/2463

`tj-actions/changed-files`というGitHub Actionsでファイルの差分を得るためのアクションツールのすべてのバージョンにおいて、マルウェアが混入していた問題です。

社内では、`tj-actions/changed-files`はSHA指定で利用していたので特段の被害は出ませんでしたが、全てのタグが書き換えられているとのことなので注意が必要です。

https://x.com/azu_re/status/1900812083517943930?s=46&t=Rreh9a4Ymw8GBLg-X9K6iw

## hygen.io domain is expired / documentation not available

https://github.com/jondot/hygen/issues/455

scafford ツールであるhygenのドキュメントサイトであったhygen.ioのドメインが切れており、メンテナンスも2年近くされていなかったようです。

## Release Notes for Safari Technology Preview 215 | WebKit

https://webkit.org/blog/16523/release-notes-for-safari-technology-preview-215/

Safari 18.5 のリリースノートです。Interop 2025 の Focus Areas の一つである Anchor Positioning のサポートや、Trusted Types が注目の変更点として挙げられます。

- Scroll Driven Animations
- `text-wrap-style: pretty`
- CSS Anchor Positioning
- Trusted Types
- File System WritableStream API

## Valibot v1 - The 1 kB schema library

https://valibot.dev/blog/valibot-v1-the-1-kb-schema-library/

軽量なスキーマバリデーションライブラリであるValibot のv1がリリースされました。
記事は、その生い立ちやこれまでを振り返るものになっています。

## styled-components Thank you - Open Collective

https://opencollective.com/styled-components/updates/thank-you

ReactのCSS-in-JSライブラリであるstyled-componentsがメンテナンスモードに入るという発表です。
メンテナのEvan Jacobs氏は、ReactのAPI変更やCSS技術のトレンドの変化が理由だと述べています。
今後は既存ユーザーへのサポートとバグ修正に注力し、新規プロジェクトでの採用は推奨しないとのことです。

## microsoft/playwright-mcp: Playwright Tools for MCP

https://github.com/microsoft/playwright-mcp

Playwrightのブラウザ自動操作化機能を利用して、Model Context Protocol (MCP) サーバーを構築するためのツールを提供する、playwright-mcpが公開されました。

## CVE-2025-29927 | Next.js

https://nextjs.org/blog/cve-2025-29927

以前報告されていた、Next.js のキャッシュポイズニングに関する脆弱性（CVE-2024-46982）の改修について、不十分との指摘があったことに対して、その修正についての記事です。

この脆弱性ではミドルウェアの実行をスキップすることが可能で、リクエストがルートに到達する前に認証用のCookie検証などの重要なチェックをスキップできます。
そのため、ミドルウェアを使用したセルフホスト型のNext.jsアプリケーションが影響を受けることになりますが、VercelやNetlifyでホストされているアプリケーション、またはstatic exportを使ってデプロイされたアプリケーションでは影響を受けないとのことです。

`next start`と`output: 'standalone'` を使用するNext.jsアプリケーションに対しては、直ちに最新バージョンへアップデートすることが推奨されています。

関連：[Cache Poisoning · Advisory · vercel/next.js](https://github.com/vercel/next.js/security/advisories/GHSA-gp8f-8m3g-qvj9)

## Node just added TypeScript support. What does that mean for Deno?

https://deno.com/blog/typescript-in-node-vs-deno

Node.jsが最近追加したTypeScriptのネイティブサポートについて解説し、Denoが以前から提供しているTypeScript統合と比較している記事です。

それぞれのランタイムにおけるTypeScriptの取り扱い方、特に型チェック、型削除、設定の簡便さ、そしてエコシステムとの連携について主に述べられています。
Denoは、型チェックを実行するtsc、SWCによるトランスパイルが内部的に組み込まれていたり、tsconfig.jsonが不要だったりすることで開発ワークフローを簡素化することに重点を置いているようです。

## Oxlint Beta | The JavaScript Oxidation Compiler

https://oxc.rs/blog/2025-03-15-oxlint-beta.html

Oxlint の Beta 版のリリースがありました。

500 を超えるビルトインルールの追加、パフォーマンス面での大幅な向上がおこなわれ、今後はカスタム ESLint プラグインのサポートや IDE への統合も計画されています。

## Announcing Rsdoctor 1.0

https://rsdoctor.dev/blog/release/release-note-1_0

Rspack・Webpackエコシステムと互換性のあるビルドアナライザツール「Rsdoctor」の 1.0がリリースされました。

## Biome v2.0 beta

https://biomejs.dev/blog/biome-v2-0-beta/

Biome v2.0のBeta版がリリースされました。

PluginやDomain機能の追加、`import` の sort ロジックでの改善が行われました。
Plugin やDomainの詳細に関しては以下のページが参考になります。

https://biomejs.dev/linter/plugins
https://next.biomejs.dev/linter/domains/

## Intent to Deprecate and Remove: Deprecate special font size rules for H1 within some elements

https://groups.google.com/a/chromium.org/g/blink-dev/c/OWd80XhwHrI
https://groups.google.com/a/mozilla.org/g/dev-platform/c/CzG_pVa7pws/m/Ab3Bwsg2BQAJ

HTML5 で導入された Sectioning Contents、特に Outline Algorithm により、レンダリングエンジンの実装ではセクションのネストが深くなるほど Headings の font-size が小さくなるようになっていますが、それを Living Standard では remove しようという動きです。

影響範囲の懸念から、仕様から Outline Algorithm の記述が remove されるだけで、UA スタイルシートは特に変更されない方向で議論は進んでいます。
Chromium 系ブラウザではconsole エラーと Lighthouse スコアへの影響が出るようになるようです。

# あとがき

CSS Form Control Styling の First Public Working Draft、アツいですね🎉

> Title: CSS Form Styling Module Level 1
> Shortname: css-forms
> Level: 1
> **Status: DREAM**
>
> https://github.com/w3c/csswg-drafts/commit/9b62e3fa2097a339df6b79b5e85bf01cf8da4520
