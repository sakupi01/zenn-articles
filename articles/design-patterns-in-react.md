---
title: "プロジェクトを理解するためのReactデザインパターン"
emoji: "🎨"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "javascript"]
published: true
publication_name: "cybozu_frontend"
published_at: 2023-12-10 10:00 # 未来の日時を指定する
---

※ この記事は [Cybozu Frontend Advent Calendar 2023](https://adventar.org/calendars/9255) の 10 日目の記事です。

私は内定者アルバイトとして[フロリア](https://blog.cybozu.io/entry/2022/02/04/171154)に配属された当初、抽象化された見慣れないモジュールの数々の読解に時間がかかってしまいました。

React は拡張性のあるエコシステムや充実した開発者ツールのおかげで、多くの開発者に使用されるライブラリとなっていますが、それだけではなく、React のデザインパターンを適切に使用することで開発プロセスが格段に効率よくなるものです。
そしてその「デザインパターン」というものが、所属チームのコードベースでは適切に組み込まれたり改良されたりしており、保守・運用性や再利用性の高いフロントエンド刷新を支えてくれているのだと感じています。

今回は、学生ももう終わり（？）ということで、ハッカソンで「とりあえず動けばヨシ！」みたいになっていた頃の自分に一石を投じる目的で、React のデザインパターンについてお話ししていこうと思います🌟

## React におけるデザインパターン

デザインパターンの詳細に入る前に「デザインパターンとは何なのか？」「どうしてデザインパターンが必要とされているのか？」というのを理解しておきたいです。

デザインパターンの基本的な役割は、開発するうえで起こる問題に対してのテンプレート・共通の解決策となることです。
デザインパターンは専門性を持ったモジュール群やパターンで、開発にかかる時間を大きく節約してくれたり、コードの可読性をあげたり、メンテナンスしやすくしたりしてくれます。

React や JavaScript のデザインパターンについてはすでに謳われており、今回の記事は Patterns.dev の内容を簡単なアプリケーションの実践に落とし込んだものとなります。
https://www.patterns.dev/

## Repository
今回使用したリポジトリです。
https://github.com/saku-1101/design-patterns-demo
![demoアプリ](/images/mov2.gif)
早速、デモアプリケーションで使われているデザインパターンを見ていきましょう。
## カスタム Hooks
React v16.8.0 から導入された[React Hooks](https://ja.react.dev/reference/react/hooks) は、`state` やコンテキスト、`ref` などにシンプルにアクセスするための今となっては必要不可欠な機能です。
そんな React Hooks を用いた同じロジックが複数のコンポーネントで必要になったとき、カスタム Hooks が効果を発揮します。

カートの中身と追加した商品の量を書き換えるために、`localStorage` を複数のコンポーネントから操作したいです。
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/dashboard/hooks/useLocalStorage.ts#L1-L21
「商品量の取得・追加・削除を制御するカードの中のボタン」と「商品量を表示するカートのバッジ」でそれぞれ上記のコードを書いても結果は同じなのですが、冗長さや再利用性、メンテナンス性のことを考えると避けたい方法です。
その代わりに、React Hooks を用いたロジックを `useLocalStorage` というカスタム Hooks に切り出して、`localStorage` を操作する箇所をカスタム Hooks に集約させることができます。これで、`localStorage` が必要なときは「ボタン」も「バッジ」も `useLocalStorage` を使用すれば良くなります。

もちろん `localStorage` 以外にも、カスタム Hooks を使うと便利な局面はたくさんあって、
- データフェッチをするとき
- window にアクセスするとき
- 複数のコンポーネント間で `state` の切り替えをするとき

など、**ある特定の操作対象に複数の要素からアクセスを試みる場合**は、特にカスタム Hooks の効果が発揮されます。

## 高階コンポーネント(HOC)パターン
高階コンポーネントパターンの前に「高階」とはどういった意味なのでしょうか？😶
wikipedia - [高階関数](https://ja.wikipedia.org/wiki/%E9%AB%98%E9%9A%8E%E9%96%A2%E6%95%B0)
> 高階関数（こうかいかんすう、英: higher-order function）とは、第一級関数をサポートしているプログラミング言語において少なくとも以下のうち1つを満たす関数である。
> - 関数（手続き）を引数に取る
> - 関数を返す

MDN - [First-class Function (第一級関数)](https://developer.mozilla.org/ja/docs/Glossary/First-class_Function)
> あるプログラミング言語が第一級関数 (First-class functions) を持つと言われる場合、その言語の関数がその他の変数と同様に扱われることを表します。例えば、こうした言語では、関数を他の関数への引数として渡したり、他の関数から返却したり、変数の値として代入したりすることができます。

JavaScript は第一級関数を持つプログラミング言語なので、高階関数をサポートしています。
そして、高階関数とは「関数を引数にとる」「関数を返す」のいずれかまたはどちらも満たすような関数のことなので、以下のようなものが高階関数だといえます。
```js: 高階関数の例
function higherOrderFn() {
  return () => {
    console.log("Hello!");
  };
}
```

[高階コンポーネントパターン](https://www.patterns.dev/react/hoc-pattern)では、この高階関数を利用してアプリケーション全体で再利用可能なロジックをコンポーネントに渡すことができます。具体的には、高階コンポーネントパターンを実現する高階コンポーネント（HOCs）は**コンポーネントを引数にとり、さらに手の加えられた新たなコンポーエントを返します**。
説明だけではわかりにくいと思うので、HOCs を利用してコンポーネントを改良してみましょう。

デモアプリケーションでは、アプリケーション全体のデータ取得時の仕様として
- loading 状態 => スケルトンコンポーネント
- error 状態 => Sorry, data could not be fetched.🥲
- !data 状態 => No data was found.☹️

を表示するということが決まっています。

もし、この処理を個々のコンポーネントで行うとなると以下のような処理をデータフェッチを行うすべてのコンポーネントで書くことになってしまいます。
```ts: SomeComponent.tsx
export function SomeComponent() {
  const {data, isLoading, error} = useSomeData();
  // 👇データ取得時の状態表示を各コンポーネントで書かねばならない
  if (isLoading) return <SomeSkeleton />
  else if (error) return <p>Sorry, data could not be fetched.🥲</p>
  else (!data) return <p> No data was found.☹️</p>

  return (
    <SomethingToRender />
  )
}
```
ここで HOCs を使用してみましょう！
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/libs/withFetchingState.tsx#L1-L35

`withFetchingState`HOC は、**コンポーネントを引数として受け取り、受け取ったコンポーネントにローディングの機能をつけたコンポーネントを返す関数を返します**。関数を返している関数なので、HOC は”高階関数”ですね。

そんなデータ取得状態表示機能をつけてくれる `withFetchingState`HOC を具体的なコンポーネントに適用してみます。

🔽カード群を返す `CardWrapper` コンポーネントを `withFetchingState` で状態表示化
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/ui/dashboard/cards.tsx#L6-L31

🔽ユーザー群を返す `Users` コンポーネントを `withFetchingState` で状態表示化
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/ui/dashboard/users.tsx#L6-L63

🔽状態表示化が施されたコンポーネントを使用する
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/dashboard/index.tsx#L4-L11

`withFetchingState`HOC を通して、アプリケーションのデータ取得時の仕様を共通化して再利用できました🌟

このように、HOCs はアプリケーションを通して横断的な関心ごとにまとめて対応するとき特に有効です。

さらに、高階コンポーネントは**合成**することもできます。
たとえば、すでに状態表示機能付きのカードコンポーネントをホバーしたときに
- Do you want me?😘
![ホバー時の挙動](/images/image.png)

というメッセージが出現する機能を追加したいとします。
これを `withHover`HOC を用いて実現すると、次のようになります。
https://github.com/saku-1101/design-patterns-demo/blob/main/src/libs/withHover.tsx
https://github.com/saku-1101/design-patterns-demo/blob/3c658d03ddec051a95218a2307004c8f2b0e53f1/src/ui/card.tsx#L5

React が Compositional であるという特徴を活かせる HOC パターンをうまく利用することでコードを[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)に保つことができていますね！

とはいえ、HOC パターンをカスタム Hooks で置き換えることができる場合もあります。
上記の例をカスタム Hooks で実現するにはカスタム Hooks 内での DOM の操作が必要になってきますが、[前バージョンReactの公式ドキュメント](https://ja.legacy.reactjs.org/docs/hooks-faq.html#do-hooks-replace-render-props-and-higher-order-components)にもあるように、フックを使うことで大抵の場合はカバーできそうです。


## Presentational&Containerパターン
[Presentational&Containerパターン](https://www.patterns.dev/react/presentational-container-pattern)ではコンポーネントの役割を Presentation と Container という 2 つのカテゴリで分けて考えます。
- Container Components: データの管理をするコンポーネント。**自身がラップする**Presentation Components に必要なデータを受け渡す責務。
- Presentation Components: データ Container Components から取得し、表示するコンポーネント。受け取ったデータを**変更することなく**期待通りに表示する責務。

Presentational&Container パターンは React において[SoC - 関心の分離](https://en.wikipedia.org/wiki/Separation_of_concerns)を実現する方法の 1 つとして広く知られています。
具体的には、このパターンによりビュー(Presentation)をロジック（Container）から分離できます。

例として、先ほど[高階コンポーネントの章]()でデータ取得時の表示を共通化した `ProductListWithFetchingState` コンポーネントを、ビュー(Presentation)とロジック（Container）に切り分けてみましょう。

🔽データ取得をするロジック（Container）
https://github.com/saku-1101/design-patterns-demo/blob/3c658d03ddec051a95218a2307004c8f2b0e53f1/src/product-list/container.tsx#L4-L17
- `ProductListWithFetchingState`: Presentational Component で表示のみの責務
- `ProductListContainer`: Container Component でデータフェッチの責務

という構造になっており、きちんと表示部分とデータ取得部分の責務の分割ができていますね！

***

余談ですが、React Server Components の登場によって、最近は特に表示部分を分割することが React において重要になってきました。
これに関しては、以下の記事で詳しく書かれています。
https://azukiazusa.dev/blog/server-components-testing/

React Server Components を使用しない場合だと、Container コンポーネントを使用する代わりにカスタム Hooks を使用することによって Container コンポーネントという余分なレイヤーを省いて関心を分離できます。カスタム Hooks を導入することにより、Container コンポーネントを作らずに簡単に Presentation コンポーネントをステートフルにできます。


## Compoundコンポーネントパターン
[Compoundコンポーネントパターン](https://www.patterns.dev/react/compound-pattern)では、複数のコンポーネントが state やロジックを共有できるので、1 つのタスクを実行するために連携する複数のコンポーネントを作成する場合に用います。
![Compoundコンポーネントパターン](/images/image1.png)
*出典 - Patterns.dev*

例として、Dashboard, Product List, Product Gallery を行き来できる Tab(Tab に紐付く子要素の表示だけを切り替える）の実装を考えてみます。

Tab を構成するためのコンポーネントとして、大きく以下の 2 つを持ちます。
- `TabList`: Tab のバー部分
- `TabDisplay`: 内容を表示する部分

![Tabを追加したアプリ](/images/image0.png)
Tab を実装するには、どの値が `TabList` で選択されたのかを `TabDisplay` が知っておく必要があります。これは複数のコンポーネント間で状態が結びついて 1 つの機能が実現されると言うことができ、Compound コンポーネントパターンが使えそうです！

実際に Compound コンポーネントパターンを使ってアプリにタブを追加してみましょう💫

以下は Compound コンポーネントパターンを使って作成した Tab を使用するときの全体像です。
https://github.com/saku-1101/design-patterns-demo/blob/main/src/App.tsx
`Tabs` が ContextProvider の役割を担っており、配下のコンポーネントに Context に詰められた値を配布します。

:::details 詳細の実装と説明
詳細を見ていきます。まずは Context を作成します。
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/ui/home/utils/tabsContext.ts#L3-L9
次に、作成した TabsContext に具体的な `activeTab` と `onChange` の値を詰めて `Tabs` 内のコンポーネントで使用できるようにしています。`activeTab` は押下されたタブのインデックス番号を管理し、`onChange` はタブが押されたときに `activeTab` の値を更新する役割です。
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/ui/home/tabs.tsx#L60-L70

また Context に詰められた値を取得して使用するというロジックをカスタム Hooks に切り出しておきます。Tabs 配下の `TabList`・`Tab`・`TabDisplay`・`TabDisplayContent` から Context の値へのアクセスを集約するためです。
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/ui/home/hooks/useTabxContext.tsx#L1-L14

Tab をクリックすると `onChange` が発火し、`activeTab` が更新されます。
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/ui/home/tabs.tsx#L23-L43
`TabDisplayContent` は `Tab` コンポーネント内で同期している `activeTab` を読み取って、`activeTab` となどしい index 値を持つ children コンポーネントを表示するという処理を行います。
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/ui/home/tabs.tsx#L49-L58

🔽Tabs 全体のコード
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/ui/home/tabs.tsx
:::

これで、Tab でコンポーネントを切り替えることができるようになりました👏🏻

他にも、このパターンのユースケースとしては以下などが挙げられそうです。
- トグル
- アコーディオン
- メニューバー

## Render Prop パターン
[Render Propパターン](https://www.patterns.dev/react/render-props-pattern)について理解してきます。
一般的に、レンダープロップというと**JSX(TSX)を返却する関数を値とするprops**のことを指します。
具体的には、Render Prop パターンのコンポーネントは、props として JSX(TSX)を返す関数をとり、その関数を自身のレンダリングロジック（return で JSX(TSX)をレンダリング）を用いる代わりに呼び出すことでレンダリングを行います。つまり、props を用いて**何をレンダリングするかを外側から決定できるような構造**になります。

なんだか分かりにくいですね。例を用いて確認します🧗🏻‍♀️

商品のデータを表示をする `ProductGallery` と `ProductList` があります。`ProductGallery` では画像だけの表示、`ProductList` では詳細を表示したいです。使用するデータは一緒で、表示方法が異なります。
Render Props パターンを使って「外側のコンポーネント」である `ProductRenderer` コンポーネントから、`ProductGallery` と `ProductList` がそれぞれ何を表示すべきか決定してあげる仕組みを作っていきましょう！

まず、`ProductRenderer` は Render Props として渡ってきた `renderItem` をレンダリングしてくれるコンポーネントです。
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/product/product.tsx

特筆したいのは `ProductRenderer` がレンダリングを行っている部分で、自身で取得したデータを Render Props に注入して Render Props が返す JSX(TSX)のレンダリングを行います。
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/product/product.tsx#L26-L26
つまり、`renderItem` に何が渡ってくるかに応じて UI を変更できます。

🔽ProductList のとき
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/product/list/index.tsx
🔽ProductGallery のとき
https://github.com/saku-1101/design-patterns-demo/blob/6d2d1f5e3dd6722b514098a40580515988ad136d/src/product/gallery/index.tsx
`ProductRenderer` という、**データを注入してレンダリングをする責務を持つがどうレンダリングしたら良いかは知らないコンポーネント**に、`ProductGallery` と `ProductList` という**レンダリングすべきもの自体を `props` として注入してあげる**ことで適切にレンダリングができるようになりました🧑🏻‍🎨

このパターンも、React Server Components でサーバー側のデータフェッチ処理と表示部分を剥がすのに有効かもしれません。

## まとめ
今回は、

1. カスタム Hooks
2. 高階コンポーネント（HOC)パターン
3. Compound コンポーネントパターン
4. Presentational&Container パターン
5. Render Prop パターン

の 5 つの React におけるデザインパターンについて実践を交えながらまとめてみました。

パターンを理解することで、コード仕組みや意図を把握するための時間を短縮できたり、関わる人にとって分かりやすいコードを書くことができる気がします。

とはいえ、こうしたパターンをコードに落とし込む技術は一朝一夕に身につくものではないので、読み手を意識したコーディングを日々心がけていきたいです🌱