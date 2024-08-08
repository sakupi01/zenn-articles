---
title: "Declarative Shadow DOMを利用したWeb標準なコンポーネントをSSR・CSRで実現する"
emoji: "🌓"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["frontend", "WebComponents", "DeclarativeShadowDOM", "CustomElements"]
publication_name: "cybozu_frontend"
published: true # trueを指定する
published_at: 2024-08-09 17:30 # 未来の日時を指定する
---

:::message
この記事は、[CYBOZU SUMMER BLOG FES '24](https://cybozu.github.io/summer-blog-fes-2024/) (Frontend Stage) DAY 9の記事です。
:::

[Interop 2024のFocus Areas](https://web.dev/blog/interop-2024?hl=ja#all_focus_areas_for_2024)の1つに、[Web Components](https://wicg.github.io/webcomponents/)があります。このWeb Componentsに関連する機能として、[Declarative Shadow DOM](https://caniuse.com/?search=Declarative%20Shadow%20DOM)や[`setHTMLUnsafe`](https://caniuse.com/?search=setHTMLUnsafe)、[`parseHTMLUnsafe`](https://caniuse.com/?search=parseHTMLUnsafe)が2024年に入って新たにBaselineに追加されました。

これらの機能・Web APIは、サーバーサイドでの宣言的なShadow DOMの構築によるJavaScriptが無効な環境でも動作するWeb Componentsの実現や、クライアントサイドでの動的なDeclarative Shadow DOMの追加によるWeb Componentsの利用範囲の拡大に寄与してくれています。

今回は、このような盛り上がりを見せるWeb Componentsが、Declarative Shadow DOMや`setHTMLUnsafe`・`parseHTMLUnsafe`の登場によってどのような進化を遂げているのか、具体例を交えながら理解していく記事です🌼

## Web Components とは？

端的に言うと、**Webページの構成要素をCustom Elementとして定義し、機能やスタイルがページ内の他の要素に影響を与えないように隔離したうえで、再利用可能なコンポーネントとして扱うための技術**です。

一見すると、私たちが普段使っているReactやVue.jsなどのフレームワークでコンポーネント指向開発をするのと変わらないように思えるかもしれません🤔

しかし、他フレームワークのコンポーネントとWeb Componentsの差分は、Web標準レベルでコンポーネントが定義されるかどうかという点にあります。

例えば、ReactのコンポーネントはWeb標準ではないので、使用するにはReactをインストールしている必要があります。しかし、Web ComponentsはWeb標準の技術のため、ライブラリに依存しない、つまりライブラリ間で互換性のあるコンポーネントの開発が可能になるといえます。

そんな **[Web Components](https://wicg.github.io/webcomponents/)** は、**[Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html)**・**[HTML Templates](https://www.w3.org/TR/html-templates/)**・**[Shadow DOM](https://wicg.github.io/webcomponents/spec/shadow/)** の3つの仕様の上に成り立っています。

早速、Custom ElementsやShadow DOMを中心に、Declarative Shadow DOMや`setHTMLUnsafe`、`parseHTMLUnsafe`がどうWeb Componentsの進化に寄与しているのか、具体例を交えて見ていきましょう🧚🏻‍♀️

### Custom Elements

Custom Elementsは、独自のHTML要素を定義するための技術です。

Custom Elementsを使用することで、Webページに独自のHTML要素を追加し、その要素に対して独自の機能やスタイルを定義できます。

https://github.com/sakupi01/webcomponents-with-dsd/blob/6ff4e15daf79e10fba64a4123b8c9f0c147b97e2/shadow-dom.html#L38-L68

https://github.com/sakupi01/webcomponents-with-dsd/blob/6ff4e15daf79e10fba64a4123b8c9f0c147b97e2/shadow-dom.html#L24-L29

![カスタム要素](/images/simple_custom_elements.png)

### Custom Elementsの問題点

Custom Elementsとして要素を定義すると、上記のように、ドキュメント内でそのコンポーネントが再利用可能になります。しかし、Custom Elementsだけでは、**スタイルや機能の隔離ができないため、他の要素に影響を与えてしまう可能性**があります。

例えば、以下のドキュメントにはあらかじめ`.hello-world`クラスのスタイルを定義していました。

https://github.com/sakupi01/webcomponents-with-dsd/blob/6ff4e15daf79e10fba64a4123b8c9f0c147b97e2/shadow-dom.html#L1-L17

こうしたグローバルに定義されたクラスと競合しないよう、**Custom Elementだけに適用が閉じたCSSクラスを書きたい**ですが、Custom Elementだけではそれができません。

それゆえ、以下のようにCustom Elementで`.hello-world`クラスを同様に定義して使おうとすると、あらかじめグローバルに定義されていたクラスを上書きしてしまいます。

https://github.com/sakupi01/webcomponents-with-dsd/blob/6ff4e15daf79e10fba64a4123b8c9f0c147b97e2/shadow-dom.html#L38-L68

上記のコードをブラウザ上で見てみると、`<hello-world />`要素のスタイルが、別の`<button>`要素（「I must be RED」ボタン）にも適用されてしまっています。

![「I must be RED」ボタンが`<hello-world />`で定義されたCSSにより上書きされた青色のスタイルになる](/images/customelements-effect.png)
*「I must be RED」ボタンが`<hello-world />`で定義されたCSSにより上書きされた青色のスタイルになる*

そこで登場するのが、**Shadow DOM**です✨

## Shadow DOM

Shadow DOMは、Webページから完全に隔離されたDOMツリー(Shadowツリー)とそれに関連するスタイルを定義するための技術です。

### Shadow DOM が解決すること

Shadow DOMを使用することで、**Webページの一部を隔離されたDOM（ShadowRoot）としてレンダリングできるため、Webページ全体のスタイルや機能に影響を与えず、特定の部分だけを変更できます。**
<!-- textlint-disable -->
コンポーネント指向開発においては、例えばCSS ModulesやScoped CSS、CSS-in-JSを使用することで、コンポーネントごとにスタイルをカプセル化し、ビルド段階で名前の衝突を避けるクラス名に変換できるので、実装する上では隔離されたものとして扱うことができます。
<!-- textlint-enable -->
しかし、Shadow DOMを使用することで**DOMレベルのカプセル化されたスタイリングが可能になるため、完全に独立したコンポーネントの作成と、グローバルスコープの汚染を防ぐことが可能です。**

### Shadow DOM の作成方法

Shadow DOMは以下のようにして作成できます。

1. `this.attachShadow({mode: 'open'})`でShadow DOMを作成し、Custom Elementに紐づける
2. `shadowRoot.innerHTML`などでShadow DOMに要素を追加

https://github.com/sakupi01/webcomponents-with-dsd/blob/main/shadow-dom.html#L70-L105

:::message
HTML要素の中には、Shadowツリーを紐づけることができない(`this.attachShadow()`できない)要素もあります。
詳しくは「[DOM Living Standard - 有効なshadow host](https://dom.spec.whatwg.org/#valid-shadow-host-name)」の項目を参照してください。
:::

上記の例では、`this.attachShadow({ mode: 'open' })`でShadow DOMを作成し、`this.shadowRoot.innerHTML`でShadow DOMに要素を追加しています。
Shadow DOMを使用することで、スタイルをShadow Root内に記述でき、グローバルスコープの汚染を防ぐことができていそうです。

以下に示すとおり、`<shadowed-hello-world />`要素を使用すると、ドキュメント内の他の`<button>`要素（「I must be RED」ボタン）のスタイルは`<shadowed-hello-world />`のスタイルに影響を受けないことがわかります。

![「I must be RED」ボタンのスタイルはShadowed Custom Elementsにより定義されたCSSでは上書きされない](/images/shadow-element.gif)
*「I must be RED」ボタンのスタイルはShadowed Custom Elementsにより定義されたCSSでは上書きされない（Shadow DOMでないCustom Elementを使用するとGlobalが上書きされる）*

Shadow DOMを使用することで、以前のようにCustom Elementのスタイルや機能が他の要素に影響を与えることなく、DOMレベルで隔離されたコンポーネントを構築できました👏🏻

### Shadow DOMの問題点

Web標準でのコンポーネント指向開発において、Custom Elementsのスタイルや機能を隔離するためにShadow DOMはなくてはならない技術ですが、以下のような問題点を含んでいます。

- JavaScriptが使用できない環境では動作しない
- Shadow DOMはクライアントサイドJavaScriptで構築されるため、レイアウトシフトを引き起こす可能性がある
- Shadow DOMはサーバーサイドでの利用をサポートしていないため、SSRができない

これらの問題は、Shadow DOMがクライアントサイドJavaScript環境でのみサポートされるWeb APIで生成されていることに帰結すると言えるでしょう。

そこで登場したのが、**Declarative Shadow DOM**です。

## Declarative Shadow DOM (DSD) とは？

Declarative Shadow DOM is **Shadow DOM without JavaScript**です🌝
（以下、DSD）

### DSD が解決すること

[従来のShadow DOMの作成方法](#shadow-dom-の作成方法)は、JavaScriptでShadowRootを作成し、その中に要素を追加する方法でした。
つまり、Webページを読み込んでHTMLが解析され、CSSが適用されてからやっとJavaScriptが実行され、Shadow DOMが生成されていました。

DSDはHTMLパーサーの機能です。
ShadowRootは、HTML解析中に存在する `shadowrootmode`属性を持つ`<template>`タグに対して解析され、添付されます。つまり、Shadow DOMは最初のHTML解析時に構築できると言えます。

これにより、Hydrationを待つことなく、Shadow DOMを構築できるようになります。加えて、レイアウトシフトを引き起こさずにコンポーネントをレンダリングできたり、SEOの面でも恩恵を受けたりできます🌟

### DSD によるShadow DOMの構築

SSR環境下で、DSDを使用したWeb Componentsを作成・使用してみます。
以下のリポジトリでは、SSRのためのWebサーバーとしてHonoを使用していますが、Web標準なコンポーネントを実現するため、それ以外のフロントエンドフレームワークは使用していません。

https://github.com/sakupi01/ssred-webcomponents-app

DSDはHTMLのtemplate要素を用いて作成できます。

以下は、Web ComponentのShadow DOMをDSDを用いてSSR時に構築し、Hydrationの際にCustom Elementを登録してWeb Componentの機能をアップグレードする一連の手順です。

#### 1. `<template>`要素を使ってDSDの構造を定義
1. `<template>`要素の`shadowrootmode`属性にopenを指定
2. `<template>`要素内にShadow DOMの構造を記述

https://github.com/sakupi01/ssred-webcomponents-app/blob/88892d0e9329c8e5cfb1b2193eff4aff53f3399d/src/index.html#L11-L30

#### 2. Custom Elementを実装
1. HTMLElementを継承した`HelloWorldCE`クラスを作成
2. Custom Elementの持つ機能を`connectedCallback`メソッド内で実装

https://github.com/sakupi01/ssred-webcomponents-app/blob/7458cb78d082dca52ea77987a357d52997a37c68/src/web-components/hello-world/custom-element.ts#L1-L9

#### 3. クライアントサイドのエントリーポイント（`./src/client/index.tsx`）を作成
1. `window.customElements.define`でCustom Elementを定義
2. `./src/client/index.tsx`はビルド時に`./static/client.js`として出力する

https://github.com/sakupi01/ssred-webcomponents-app/blob/7458cb78d082dca52ea77987a357d52997a37c68/src/client/index.tsx#L5-L8

#### 4. `./static/client.js`を`<script>`タグで読み込む

#### 5. Hydration時にclient.jsで定義されたCustom Elementが登録され、Web Componentの機能がアップグレードされる

Custom Elementが有効になり、Custom Element内で実装した機能がShadow DOMに適用される

https://github.com/sakupi01/ssred-webcomponents-app/blob/33a63b14e3006bbb45565e3930112b4ebad8b46b/src/index.html#L1-L11

これにより、SSRされた結果のHTMLにShadow DOMが構築されます🎉

試しに、JavaScriptを無効化した環境でShadow DOMが構築されるか確認してみましょう。

![JavaScriptが無効な環境でもShadow DOMを用いたWeb Component(`<hello-world-button />`)が構築される](/images/dsd.gif)
*JavaScriptが無効な環境でもShadow DOMを用いたWeb Component(`<hello-world-button />`)が構築される*

[従来のShadow DOMの作成方法](#shadow-dom-の作成方法)でやっていた、JavaScriptでShadowRootを作成したり要素を追加したりする手順が不要になり、JavaScriptが無効な環境でもShadow DOMが構築されることが確認できますね！

もちろん、Custom Elementsの登録（上記手順5, 6）はJavaScriptが有効な環境下で行なう必要があるので、JavaScriptを無効化した状態ではCustom Elementで定義されているWeb Componentsの機能は享受できません。
しかし、DOM上はShadow DOMが構築されているため、変わらずCLSやSEOの面での恩恵を受けることができます。

とはいえ、実用上は、イベント発火後などクライアントサイドで動的にDSDを追加したい場面もあります。
DSDを使用することで、**SSRでShadow DOMを構築できるようになりましたが、クライアントサイドJavaScriptを用いてDSDを追加する方法**はあるのでしょうか？🤔

## `setHTMLUnsafe`・`parseHTMLUnsafe`で動的にDSDを追加する

例えば、ユーザーがボタンをクリックした際に、新たにDSDを用いたWeb Component（`<hello-world-button />`）を追加したい場合を考えてみましょう。

まず、以下の`InnerHtmlDSDAddButton`で`innerHTML`を使用して、`body`に`<hello-world-button />`を追加してみます。

https://github.com/sakupi01/ssred-webcomponents-app/blob/88892d0e9329c8e5cfb1b2193eff4aff53f3399d/src/client/index.tsx#L9-L25

https://github.com/sakupi01/ssred-webcomponents-app/blob/5f2f6946dbc9fa8ca73e48202f7264e42cec9da6/src/client/index.tsx#L44-L76

しかし、`InnerHtmlDSDAddButton`ボタンを押しても**DSDを用いたWeb Componentはレンダーされません**。
これは、セキュリティ上の理由から、`innerHTML`などのフラグメント解析APIがDSDを解析できないためです。

![innerHTMLを使用してDSDを追加できない](/images/innerhtml.gif)
*innerHTMLを使用してDSDを利用したWeb Component（`<hello-world-button />`）を追加できない*

DSDを適用したHTMLを解析する唯一のWeb APIは、`setHTMLUnsafe`または`parseHTMLUnsafe`を使用することです。（2024年8月現在）
`setHTMLUnsafe`は、`innerHTML`と同様にHTMLフラグメントの解析に加えて、DSDの解析もサポートしています。
以下の`SetHtmlUnsafeDSDAddButton`では、`setHTMLUnsafe`で`<hello-world-button />`を追加しています。

https://github.com/sakupi01/ssred-webcomponents-app/blob/5f2f6946dbc9fa8ca73e48202f7264e42cec9da6/src/client/index.tsx#L27-L42

`setHTMLUnsafe`を使用すると、DSDを含んだHTMLフラグメントが正しく解析され、Shadow DOMが構築されていることが確認できます。[^1]

![setHTMLUnsafeを使用してDSDを利用したWeb Component（`<hello-world-button />`）を追加する](/images/sethtmlunsafe.gif)
*setHTMLUnsafeを使用してDSDを利用したWeb Component（`<hello-world-button />`）を追加する*

もう1つのAPIである`parseHTMLUnsafe`も、`DOMParser.parseFromString()` と同様に機能し、DSDの解析が可能です。

しかし、読んで字の如く「Unsafe」と名前にあるとおり、これらのAPIは安全でないという点に注意が必要です。

> これらの API は両方とも安全ではありません。つまり、入力サニタイズを行いません。そのため、何を与えても安全であることを確認する必要があります。今後のリリースでは、入力のサニタイズを提供するバージョンを用意する予定です。
*出典：[Chrome 124 の新機能](https://developer.chrome.com/blog/new-in-chrome-124?hl=ja#dsd)*

まだWICGで検討段階の仕様ですが、将来的には`setHTMLUnsafe`や`parseHTMLUnsafe`が安全に使用できるようAPIが改善されたり、`setHTML`や`parseHTML`といったデフォルトでサニタイズしてくれるAPIが提供される見込みがあります。[^2]

***

このように、DSDを利用してWeb ComponentsをSSRしたり、`setHTMLUnsafe`・`parseHTMLUnsafe`を用いることでクライアントサイドでも動的にDSDを追加したりすることが可能になりました🎉

## まとめ

DSDを使用することで、従来のShadow DOMを用いたWeb Componentsの構築手法に比べて、JavaScriptが無効な環境でも動作使用可能な宣言的なWeb Componentsの構築の実現に近づきました。

また、`setHTMLUnsafe`や`parseHTMLUnsafe`を使用することで、動的にDSDを追加することが可能になり、Web Componentsは利用範囲の広がりを見せてくれました。

とはいえ、動的に追加されるDSDの安全性への懸念[^2]や、Custom Elementsの記述を宣言的にするDeclarative Custom ElementsやHTMLリソース（Custom Element、HTML Template、スタイルなど）をモジュールとしてexport/importするHTML Modulesに関する合意形成や実装など[^3]、まだまだ実用に至るには考慮事項が残されているようです。

進化の目まぐるしいWeb Components、引き続き注目していきたいです💃🏻✨

## 参考
1. https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_shadow_DOM
2. https://developer.chrome.com/docs/css-ui/declarative-shadow-dom?hl=ja#parser-only
3. https://speakerdeck.com/uhyo/shadow-domtocssnoxian-zhuang
4. https://www.docswell.com/s/jxck/5246NN-1st-year-of-webcomponents-v4
5. https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md
6. https://wicg.github.io/webcomponents/
7. https://gist.github.com/EisenbergEffect/8ec5eaf93283fb5651196e0fdf304555
8. https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Declarative-Custom-Elements-Strawman.md

[^1]: Chrome 127のExperimental Featuresフラグを有効化、Chrome Canaryで確認できました
[^2]: [Sanitization Explainer](https://github.com/WICG/sanitizer-api/blob/main/explainer.md)
[^3]: [Declarative Syntax for Custom Elements](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Declarative-Custom-Elements-Strawman.md)、[HTML Modules and Declarative Custom Elements Proposal](https://gist.github.com/EisenbergEffect/8ec5eaf93283fb5651196e0fdf304555)や[declarative-custom-elementsに関してfileされたIssue](https://github.com/search?q=repo%3AWICG%2Fwebcomponents+declarative-custom-elements&type=issues)を参照