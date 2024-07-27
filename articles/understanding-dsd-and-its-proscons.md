---
title: "安全なDeclarative Shadow DOM をsetHTMLUnsafeで実現する"
emoji: "🌓"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["web", "typescript", "javascript"]
publication_name: "cybozu_frontend"
published: true # trueを指定する
published_at: 2024-08-09 12:00 # 未来の日時を指定する
---

※ この記事は [CYBOZU SUMMER BLOG FES '24](https://cybozu.github.io/summer-blog-fes-2024/) Frontend Stageの9日目の記事です。

# Practice Safe DSD with setHTMLUnsafe

[Interop 2024のFocus Areas](https://web.dev/blog/interop-2024?hl=ja#all_focus_areas_for_2024)となっているWeb Componentsに関する新機能の一つに、Declarative Shadow DOMがあります。

`<template>`における`shadowrootmode`属性がFireFox123で対応したことを以て、Declarative Shadow DOMが全ての主要ブラウザで利用可能になり、Baselineに追加されました。

https://caniuse.com/?search=Declarative%20Shadow%20DOM
https://webstatus.dev/features/declarative-shadow-dom

このDeclarative Shadow DOMに紐づく新たなAPIとして、`setHTMLUnsafe`や`parseHTMLUnsafe`がUnsanitized HTML parsing methodsとして最近Baselineに追加されています。

https://webstatus.dev/features/parse-html-unsafe

今回は、Declarative Shadow DOMとは何か、その期待される使いどころ、そして`setHTMLUnsafe`や`parseHTMLUnsafe`を使ってShadow DOMに動的コンテンツを追加する方法について紹介します🌼

## Shadow DOM is 何?
Shadow DOMは、Web Componentsの一部として、Webページの一部をカプセル化するための技術です。
Shadow DOMを使用することで、Webページの一部を隔離し、その部分にスタイルや機能を適用することが可能になります。これにより、Webページ全体のスタイルや機能が影響を受けることなく、特定の部分だけを変更できます。

https://developer.mozilla.org/ja/docs/Web/API/Web_components#%E6%A6%82%E5%BF%B5%E3%81%A8%E4%BD%BF%E7%94%A8%E6%B3%95

## Shadow DOMの難点
https://www.wiktorwisniewski.dev/blog/exploring-declarative-shadow-dom#pitfalls

## Declarative Shadow DOM is 何？
DSD === Shadow DOM without JS。

> Declarative Shadow DOM is a way to render a [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) without needing any JavaScript.

Declaretive Shadow DOMについてめっちゃまとまってた
https://qiita.com/tronicboy/items/68f2d9ae1c93a9c3f2cb

従来の作成方法
① customElements.defineを呼んでCustom Elementを定義
② this.attachShadow({mode: 'open'})でShadow DOMを作成
③ shadowRoot.innerHTMLなどでShadow DOMに要素を追加

## Declarative Shadow DOM が解決したこと
従来のShadow DOMの作成方法は、JavaScriptでShadowRootを作成し、その中に要素を追加する方法でした。つまり、Webページを読み込んでそれがレンダーされてからやっとJavaScriptが実行され、Shadow DOMが生成されていました。
しかし、Declarative Shadow DOMを使うと、HTMLの中でブラウザにShadow DOMを作るように指示することができます。これにより、Shadow DOMの構造がHTMLの中に明示的に記述されるため、コードの可読性が向上し、メンテナンス性が高まります。
加えて、含めたいスタイルシートもHTMLの中に記述できるため、Shadow DOMに部分的にCSSを適用することができます。
レンダリングの観点からは、Shadow DOMの構造がHTMLの中に記述されることで、ブラウザがShadow DOMの構造を事前に把握できるため、SSRが叶います。（別にサーバ使ってないのにSSRって言っていいのか）
つまり、サーバーサイドでShadow DOMを構築することで、SEO対策や初期レンダリングの高速化が可能になります。

Declarative Shadow DOMを使用したWeb Componentsの作成方法
① Web Componentsのカスタム要素を定義
② <template>要素を使ってShadow DOMの構造を定義
③ <template>要素のshadowrootmode属性にopenを指定
④ <template>要素の中にShadow DOMに追加したい要素を記述
⑤ <template>要素をカスタム要素の中に配置

```html
  <body>
    <my-comment-component>
      <template shadowrootmode="open">
        <link rel="stylesheet" href="style.css">
        <h2>Comment From User</h2>
        <p>This product is great. I use it all the time.</p>
      </template>
    </my-comment-component>
  </body>

  <script>
    class MyCommentComponent extends HTMLElement {
      connectedCallback() {
        console.log("Shadow Root: ", this.shadowRoot);

        const h = this.shadowRoot.querySelector('h2');
        h.style.color = 'red';
      }
    }

    customElements.define("my-comment-component", MyCommentComponent);
  </script>
```

とかこことか読んでみる
https://www.konnorrogers.com/posts/2023/what-is-declarative-shadow-dom#why-is-this-important
https://www.wiktorwisniewski.dev/blog/exploring-declarative-shadow-dom#rescue

## Declarative Shadow DOM の使いどころ
[Maybe you don't need Declarative Shadow DOM at all?](https://www.wiktorwisniewski.dev/blog/exploring-declarative-shadow-dom#javascript)

## `setHTMLUnsafe`や`parseHTMLUnsafe`を使ってShadow DOMに動的コンテンツを追加する
`setHTMLUnsafe`や`parseHTMLUnsafe`を使うことで、動的コンテンツをShadow DOMに追加することができます。
https://developer.chrome.com/blog/new-in-chrome-124?hl=ja#dsd
https://thathtml.blog/2024/01/dsd-safety-with-set-html-unsafe/

## Web Components ってなんで欲しかったんだ？
![alt text](image-1.png)
React/Vue/Angularでも良いのでは？
他のライブラリに依存せずに、web標準でコンポーネントを作成できる

再利用性: Web Componentsは独自の要素を定義することで、これを他のプロジェクトやページで再利用できます。
カプセル化: Shadow DOMを使用することで、コンポーネント内のスタイルや振る舞いを隠蔽し、外部からの影響を受けにくくします。
フレームワーク非依存性: Web Componentsは標準のWeb技術で構築されており、他のフレームワークに依存せずに使用できます。（異なるフレームワーク間で再利用可能なコンポーネントが作成できる）

![alt text](image-2.png)
https://www.docswell.com/s/jxck/5246NN-1st-year-of-webcomponents-v4#p24

## まとめ


https://web.dev/blog/interop-2024?hl=ja#declarative-shadow-dom
https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_shadow_DOM
https://www.wiktorwisniewski.dev/blog/exploring-declarative-shadow-dom
https://www.konnorrogers.com/posts/2023/what-is-declarative-shadow-dom
https://thathtml.blog/2024/01/dsd-safety-with-set-html-unsafe/
https://webstatus.dev/features/parse-html-unsafe?q=baseline_date%3A2024-03-01..2024-07-24+
https://chromestatus.com/feature/6560361081995264
https://www.mitsue.co.jp/knowledge/blog/frontend/202407/04_0815.html
https://developer.chrome.com/blog/new-in-chrome-124?hl=ja#dsd
https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#unsafe-html-parsing-methods
https://blog.jxck.io/entries/2023-01-07/new-css-capabilities-for-component.html
https://speakerdeck.com/uhyo/shadow-domtocssnoxian-zhuang
https://www.docswell.com/s/jxck/5246NN-1st-year-of-webcomponents-v4#p11