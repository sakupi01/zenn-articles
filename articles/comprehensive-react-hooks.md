---
title: "Reactの状態をコントロールして適切にHooksを利用する"
# <!-- // 自信を持ってReact Hooksを使うために(意識したいこと・意識していること) -->
emoji: "🐣"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "typescript", "javascript"]
published: false
---
Reactと状態は切っても切れない関係です。なぜなら、Reactは状態に基づいて画面を更新するコンポーネントベースのUIライブラリだからです。

そんなReactの状態を管理・操作しやすくしてくれているのが、React 16.8から登場したフックです。それゆえ、フックを正しく利用するにあたってReactの状態の理解は非常に重要であり、Reactの状態の理解があやふやだと、予期せぬ挙動やバグのもとになりかねません。

今回の記事では、Reactの状態を理解しながら適切な箇所で適切なHooksを選択していくプロセスを再確認し、自信を持ってReactをコントロールできるようになりそう！と言えることをゴールとしています🎉

:::message
先日、大学で所属するサークル内で「useStateとかuseEffectとか基本的なHooksは使えるっちゃけど、useMemoとかuseCallbackとかあんまよく使わんHooksについて解説してほしいー」と言われ、張り切って解説したところ約3時間くらい話してしまい、せっかくなので残しておこうというのがこの記事執筆の本当の背景です。
(LT会だったんだけど、またLong Talkの歴史を積み上げてしまった、はわわ🫥)
:::

今回使用した即席匿名メモアプリのコードベースです。
サークルでは、コミットに沿って説明をしていきました。
https://github.com/saku-1101/hooks-demo-app
![demoアプリ](/images/memoapp.gif)
## 【序章】フックとレンダーとコミットとstate
フックとは、そもそも何なのでしょうか？Reactの公式ドキュメントにはきちんと明文化されています。

> React では、useState やその他の use で始まる関数はフック (Hook) と呼ばれます。
フックは、React がレンダーされている間のみ利用可能な特別な関数です。フックを使うことで、さまざまな React の機能に「接続 (hook into)」して使用することができます。

