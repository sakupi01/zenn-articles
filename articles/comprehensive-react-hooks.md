---
title: "Reactの状態をコントロールして適切にHooksを利用する"
# <!-- // 自信を持ってReact Hooksを使うために(意識したいこと・意識していること) -->
emoji: "🤹🏻‍♀️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "typescript", "javascript"]
published: false
---
Reactと状態は切っても切れない関係です。なぜなら、Reactは状態に基づいて画面を更新するコンポーネントベースのUIライブラリだからです。

そんなReactの状態を管理・操作しやすくしてくれているのが、React 16.8から登場したフックです。それゆえ、フックを正しく利用するにあたってReactの状態の理解は非常に重要であり、Reactの状態の理解があやふやだと、予期せぬ挙動やバグのもとになりかねません。

今回の記事では、Reactの状態を理解しながら適切な箇所で適切なHooksを選択していくプロセスを再確認し、自信を持ってReactをコントロールできるようになりそう！と言えることをゴールとしています🎉

:::message
先日、大学で所属するサークル内で「useStateとかuseEffectとか基本的なHooksは使えるっちゃけど、useMemoとかuseCallbackとかあんまよく使わんHooksについて解説してほしいー」と言われ、張り切って解説したところ約3時間くらい喋ってしまい、せっかくなので残しておこうというのがこの記事執筆の本当の背景です。
(LT会だったんだけど、またLong Talkの歴史を積み上げてしまった、はわわ🫥)
:::

今回使用した即席匿名メモアプリのコードベースです。
サークルでは、コミットに沿って説明をしていきました。（あくまで即席なので細かいこと気にしながら作ってませんorz）
https://github.com/saku-1101/hooks-demo-app
![demoアプリ](/images/memoapp.gif)
## 【序章】フックとレンダーとコミットとstate
そもそもフックとは何なのでしょうか？👀
Reactの公式ドキュメントにはきちんと明文化されています。

> React では、useState やその他の use で始まる関数はフック (Hook) と呼ばれます。
フックは、React がレンダーされている間のみ利用可能な特別な関数です。フックを使うことで、さまざまな React の機能に「接続 (hook into)」して使用することができます。

