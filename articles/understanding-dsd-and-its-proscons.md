---
title: "Declarative Shadow DOMとそれを安全に扱うsetHTMLUnsafe"
emoji: "🌓"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["web", "typescript", "javascript"]
publication_name: "cybozu_frontend"
published: true # trueを指定する
published_at: 2024-08-09 12:00 # 未来の日時を指定する
---

:::message
この記事は、[CYBOZU SUMMER BLOG FES '24](https://cybozu.github.io/summer-blog-fes-2024/) (Frontend Stage) DAY 9の記事です。
:::

<!-- # Practice Safe DSD with setHTMLUnsafe -->

[Interop 2024のFocus Areas](https://web.dev/blog/interop-2024?hl=ja#all_focus_areas_for_2024)となっているWeb Componentsに関する新機能の一つに、Declarative Shadow DOMがあります。

`<template>`における`shadowrootmode`属性がFireFox123で対応したことをもって、Declarative Shadow DOMが全ての主要ブラウザで利用可能になり、Baselineに追加されました。

https://caniuse.com/?search=Declarative%20Shadow%20DOM

このDeclarative Shadow DOMに関連する新たなAPIとして、`setHTMLUnsafe`や`parseHTMLUnsafe`がUnsanitized HTML parsing methodsとして最近BaselineのNewly Availableとなりました。

https://webstatus.dev/features/parse-html-unsafe

今回は、Declarative Shadow DOMとは何か、そして`setHTMLUnsafe`や`parseHTMLUnsafe`を使ってShadow DOMに動的コンテンツを追加する方法について紹介します🌼

## Shadow DOM is 何?
Shadow DOMは、[Web Components](https://developer.mozilla.org/ja/docs/Web/API/Web_components#%E6%A6%82%E5%BF%B5%E3%81%A8%E4%BD%BF%E7%94%A8%E6%B3%95)を構成する技術の一部として、Webページから完全に隔離されたDOMツリー(Shadowツリー)とそれに関連するスタイルをScoped CSSとして定義するための技術です。

Shadow DOMを使用することで、Webページの一部を隔離されたDOM（ShadowRoot）としてレンダリングできるため、Webページ全体のスタイルや機能の影響を受けることなく、特定の部分だけを変更できます。

### Shadow DOM の作成方法

Web Componentsの文脈において、Shadow DOMは以下のようにして作成することができます。

1. `customElements.define`を呼んでCustom Elementを定義
2. `this.attachShadow({mode: 'open'})`でShadow DOMを作成し、要素に紐づける
3. `shadowRoot.innerHTML`などでShadow DOMに要素を追加

https://github.com/sakupi01/webcomponents-with-dsd/blob/9d46fff4244190360ce4a4bafb6a39d88eaff661/declarative-shadow-dom.html#L25-L42

```html: レンダー結果
<shadow-host-custom-element>
  // 👇ここから下がShadowツリー
  #shadowRoot
  <style>
    h1 {
      color: red;
    }
  </style>
  <h1>🙈 This is Shadow DOM 🙈</h1>
</shadow-host-custom-element>
```

:::message
HTML要素の中には、Shadowツリーを紐づけることができない(`this.attachShadow()`できない)要素もあります。
詳しくは「[有効なshadow host](https://dom.spec.whatwg.org/#valid-shadow-host-name)」の項目を参照して下さい。
:::

### Shadow DOMの欠点

ライブラリ非依存でのコンポーネント指向開発において、Shadow DOMは非常に便利な技術ですが、以下のような点を考慮する必要がありました。

- JavaScriptが使用できない環境では動作しない
- Shadow DOMはクライアントサイドJavaScriptで構築されるため、CLSを引き起こす可能性がある
- Shadow DOMはクライアントサイドJavaScriptでのみサポートされており、サーバーサイドで記述できる構文が存在しないため、SSRができない

これらの問題は、Shadow DOMがクライアントサイドJavaScript環境でのみサポートされるWeb APIであることに帰結すると言えるでしょう。

そこで登場したのが、**Declarative Shadow DOM**です。

## Declarative Shadow DOM is 何？

Declarative Shadow DOM is **Shadow DOM without JavaScript**です🌝

### Declarative Shadow DOM が解決したこと

[従来のShadow DOMの作成方法](#shadow-dom-の作成方法)は、JavaScriptでShadowRootを作成し、その中に要素を追加する方法でした。
つまり、Webページを読み込んでそれがレンダーされてからやっとJavaScriptが実行され、Shadow DOMが生成されていました。

Declarative Shadow DOM（以下、DSD）はHTMLパーサーの機能です。つまり、ShadowRootは、HTML解析中に存在する `shadowrootmode`属性を持つ`<template>`タグに対してのみ解析され、添付されます。つまり、Shadow DOMは最初のHTML解析時に構築できるということになります。

これにより、JavaScriptのHydrationを待つことなく、Shadow DOMを構築できるようになります。加えて、CLSを引き起こさずにコンポーネントをレンダリングできたり、SEOの面でも恩恵を受けたりすることができます🌟

### Declarative Shadow DOM によるShadow DOMの構築

DSDにより、以下のようにHTMLのtemplate要素を用いてShadow DOMを作成することができます。

1. `<template>`要素を使ってShadow DOMの構造を定義
2. `<template>`要素の`shadowrootmode`属性にopenを指定
3. `<template>`要素の中にShadow DOMに追加したい要素を記述

https://github.com/sakupi01/webcomponents-with-dsd/blob/9d46fff4244190360ce4a4bafb6a39d88eaff661/declarative-shadow-dom.html#L10-L19

試しに、JavaScriptを無効化した環境でShadow DOMが構築されるか確認してみます👀

![demoアプリ](/images/dsd.gif)

[従来のShadow DOMの作成方法](#shadow-dom-の作成方法)でやっていた、JavaScriptでShadowRootを作成したり要素を追加したりする手順が不要になり、HTMLで完結していますね！

DSDを使用することで、静的にShadow DOMを構築することができるようになりましたが、JavaScriptを用いてDSDを追加する方法はあるのでしょうか？🤔

実用上は、非同期処理後や、イベント発火後など、JavaScriptを用いて動的にDSDを追加したい場面が出てくると考えられます。

## `setHTMLUnsafe`・`parseHTMLUnsafe`で動的にDSDを追加する

例えば、サーバサイドから返されたDSDを含むHMTLフラグメントを新たに追加したいユースケースを想定します。

この場合、以下のように`innerHTML`を使用したくなりますが、これではShadow DOMは構築されません。

https://github.com/sakupi01/webcomponents-with-dsd/blob/9d46fff4244190360ce4a4bafb6a39d88eaff661/dynamic/dynamic-declarative-shadow-dom.html#L90-L92

これは、セキュリティ上の理由から、`innerHTML`などのフラグメント解析APIはDSDをパースすることができないためです。

DSDを適用したHTMLを解析する唯一の方法は、`setHTMLUnsafe`または`parseHTMLUnsafe`を使用することです。（2024/8月現在利用可能なWeb APIにおいて）

https://github.com/sakupi01/webcomponents-with-dsd/blob/9d46fff4244190360ce4a4bafb6a39d88eaff661/dynamic/dynamic-declarative-shadow-dom.html#L94-L96

`setHTMLUnsafe`は、`innerHTML`と同様にHTMLフラグメントを解析しますが、DSDのパースもサポートしています。

以下の図では、`setHTMLUnsafe`を使用すると、DSDを含んだHTMLフラグメントが正しくパースされ、Shadow DOMが構築されていることが確認できます。(Chrome 127のExperimental Featuresフラグを有効化、Chrome Canaryで確認できました)
![setHTMLUnsafeを使用してJSでDSDを追加している図](/images/setHTMLUnsafe.png)

もうひとつのAPIである`parseHTMLUnsafe`は、`DOMParser.parseFromString()` と同様に機能しますが、これもDSDのパースが可能です。

しかし、読んで字の如くですが、「Unsafe」と名前についている通り、これらのAPIは安全ではないという点に注意が必要です。

> これらの API は両方とも安全ではありません。つまり、入力サニタイズを行いません。そのため、何を与えても安全であることを確認する必要があります。今後のリリースでは、入力のサニタイズを提供するバージョンを用意する予定です。
> [Chrome 124 の新機能](https://developer.chrome.com/blog/new-in-chrome-124?hl=ja#dsd)

これに関してはまだWICGで検討段階の仕様ですが、将来的には`setHTMLUnsafe()`や`parseHTMLUnsafe`が安全に使用できるように改善されたり、`setHTML`や`parseHTML`といったデフォルトでサニタイズしてくれるAPIが提供される見込みがあります。
参考: [Sanitization Explainer](https://github.com/WICG/sanitizer-api/blob/main/explainer.md)

## まとめ

DSDを使用することで、従来のShadow DOMを用いた手法に比べて、Progressive Enhancementで宣言的なWeb Componentsの構築の実現に近づいたと言えそうです。

また、`setHTMLUnsafe`や`parseHTMLUnsafe`を使用することで、動的にDSDを追加することが可能になり、Web Componentsは利用範囲の広がりを見せてくれました。

とは言え、Web Componentsを構成するCustom Elementの登録がまだ宣言的ではない（[Proposal](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Declarative-Custom-Elements-Strawman.md)）ことや、動的なDSDの安全性など、まだまだ実用に至るには考慮すべき課題が残されていますが、発展が目まぐるしいWeb Componentsの今後に注目したいです💃🏻

## 参考
https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_shadow_DOM
https://developer.chrome.com/docs/css-ui/declarative-shadow-dom?hl=ja#parser-only
https://speakerdeck.com/uhyo/shadow-domtocssnoxian-zhuang
https://www.docswell.com/s/jxck/5246NN-1st-year-of-webcomponents-v4
https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Declarative-Shadow-DOM.md