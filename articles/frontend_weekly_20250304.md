---
title: "Interop 2025, CSS if()・Custom Functions・ Invoker CommandsのShipなど" # 目立ったニュースを選ぶ
emoji: "🌟" # お好きな絵文字を
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["CybozuFrontendWeekly", "frontend"]
published: true
publication_name: "cybozu_frontend"
published_at: 2025-03-05 12:00 # 未来の日時を指定する
---

こんにちは！サイボウズ株式会社フロントエンドエンジニアの[saku (@sakupi01)](https://x.com/sakupi01)です。

# はじめに

サイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。

今回は、2025/03/04のFrontend Weeklyで取り上げた記事や話題を紹介します。

# 取り上げた記事・話題

## Intent to Experiment: Interest Invokers

https://groups.google.com/a/chromium.org/g/blink-dev/c/LLgsMjTzmAY/m/my-groups

Interest InvokersのIntent To Experimentです。
`interesttarget`属性を利用することで、要素に「興味を示した」際（hoverや割り当てたhotkey押下などの際）に特定のアクションをトリガーできるようになります。([Explainer](https://open-ui.org/components/interest-invokers.explainer/))
Chrome 135から137にかけてOrigin Trialが実施される予定とのことです。

## Interop 2025: another year of web platform improvements

https://web.dev/blog/interop-2025

Interop 2025がローンチされました。今年のFocus Areasは以下の機能となっています。

- Anchor positioning
- `backdrop-filter`
- Core Web Vitals
- `<details>` element
- Layout
- Modules
- Navigation API
- Pointer and mouse events
- Remove mutation events
- `@scope`
- scrollend event
- Storage Access API
- `text-decoration`
- URLPattern
- View Transition API
- WebAssembly
- Web compat
- WebRTC
- Writing modes

Focus Areasに加えて、機能のテストや情報が不十分な分野について調査を行なう「Investigation」項目も設定されています。

社内では、パフォーマンスを測る指標であるCore Web Vitalsや、JSON Import AttributesなどのModules、Navigation APIに関心が集まっていました。

各社からのIntrop2025に関するブログ記事も公開されています。

- [Announcing Interop 2025 | WebKit](https://webkit.org/blog/16458/announcing-interop-2025/)
- [Interop 2025 | Igalia](https://www.igalia.com/2025/02/13/Interop-2025.html)
- [Interop 2025 Launch - Bocoup](https://www.bocoup.com/blog/interop-2025)
- [Microsoft Edge and Interop 2025 - Microsoft Edge Blog](https://blogs.windows.com/msedgedev/2025/02/13/microsoft-edge-and-interop-2025/)
- [Launching Interop 2025 - Mozilla Hacks - the Web developer blog](https://hacks.mozilla.org/2025/02/interop-2025/)

なお、プロジェクトの進捗はWeb Platform Tests Dashboardで確認できます。

https://wpt.fyi/interop-2025

## Intent to Ship: CSS if() function

https://groups.google.com/a/chromium.org/g/blink-dev/c/EOz7NK6Y0cE/m/VsZveC-fAwAJ

CSS `if()`関数のIntent to Shipです。
CSSで条件分岐する方法はContainer Queriesや`@media`、`@supports`などがすでに存在しますが、`if()`を利用するとそれらをインラインで記述できます。

## Intent to Ship: CSS Custom Functions (@function)

https://groups.google.com/a/chromium.org/g/blink-dev/c/bvi4D7eD7wI/m/djYVLu6OAwAJ

CSS Custom FunctionsのIntent to Shipです。
`@function`を利用することで、CSS内で関数を定義し、その関数をCustom Propertyのように繰り返し利用できます。
`@function`のなかでは`if()`の使用も許可されているため、併用することでよりシンプルに`@function`の条件分岐を記述できそうです。

## Intent to Experiment for Longer — Roma’s Unpolished PostsIntent to Experiment for Longer

https://blog.kizu.dev/intent-to-experiment-for-longer/

`if()`とCustom FunctionsのShipが早すぎることに関するブログ記事です。
CSSWGでopenなissueがないからといって、shipしていいと判断していいわけではなく、少なくともFlag付きでShipしてほしいし、Ship自体待ってほしいと主張しています。

現在、Custom FunctionsについてはChrome 139にリリースを延期、`if()`も試用期間の延長を求められている状態です。

> so we'll retarget this for the M139 release (branching June 23rd)
> https://groups.google.com/a/chromium.org/g/blink-dev/c/bvi4D7eD7wI/m/djYVLu6OAwAJ

## Sunsetting Create React App

https://react.dev/blog/2025/02/14/sunsetting-create-react-app

Create React Appは非推奨となり、新規アプリケーションの作成にはNext.js、React Router、Expoなどのフレームワークの使用を推奨することが発表されました。

また、基本的にViteの利用が推奨されており、フレームワークに関してもViteをベースにしたものが推奨されています。

なお、これに対してEvan you氏は疑問を投げかけており、フレームワークへの移行コストとリスクの可能性や、ルーティングやデータ取得を例に挙げてFWの利用を優位とする理由について疑問を投げかけています。

https://x.com/youyuxi/status/1891113204438512083

## DevToolsに搭載されたパフォーマンスAIアシスタントをNEWTに使ってみる

https://zenn.dev/reiwatravel/articles/031f88f4639b99

Chrome DevToolsに搭載された[パフォーマンス計測のAIアシスタント](https://developer.chrome.com/docs/devtools/ai-assistance/performance)を使って、パフォーマンス改善を行なった事例が紹介されています。

## Intent to Ship: Invoker Commands; the command and commandfor attributes

https://groups.google.com/a/chromium.org/g/blink-dev/c/ctNbl4gWLuk/m/my-groups

`command`/`commandfor`属性のIntent to Shipです。
この機能により、`<dialog>`やPopoverでのクリック時のアクションを宣言的な方法で定義できるようになります。([Explainer](https://open-ui.org/components/invokers.explainer/))

提案に対してはMozillaとWebKitもPositiveで、Web Platform Testsでのテストも広範にPassしています。
Chrome 135でのリリース予定とのことです。

## Announcing TypeScript 5.8 RC

https://devblogs.microsoft.com/typescript/announcing-typescript-5-8-rc/

TypeScript 5.8のリリース候補(RC)が公開されました。主な変更点としては以下のとおりです。

- `return`内の条件分岐に対するより厳密な型チェック
- Node.js 22以降で、CJSからESMを`require()`で読み込むことが可能に
- Node.js 18向けの安定したモジュール設定をする、`--module node18`フラグの追加
- TypeScript固有の構文（enum、namespaceなど）をエラーとする`--erasableSyntaxOnly`オプションの追加
- 特定の組み込み`lib`をオーバーライドできるようにする機能を明示的にoffにする`--libReplacement`フラグの追加
- `.d.ts`ファイルにおける、変数のプロパティ名の扱いの改善

## Deno Update: 最近のフロントエンド向け機能

https://kt3k.github.io/talk_deno_frontend/#1

Denoのフロントエンド開発に関する機能の紹介です。

Reactの型付けはdeno.jsonの`compilerOptions`で指定することにより可能、Deno 2.2からは`compilerOptions`をワークスペースごとで設定できるようになります。
また、Reactのフックをlintするための「Rules of Hooks」も、同じくDeno 2.2から設定可能になり、これ以外にもReact系のリントルールが追加されるようです。
加えて、カスタムルールの作成もJSで行なえるようになりました。
フォーマットに関しては、CSS/HTMLのフォーマットがDeno 1.46から可能で、JS中のCSSのフォーマットができるよう現在開発が進んでいるとのことです。

# あとがき

`if()`やCustom Functions、Invoker Commandsなど、エキサイティングな新機能が次々と登場していますね！影響力・拡大力が大きな機能なだけに、慎重なリリースが求められているので、今後の動向に注目です。