Learn React - [はじめてのフック](https://ja.react.dev/learn/state-a-components-memory#meet-your-first-hook)

では、**レンダーされている間**とはどの期間を指すものなのでしょうか？👀

### レンダーとコミット
まず、「レンダーされている間」を捉えるために、コンポーネントが画面表示されるまでのプロセスを理解したいです。

コンポーネントはライフサイクル(マウント→アップデート→アンマウント)の最初のステップである「マウント」がなされる前に、まずReactによって**レンダー**される必要があります。

レンダーとは、**コンポーネントが画面表示される際に必要なプロセスの一つであり、コンポーネントがReactアプリから呼び出されることです。**
コンポーネントが呼び出される（レンダーがトリガーされる）原因は大きく２つあります。
1. コンポーネントの初回レンダー(ReactはRootコンポーネントを呼び出す)
2. コンポーネントまたはその祖先のset関数によるstateの更新(Reactはset関数が使用されたコンポーネントを呼び出す)

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
*参考 - Learn React - [state 更新後の再レンダー](https://ja.react.dev/learn/render-and-commit#re-renders-when-state-updates)*

こうして生成されるstateを利用して、そのJSX内のprops、EventHandler、ローカル変数などが計算されます。

## 【序章】フックの全体像
stateはReactを理解する上で最も理解しておきたい機能(自分調べ)ですが、フックはその他のReactの機能をさらに使いやすくしてくれます。
そんなフックオールスターズには以下のようなものたちがいます。(stableで提供されているものを列挙しています(2024年1月末現在))
![hooks](/images/hooks.png)

こんなにたくさんいらっしゃるんですね！✨
今回は、フックオールスターズから選抜メンバーとして
- useEffect
- useState
- useReducer
- useContext
- useSyncExternalStore
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

⭐️そんなuseEffectを使用して初期メモデータをフェッチしましょう！

🐛バグCommit - [chore: ちょっとよくないuseEffect](https://github.com/saku-1101/hooks-demo-app/commit/01e5f46018264808809a87ddcdcc5e2af5974644#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)
📝改善Commit - [feat: フィルタリング機能](https://github.com/saku-1101/hooks-demo-app/commit/f0a0238fb830852f88758504e38def07c3ea3428#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)

## useStateでレンダー間でstateを管理しよう
📝該当Commit - [feat: イベントハンドラ内でのstateの更新&cud](https://github.com/saku-1101/hooks-demo-app/commit/4d974f66fe8b728986e2e0b7b976138449078f25)

さて、現状はメモのRead結果をUIに反映することしかできません。Create, Update, Delete結果もUIに反映できるようにしたいです。
画面を更新するためには、レンダーをトリガーしますが、前のスナップショットの結果を記憶しつつ次のスナップショットを撮らねばなりません。
⭐️そこで、`useState`を使用してレンダー間でstateを共有しつつ、コンポーネントのレンダーをトリガーしてUIを更新しましょう！


## useReducerでstateを一元管理しよう
📝該当Commit - [refactor: useReducerでリファクタ](https://github.com/saku-1101/hooks-demo-app/commit/1d82ab58e10367ef91f4ae74373ebeb4ee7484a8)


## useContextで広範囲のstateを管理しよう
📝該当Commit - [feat: contextでテーマを変更](https://github.com/saku-1101/hooks-demo-app/commit/443237bbfc328b2638a69a088603eada4d710379)

## useSyncExternalStoreで外部storeから値を読み取ろう

## useMemo・useCallback・memoで最適化しよう
🐛バグCommit - [chore: 人為的に全てのメモを表示する時に遅延させる](https://github.com/saku-1101/hooks-demo-app/commit/85738e3a0bb74030963a22d3772b5dbcb4af592e#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)
📝改善Commit - [feat: useMemoによってthemeの切り替えでは遅延は起こらなくなった](https://github.com/saku-1101/hooks-demo-app/commit/43835bd5430f82a5f0fe25dbadd1f18c7ba20fb6#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)
🐛バグCommit - [chore: 人為的にメモを表示するときに遅延させる](https://github.com/saku-1101/hooks-demo-app/commit/1464a8e41209eb3f334771a7455fe3d761f4c1dd#diff-427031f7e98419706622e4274aa267fd6278e4f3f9f4bf8505b4fc79de74c7e4)
📝改善Commit - [feat: useCallbackとmemoによってコンポーネントのメモ化(useCallback使用部分)](https://github.com/saku-1101/hooks-demo-app/commit/caeed10f4aeef808b93c4f681af88bbc2243fc28#diff-faf44dda17f06c640ccc8cac9d594cabf901254e1dacddecd0d6154171328a9e)
📝改善Commit - [feat: useCallbackとmemoによってコンポーネントのメモ化(memo使用部分)](https://github.com/saku-1101/hooks-demo-app/commit/caeed10f4aeef808b93c4f681af88bbc2243fc28#diff-427031f7e98419706622e4274aa267fd6278e4f3f9f4bf8505b4fc79de74c7e4)


## useRefでUIに関係ない値をレンダー間で保持しよう
🐛バグCommit - [chore: 複数のタイマーが同時に起動してしまうコンポーネント(startを押すほどカウントダウンが早くなる)](https://github.com/saku-1101/hooks-demo-app/commit/7ec4f66a6cf757843dfcbefe240d0b4828fbabae#diff-79aa0e105b07134a836fa8f5f7228226ded60539123a9a755b5ce850fbe50cbe)
📝改善Commit - [feat: 正常タイマー:常に一つのタイマーしか存在しない](https://github.com/saku-1101/hooks-demo-app/commit/829baf1beb316fd60a286ffacf6fba55e91566c0#diff-79aa0e105b07134a836fa8f5f7228226ded60539123a9a755b5ce850fbe50cbe)

## まとめ
Reactの状態の重要性について理解したのち、広く浅くHooksに触れました。

今回は、あくまでReact純正のHooksに主眼を置いていたのでサードパーティ製のライブラリ等には触れませんでしたが、こうした複雑なReactの状態を少ない手順で管理しやすくしたいときに、サードパーティ製のライブラリの使用は有効です。
ライブラリの内部では、今回理解を深めていったフックたちがふんだんに使用されているため、使用されているフックを予測したり仕組みを知りたい時にも、フック理解の効果が発揮されます。

どんな技術に触れる時も、一つひとつ基本を着実に理解しながら発展させていくプロセスを大切にしたいです🧚🏻

:::message
間違った理解や記述があった箇所は教えていただけるととっても嬉しいです🐣
:::