Learn React - [はじめてのフック](https://ja.react.dev/learn/state-a-components-memory#meet-your-first-hook)

では、ここでいう**レンダーされている間**とはどの期間を指すものなのでしょうか？🤔

### レンダーとコミット
まず、「レンダーされている間」を捉えるために、コンポーネントが画面表示されるまでのプロセスを理解したいです。

コンポーネントはライフサイクル(マウント→アップデート→アンマウント)の最初のステップである「マウント」がなされる前に、まずReactによって**レンダーされてコミットされる**必要があります。
![レンダーとコミット](/images/renderandcommit.png)
*出典 - Learn React*

レンダーとは、**コンポーネントが画面表示される際に必要なプロセスの一つであり、コンポーネントがReactアプリから呼び出されることです。**
コンポーネントが呼び出される（レンダーがトリガーされる）原因は大きく２つあります。
1. コンポーネントの**初回レンダー**(Reactは**Rootコンポーネントを呼び出す**)
2. コンポーネントまたはその祖先の**set関数によるstateの更新**(Reactは**set関数が使用されたコンポーネントを呼び出す**)

画面に表示(ブラウザレンダリング)される前に,レンダーによって表示・更新するコンポーネントを決めているということですね！

更新されるコンポーネントが決まったら、Reactは実際にDOMを更新する必要があります。これをReactでは**コミット**と呼んでいます。
Reactは呼び出し(レンダー)に差異があった場合にのみ，DOMを変更してコミットしています。(Hydration)
その後、コミットフェーズで行われたDOMの変更をブラウザレンダリングします。(同時にマウントされ、コンポーネントのライフサイクルがスタートします)

したがって、**「レンダーされている間」は一般的には「レンダーがトリガーされてからコミットされるまでの間」ということができ、具体的には「set関数が呼び出されてからDOMが構築されるまでの間」が当てはまります。**

つまり、フックは「レンダーがトリガーされてからコミットされるまでの間」にだけ利用可能な関数ということになります！

### レンダーとstate
レンダーはset関数によりトリガーされることから、どうやらレンダー間で情報を記憶しておく必要がありそうです。🤔
さもなければ、前回レンダー時の情報に依らないコンポーネントが生成されてしまいます。

そこで、stateというレンダー間でコンポーネントの情報を記憶しておく手段が登場します。stateはいわば**コンポーネント自身が持つメモリ**のような存在です。

以下の図のように、set関数がトリガーとなって、新しいstateを持ったコンポーネントがレンダーされます。
こうして情報の上書きはされずに再レンダーがトリガーされて新たなstateを持ったコンポーネントが出来上がるような振る舞いなので、Reactではこれを**コンポーネントのスナップショットを撮る**と表現しています。📸
![レンダーとstate](/images/renderandstate.png)
*引用 - Learn React - [state 更新後の再レンダー](https://ja.react.dev/learn/render-and-commit#re-renders-when-state-updates)*

こうして生成されるstateを利用して、そのJSX内のprops、EventHandler、ローカル変数などが計算されます。

これからフックについてお話ししていきますが、「レンダー」に関して（？）となったときは、この章に戻ってきてみてください🌻

## 【序章】フックの全体像
stateはReactを理解する上で最も理解しておきたい機能(自分調べ)ですが、フックはstateを含むその他のReactの機能をさらに使いやすくしてくれます。
そんなフックオールスターズをまとめると以下のようになります。(stableで提供されているものを列挙しています(2024年1月末現在))
![hooks](/images/hooks.png)

こんなにたくさんいらっしゃったんですね！✨
今回は、このフックオールスターズから選抜メンバーとして
- useEffect
- useState
- useReducer
- useContext
- useMemo・useCallback・memo(API)
- useRef

さんたちを匿名メモアプリに招き入れました。
早速、メンバーの特長を見ていきましょう🤸🏻

## useEffectで初期データをフェッチしよう
📝該当Commit - [feat: useEffectを用いた初期データフェッチ](https://github.com/saku-1101/hooks-demo-app/commit/2bf2f9636e0e53f15c6813c1599a83d7881a2402)
`useEffect`はReactでは「避難ハッチ」と呼ばれるフックに該当します。
「避難ハッチ」とは、React の外、つまり外部システムに接続するためのReactの機能です。React 外のシステムに対して制御や同期を必要とする場合に使用することが期待されます。
(e.g; レンダリング時にwebsocketサーバと接続を確立，初期データを取得など)

また、`useEffect`はイベントではなくレンダー自体によって引き起こされるアクションのためにあるということもできます。なぜなら、`useEffect`の発火条件である依存配列の差分チェックはレンダー毎に行われるからです。

そんなuseEffectを使用して初期メモデータをフェッチしましょう！🏄🏻

`useEffect`の基本的な使用方法に関する説明は他の記事に譲りますが、初期データフェッチということで`useEffect`の第二引数である依存配列には何もリアクティブな値を入れていません。
「依存配列が空＝レンダリングの前後で比較するものがない＝最初しか実行されない」ということを利用して初期データフェッチを行うためです。
(※`didInit`は開発モードで2回レンダリングが起こることへの対応です)
https://github.com/saku-1101/hooks-demo-app/blob/2bf2f9636e0e53f15c6813c1599a83d7881a2402/src/MemoListContainer.tsx#L5-L27
これで初期メモデータを取得して表示できるようになりました！

## useStateでレンダー間でstateを管理しよう
📝該当Commit - [feat: イベントハンドラ内でのstateの更新&cud](https://github.com/saku-1101/hooks-demo-app/commit/4d974f66fe8b728986e2e0b7b976138449078f25)

さて、現状はメモのRead結果をUIに反映することしかできません。Create, Update, Delete結果もUIに反映できるようにしたいです。
画面を更新するためには、レンダーをトリガーしますが、前のスナップショットの結果を記憶しつつ次のスナップショットを撮らねばなりません。
そこで、`useState`を使用してレンダー間でstateを共有しつつ、コンポーネントのレンダーをトリガーしてUIを更新しましょう！
:::details 詳細の実装と説明
まず、メモの表示を行う`MemoListPresenter`にmemos stateとmemos set関数を渡します。`MemoListPresenter`がmemos stateを読み、set関数でレンダーをトリガーしてスナップショットを撮ることができるようにするためです。
```diff ts
function MemoListContainer() {
  const [memos, setMemos] = useState<Memo[]>([]);
  useEffect(() => {
    if (didInit) return;
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/memos`
      );
      const data = await response.json();
      return data;
    };

    // ✅ fetchData()はアプリケーションの初期化時に一度だけ実行される
    fetchData()
      .then((memos: Memo[]) => setMemos(memos))
      .catch(console.error);
    didInit = true;
  }, []);
-  return <MemoListPresenter />;
+  return <MemoListPresenter memos={memos} setMemos={setMemos} />;
}
```
`MemoListPresenter`の`handleAddMemo`では、バックエンドとのデータ更新処理を行い、その結果を渡されたset関数を用いて再レンダーをトリガーすることでフロントエンドUIに反映しています。同ファイルの`handleUpdateMemoState`, `handleUpdateMemoTitle`, `handleDeleteMemo`でも同じ手順のことをやっています。
https://github.com/saku-1101/hooks-demo-app/blob/4d974f66fe8b728986e2e0b7b976138449078f25/src/ui/list.tsx#L6-L26
:::
これで、メモのCRUD処理の結果をUIと同期させることができました！🫶🏻

## useReducerでstateを一元管理しよう
📝該当Commit - [refactor: useReducerでリファクタ](https://github.com/saku-1101/hooks-demo-app/commit/1d82ab58e10367ef91f4ae74373ebeb4ee7484a8)

アプリケーションがもっと大きく複雑なものであった場合を考えてみましょう。

同様のstate更新ロジックがアプリケーション全体で散見されることが考えられます。

そんな時、`useReducer`を使用してstate更新ロジックを一点に集約させることができます。

useReducerを使用するメリットとしては以下のようなものがあります。
- 「どう更新するのか」(ロジック)をReducerに、「何が起きたのか」(アクション)をイベントハンドラに書くことで、コンポーネントが更新の内部処理を知らなくてもよくなる
- stateがどこで誤ってセットされたのか・どのロジックに問題があるのかが特定しやすくなる：**デバッガブル**
- reducer自体はコンポーネントに依存しない純関数のため，テストしやすくなる：**テスタブル**

:::details え、そもそもreducerって？👂🏻
一度は「わからん」てなって調べたことがある組み込みメソッドから着想を得ます
```ts
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((result, currentNumber) => result + currentNumber);
```
- reduce() 操作: 配列を受け取り、多くの値をreduceして1 つの値に「まとめる」ことができるもの
- reduceに渡している関数が「reducer」
:::

そんな`useReducer`を使ってuseStateで書かれたコードをリファクタリングしていきましょう！
:::details 詳細の実装と説明
`useState`の代わりに`useReducer`を使用します。もともと`handleAddMemo`内に書かれていたstateの更新ロジックは見当たらず、代わりに`dispatch({ type: "add", payload: addedMemo });`が追加されています。
https://github.com/saku-1101/hooks-demo-app/blob/1d82ab58e10367ef91f4ae74373ebeb4ee7484a8/src/ui/list.tsx#L10-L24
重要なstate更新ロジックはというと、`memosReducer`という関数の中にあります。`memosReducer`自体はフックではなく、memosという**stateと`{type: actionNameToDetermineWhichReduceLogicToUse; payload: objectToBeUsedInTheReduceLogic}`という形式のactionの二つの引数を持つ関数**です。この関数はtypeの種別によって異なる処理をし、処理の内容が先ほどあったstate更新ロジックと同様のものになっています。
https://github.com/saku-1101/hooks-demo-app/blob/1d82ab58e10367ef91f4ae74373ebeb4ee7484a8/src/reducer/index.ts#L3-L39
この`memosReducer`関数を`useReducer`の第一引数、初期stateを第二引数に渡すことで、`[memoのstate, stateに対する処理をのトリガーとなるdispatch]`を返すことができるようになりました。
これで、コンポーネント内でアクションtypeが`add`の処理をしたいときは`dispatch({ type: "add", payload: addedMemo });`とすれば良くなりました。
https://github.com/saku-1101/hooks-demo-app/blob/1d82ab58e10367ef91f4ae74373ebeb4ee7484a8/src/ui/list.tsx#L10-L24
:::
コンポーネントから`useState`が消えて、state管理のロジックがReducerに移譲されました。
今回はコンポーネント数も少なく、小規模なアプリケーションなので`useReducer`を使用する複雑性や実装コストの方が増しますが、大規模なアプリであった場合は前向きに検討したいstateの扱い方ですね🌟

## useContextで広範囲のstateを管理しよう
📝該当Commit - [feat: contextでテーマを変更](https://github.com/saku-1101/hooks-demo-app/commit/443237bbfc328b2638a69a088603eada4d710379)
今度はdark/lightモードの切り替えを行えるようにしたいです。🌚🌝

`useContext`は以下の場合を解決してくれるフックです。
- props を多数の中間コンポーネントを経由して渡さないといけない場合
- アプリ内の多くのコンポーネントが同じ情報を必要とする場合
- props の受け渡しによってコードが冗長になる場合(=prop drilling)

テーマのstateはアプリケーション全体に及ぶため、`useContext`が効果を発揮できると考えられます。

Contextが使用されている具体例としては、
- Reduxなどの状態管理ライブラリ
- アカウント情報の保持
- React Routerなどルーティング

などが有名です。

Context(提供されるstateの実体(の定義))とProvider(提供する親)を用意することで`useContext`は使用可能となり、Context,Providerの関係を使用するとCompound Componentsパターンを達成することができます。
（Compound Componentsパターンをフックで実現しようとした結果`useContext`が生まれた、の方が正しいかもしれません）- [React Hooks: Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks)

早速、`useContext`を使用してアプリのテーマ変更を行えるようにしていきましょう！
:::details 詳細の実装と説明
まず、Contextを定義・作成します。
https://github.com/saku-1101/hooks-demo-app/blob/bb04be114b486479bf1e03e4d7533ef887436450/src/context/theme.ts#L3-L9
作成したContextのProviderコンポーネントを作成します。Providerに実際のContextの値である`theme`と`setTheme`をvalueとして詰めます。
https://github.com/saku-1101/hooks-demo-app/blob/bb04be114b486479bf1e03e4d7533ef887436450/src/provider/theme.tsx#L3-L15
Contextが必要な子コンポーネントが全て含まれる直近の親コンポーネント（ここではアプリのRootコンポーネント）を作成したProviderでラップします。
すると、アプリのRootコンポーネント以下に含まれるコンポーネントでは`useContext`が使用可能になります。今回は`useContext`にエラーハンドリングを付与した`useThemeContext`カスタムフックとして利用できるようにします。
https://github.com/saku-1101/hooks-demo-app/blob/bb04be114b486479bf1e03e4d7533ef887436450/src/hooks/useThemeContext.ts#L4-L10
子コンポーネントから、`useThemeContext`でContextに詰められている値にアクセスして、テーマを制御できるようになります。
https://github.com/saku-1101/hooks-demo-app/blob/bb04be114b486479bf1e03e4d7533ef887436450/src/layout.tsx#L7-L33
:::

アプリケーションがダークモードに対応しました！✨
（※後続Commit - [refactor: ReducerをContextに詰める](https://github.com/saku-1101/hooks-demo-app/commit/9f838a41d228585b45937c9084ad97e0d21abf10) ではreducerをContextに詰めることで、さらに規模の大きなアプリケーションになったときにstateが管理しやすくなるようにしています。簡易的な自作Reduxの感覚です。）
## `useMemo`・`useCallback`・(`memo` API)で最適化しよう
次に、メモリストにフィルター機能をつけて、❤️(marked)、🩶(unmarked)、🧹(全表示)でメモの出しわけをできるようにします。

詳細に入る前に、`useMemo`・`useCallback`・(`memo` API)を一言でまとめておきます。
目的語が大事です。
- `useMemo`
  - 重たい**関数の計算結果**・値・JSXをキャッシュするためのフック
- `useCallback`
  - 重たい**関数**をキャッシュするためのフック
  - `memo`とよく使う
- `memo`
  - **コンポーネント**をキャッシュするためのAPI

### `useMemo`を使って値をキャッシュする
`useMemo`は値のキャッシュをしてくれる、言い換えると**レンダー前後で`useMemo`依存配列の値に差異がない場合**に**値の再計算**をスキップしてくれるフックです。

まず、最適化の恩恵をわかりやすくするために、以下のバグを仕込みます。この改悪により、🧹(全表示)するときに１秒間の遅延が発生するようになってしまいました。
![demoアプリ](/images/usememo-prev.gif)
🐛改悪Commit - [chore: 人為的に全てのメモを表示する時に遅延させる](https://github.com/saku-1101/hooks-demo-app/commit/85738e3a0bb74030963a22d3772b5dbcb4af592e#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)

このコミットを`useMemo`を使って改善していきます。
以下のように、`filterMemos()`を`useMemo`でラップすることで、ある条件下において`filterMemos()`の計算結果をキャッシュすることができます。「ある条件」とは、`useMemo`第二引数の依存配列を指しています。この場合、依存配列内の`filter`, `memos`の少なくとも一方にレンダリング間で差異があった場合にのみ、`filterMemos()`関数の返す値は「前回のレンダリング時と異なる」とマークされ、`filterMemos()`は再計算されます。言い換えると、`filter`, `memos`以外の値しかンダリング間で変化がなかった場合は、キャッシュされた`filterMemos()`の結果が使用され、`filterMemos()`は再計算されません。
https://github.com/saku-1101/hooks-demo-app/blob/bb04be114b486479bf1e03e4d7533ef887436450/src/ui/list.tsx#L95-L112
📝改善Commit - [feat: useMemoによってthemeの切り替えでは遅延は起こらなくなった](https://github.com/saku-1101/hooks-demo-app/commit/43835bd5430f82a5f0fe25dbadd1f18c7ba20fb6#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)

![demoアプリ](/images/usememo.gif)
これで、少なくともテーマ変更時(theme state変更時)に遅延が起こるということは無くなりました！👏🏻

### `useCallback`を使って関数をキャッシュする
`useCallback`は関数のキャッシュをしてくれる、言い換えると**レンダー前後で`useCallback`依存配列の値に差異がない場合**に**関数の再生成**をスキップしてくれるフックです。

### `memo`を使ってコンポーネントをキャッシュする
`memo`はフックではなくAPIの部類なのですが、コンポーネントの最適化の際に必要なAPIです。`memo`を使用すると、**`props`が変更されていないコンポーネント**の再レンダーをスキップすることができます。

以上の`useCallback`と`memo`APIをセットで使用すると、関数propsを含むコンポーネントの最適化を図れます。

#### 🎏 FYI：関数の再生成と`useCallback`の使用意義
:::details　そもそもどうして関数のキャッシュをする必要があるのか？
関数propsを含むコンポーネントの最適化で`useCallback`を使用する意義を求めるとき、そもそもどうして関数のキャッシュをする必要があるのか？という疑問がフツフツと湧いてきます。

以下のように関数が配置されている場合、一見、再レンダーがあっても関数は変化しないように思えます。
```ts
export default function Example() {
  const handleAction = () => {
    console.log("Action");
  };
  return <SomeChildComponent action={handleAction} />;
}
```
しかし、`useEffect`の依存配列の差分検知の仕組みを紐解くと、関数はレンダリングのたびに再生成されることがわかってきます。
`useEffect`依存配列の差分検知では、内部的には`Object.is()`を用いています。
https://github.com/facebook/react/blob/29fbf6f62625c4262035f931681c7b7822ca9843/packages/shared/objectIs.js
実は、この`Object.is()`ではレンダリングのたびに再生成されるObjectやSymbolの比較は期待通りに行うことができず、関数も例外ではありません。
したがって、**実際は関数はレンダリングのたびに再生成されるもので、レンダリング前後では別の関数になってしまいます。**

そうして変更があった関数を`memo`が使用されたコンポーネントに`props`として渡すとき、`memo`が使用されたコンポーネントは「あ、関数`props`に変更があった」と検知してしまい、コンポーネントの再レンダリングをしてしまうことになります。
:::
***
`useCallback`と`memo`の関係を理解したところで、以下のバグを改善していきましょう！❤️‍🔥

以下のコミットでは、レンダーの度に0.5秒間の遅延が発生する`MechaOsoiListItem`を仕込みました。改悪により、メモのレンダーに本質的には関係ないテーマの変更でも遅延が発生することがわかります。
![demoアプリ](/images/usecallback-prev.gif)
🐛改悪Commit - [chore: 人為的にメモを表示するときに遅延させる](https://github.com/saku-1101/hooks-demo-app/commit/1464a8e41209eb3f334771a7455fe3d761f4c1dd#diff-427031f7e98419706622e4274aa267fd6278e4f3f9f4bf8505b4fc79de74c7e4)

`useCallback`と`memo`を用いて`MechaOsoiListItem`コンポーネントの最適化をします。
まず、`MechaOsoiListItem`を`memo()`でラップします。これにより`MechaOsoiListItem`に渡る`props`が変更されない限りは`MechaOsoiListItem`は再レンダーされなくなります。
https://github.com/saku-1101/hooks-demo-app/blob/bb04be114b486479bf1e03e4d7533ef887436450/src/ui/list-item.tsx#L5-L24
次に、`MechaOsoiListItem`に渡る関数`props`を`useCallback`を用いてキャッシュします。
https://github.com/saku-1101/hooks-demo-app/blob/bb04be114b486479bf1e03e4d7533ef887436450/src/ui/list.tsx#L37-L58
![demoアプリ](/images/usecallback.gif)
📝改善Commit - [feat: useCallbackとmemoによってコンポーネントのメモ化(useCallback使用部分)](https://github.com/saku-1101/hooks-demo-app/commit/caeed10f4aeef808b93c4f681af88bbc2243fc28#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)
📝改善Commit - [feat: useCallbackとmemoによってコンポーネントのメモ化(memo使用部分)](https://github.com/saku-1101/hooks-demo-app/commit/caeed10f4aeef808b93c4f681af88bbc2243fc28#diff-427031f7e98419706622e4274aa267fd6278e4f3f9f4bf8505b4fc79de74c7e4)

これで、少なくともテーマ変更時(theme state変更時)に遅延が起こるということは無くなりました！👏🏻

## useRefでUIに関係ない値をレンダー間で保持しよう
`ref`はコンポーネントがレンダリングプロセスとは別に持っている「隠し箱」のようなものです。`{current: value}`のオブジェクト形式で存在しています。
よく、**値を保持できる**という観点で`useState`と比較されることがありますが、決定的な相違点は**レンダリングをトリガーすることができるか否かです。**

|  | useState | useRef |
| ---- | ---- | ---- |
| 値を格納できる | ⭕ : `state` | ⭕ : `{current: value}` |
| 再レンダリング | ⭕ : set関数を使用する為 | ❌ : 変数のように直に値を書き換える為 |

再レンダリングを行わないということは、画面の更新を行わないということですので、`useRef`ではUIとは関係のない・UIには反映されない値を保持するために使用するのが適切です。

UIには反映されない値の代表として、
- DOM要素
- timerID

などが挙げられます。

今回は`ref`を使用してtimerIDを管理し、タイマー機能を追加してみます。⏳
まず、正常な挙動をしないタイマーのコミットです。startボタンを押せば押すほどタイマーが生成され、カウントダウンが早くなります。
![demoアプリ](/images/bugtimer.gif)
🐛バグCommit - [chore: 複数のタイマーが同時に起動してしまうコンポーネント(startを押すほどカウントダウンが早くなる)](https://github.com/saku-1101/hooks-demo-app/commit/7ec4f66a6cf757843dfcbefe240d0b4828fbabae#diff-79aa0e105b07134a836fa8f5f7228226ded60539123a9a755b5ce850fbe50cbe)

`useRef`で生成した`ref`を使用してtimerIDを管理し、正常にタイマー機能を動作させましょう！🏋🏻
https://github.com/saku-1101/hooks-demo-app/blob/829baf1beb316fd60a286ffacf6fba55e91566c0/src/ui/timer.tsx#L4-L32
![demoアプリ](/images/timer.gif)
📝改善Commit - [feat: 正常タイマー:常に一つのタイマーしか存在しない](https://github.com/saku-1101/hooks-demo-app/commit/829baf1beb316fd60a286ffacf6fba55e91566c0#diff-79aa0e105b07134a836fa8f5f7228226ded60539123a9a755b5ce850fbe50cbe)

これで、タイマー機能が追加され、デモアプリケーションが完成しました🎉

## まとめ
Reactの状態の重要性について理解したのち、広く浅くHooksに触れました。

今回は、あくまでReact純正のHooksに主眼を置いていたのでサードパーティ製のライブラリ等には触れませんでしたが、こうした複雑なReactの状態を少ない手順で管理しやすくしたいときに、サードパーティ製のライブラリの使用は有効です。
ライブラリの内部では、今回理解を深めていったフックたちがふんだんに使用されているため、使用されているフックを予測したり仕組みを知りたい時にも、フック理解の効果が発揮されます。

どんな技術に触れるときも、一つひとつ基本を着実に理解しながら発展させていくプロセスを大切にしたいです🧚🏻

:::message
間違った理解や記述があった箇所は教えていただけるととっても嬉しいです🐣
:::

## おまけ　- 避けたいuseEffectの使用方法
今回のメモアプリでは❤️(marked)、🩶(unmarked)、🧹(全表示)でメモの出しわけができるフィルター機能を追加しました。その際に、フィルターされるメモをどのように管理するのかを考えます。
以下の`filterMemos`関数に着目すると、`setFilteredMemos`で再レンダーをトリガーして`filteredMemos`stateを変更することで、メモの出しわけを行なっています。memosのstate変更はCRUD処理のイベントハンドラからも行われるため、`memos`の値が更新されたときに`filteredMemos`の値が更新されるようにするため、以下では`useEffect`を使用してメモの変更を反映しています。

しかし、この書き方だと、`handleAddMemo`でmemoを追加したときに`memos` stateを更新するための`dispatch`によるレンダリングと、`memos` stateが変わったときに`filteredMemos`を更新するために発火する`useEffect`内の`setFilteredMemos`により２回のレンダリングが行われてしまいます。
メモを追加するだけでレンダリングが2回起こるということは、特別な理由がない限り避けたい方法です。
:::details 避けたいパターン
```ts
export function MemoListPresenter() {
  const ref = useRef<HTMLInputElement>(null);
  const { memos, asyncDispatch } = useMemosContext();
  const [filteredMemos, setFilteredMemos] = useState<Memo[]>(memos);
  const { theme } = useThemeContext();

  // 🤔よくあるパターン
  // レンダリングを効率的に活かせていない
  // handle...によるレンダリングが発生するたびに、
  // useEffectによるレンダリングも発生する
  useEffect(() => {
    setFilteredMemos(memos);
  }, [memos]);

  async function handleAddMemo(title: Memo["title"]) {
    asyncDispatch(
      // add apiを叩く
              ...
        dispatch({ type: "add", payload: addedMemo });
      }
    );
  }


  function filterMemos(which: "marked" | "unmarked" | "all") {
    if (which === "marked") {
      setFilteredMemos(memos.filter((memo) => memo.marked));
    } else if (which === "unmarked") {
      setFilteredMemos(memos.filter((memo) => !memo.marked));
    } else {
      return setFilteredMemos(memos);
    }
  }

  return (
    <main className="flex flex-col justify-center items-center gap-5">
        ...
         <div className="flex justify-end">
            <Button icon={"❤️"} onClick={() => filterMemos("marked")} />
            <Button icon={"🩶"} onClick={() => filterMemos("unmarked")} />
            <Button icon={"🧹"} onClick={() => filterMemos("all")} />
          </div>
          ...
            {filteredMemos.map((memo) => {
              return (
                <ListItem
                  key={memo.id}
              ...
                />
              );
            })}
        ...
    </main>
  );
}
```
:::
🐛Commit - [chore: ちょっとよくないuseEffect](https://github.com/saku-1101/hooks-demo-app/commit/01e5f46018264808809a87ddcdcc5e2af5974644#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)

その代わりに、**イベントハンドラでトリガーされるレンダーを利用して`filterMemos`で出力するstateを計算するようにします。**
上の例のような**stateの変更に基づいて別のstateを更新するという操作は一般的には避けることができ、既存のpropsやstateからレンダー中に計算することができます。**
:::details レンダー中にfilteredMemosを計算する
```diff ts
export function MemoListPresenter() {
  const ref = useRef<HTMLInputElement>(null);
  const { memos, asyncDispatch } = useMemosContext();
+  const [filter, setFilter] = useState<"marked" | "unmarked" | "all">("all");
-  const [filteredMemos, setFilteredMemos] = useState<Memo[]>(memos);
  const { theme } = useThemeContext();

-  useEffect(() => {
-    setFilteredMemos(memos);
-  }, [memos]);

  async function handleAddMemo(title: Memo["title"]) {
    asyncDispatch(
    　　　// add apiを叩く
              ...
        dispatch({ type: "add", payload: addedMemo });
      }
    );
  }

  function filterMemos(which: "marked" | "unmarked" | "all") {
    if (which === "marked") {
      return memos.filter((memo) => memo.marked);
    } else if (which === "unmarked") {
      return memos.filter((memo) => !memo.marked);
    } else {
      return memos;
    }
  }

  return (
    <main className="flex flex-col justify-center items-center gap-5">
        ...
          <div className="flex justify-end">
            <Button icon={"❤️"} onClick={() => setFilter("marked")} />
            <Button icon={"🩶"} onClick={() => setFilter("unmarked")} />
            <Button icon={"🧹"} onClick={() => setFilter("all")} />
          </div>
        ...
            {/* handle...によりレンダリングがトリガーされるタイミングを利用して
            filterMemosで出力するstateを計算する */}
            {/* ✅ レンダリングを効率的に活かせる！ */}
            {filterMemos(filter).map((memo) => {
              return (
                <ListItem
                  key={memo.id}
              ...
                />
              );
            })}
        ...
    </main>
  );
}

```
:::
📝改善Commit - [feat: フィルタリング機能](https://github.com/saku-1101/hooks-demo-app/commit/f0a0238fb830852f88758504e38def07c3ea3428#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)