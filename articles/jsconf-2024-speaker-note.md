---
title: "JSConf 2024 スピーカーノート"
emoji: "📝"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ['javascript','jsconf']
published: false
---

## はじめに

:::message
この記事は、[JSConf 2024](https://jsconf.jp/2024/) でのスピーカーのノートです。
:::

## Congrats to `Promise.try`🎉

先月東京で開催されたTC29 104thのMeetingで8年の時を経てStage4に！

Commit [c03068b](https://github.com/tc39/proposals/commit/c03068bf466470320804c4d3816f0e834c97596e)
[Normative: add Promise.try (#3327)](https://github.com/tc39/ecma262/pull/3327)

`Promise.try()`とはどんなAPIで、どのような辛みを解決してくれるAPIなのでしょうか？

## JavaScriptにおける同期処理と非同期処理の統一化の難しさ

`Promise.try()`を理解する前に、JavaScriptにおける同期処理と非同期処理の共存の難しさをおさらいしていきます。

例えば、 `syncOrAsync`という、同期・非同期的どちらの結果ももたらす可能性がある関数があるとします。

```js
function syncOrAsync(id) {
    if (typeof id !== "number") {
        throw new Error("id must be a number"); // 同期的なエラー
        }
    return db.getUserById(id); // 非同期的な処理
}
```

このような関数を扱おうとすると、これまでには以下のような方法が考えられました。

### 方法①: そのままsync/asyncな関数を扱おうとする

```js
// Uncaught TypeError: syncOrAsync(...).then is not a function
// Property 'then' does not exist on type '"sync"'.ts(2339)
syncOrAsync()
  .then(console.log)
    .catch(console.error);
```

単純に`then`, `catch`プロパティを使用するこの方法では、もちろん実行エラー、TypeScriptの場合はコンパイルエラーが起きてしまいます。
`syncOrAsync`が同期関数である場合、`then`プロパティが存在しないためです。

### 方法②： そのまま`Promise.resolve()`を使用する

```js
Promise.resolve(syncOrAsync())
    .then(console.log)
      .catch(console.error);
```

同期的なエラーが発生した場合、`catch`でキャッチできません。キャッチするには、さらにTry-Catchを使う必要があります。

```js

try {
    Promise.resolve(syncOrAsync())
        .then(console.log)
          .catch(console.error); // 非同期的なエラーをキャッチ
} catch (error) {
    // 同期的なエラーをキャッチ
    console.error(error);
}
```

### 方法③: `Promise.resolve().then()`内でsync/asyncな関数を扱う

<!-- 同期関数はthenableではないため、`.then()`するには、`Promise.resolve()`でPromiseを作ってから).then()で実行しなければならない -->

```ts
Promise.resolve().then(syncOrAsync)
    .then(console.log)
      .catch(console.error);
```

この方法では割と簡潔な書き方で`syncOrAsync`を扱うことができています。しかし、同期関数はthenableではないため、`then`プロパティを使用するには、Promise(`Promise.resolve().then()`)であらかじめラップしてPromiseオブジェクト化する必要があります。
これによって、`syncOrAsync`は否が応でも非同期的に実行されるため、不必要に非同期に`syncOrAsync`が実行されることになります。

### 方法④: 新しくPromiseを生成して、そのなかでsync/asyncな関数を解決する

```ts
new Promise((resolve) => resolve(syncOrAsync()))
    .then(console.log)
      .catch(console.error);
```

この方法を使用すると、同期処理の場合`new Promise((resolve) => resolve('sync value'))`のようになり、Promiseは即座に解決されるため、不必要な非同期処理は発生しません。
不必要に非同期に`syncOrAsync`が実行される問題は解消されますが、書きぶりが少々冗長です。

このように、JavaScriptにおける同期処理と非同期処理を統一的なハンドリングは、冗長な書き方をしなければならなかったり、無駄なイベントループを回すことになったりと難しい問題がありました。

## Promise.tryが解決すること

> Promise.try is like a .then, but without requiring a previous Promise.
> http://cryto.net/~joepie91/blog/2016/05/11/what-is-promise-try-and-why-does-it-matter/

Promise.tryは、Promiseが必要のない`.then`のようなものです。
`Promise.try()`は以下のようにして使用できます。

```ts
Promise.try(syncOrAsync())
 .then(console.log)
   .catch(console.error);
```

不必要な非同期処理を起こさず、同期・非同期処理を統一的に扱えるようになります。
具体的には、同期処理の場合も非同期処理の場合もどちらの処理でも同じようにデータを扱え、かつエラーも同じようにキャッチできます。
さらに、これを直感的でシンプルな構文で済ませることができていますね。

このような書き方は古くから望まれていたため、`Promise.try()`が標準化される前にも、`Promise.try()`のような機能を提供するライブラリが存在していました。
既存のライブラリはどのようにJavaScriptで`Promise.try()`を実現していたのでしょうか？

## 既存のPromise.try

### Bluebird： [Promise.try/Promise.attempt](http://bluebirdjs.com/docs/api/promise.try.html)

Promiseに関する機能を提供するライブラリのBluebirdは、`Promise.try`(`Promise.attempt`)を提供しています。
:::details Bluebirdの実装

```js
// https://github.com/petkaantonov/bluebird/blob/master/src/method.js
// http://bluebirdjs.com/docs/api/promise.try.html
Promise.attempt = Promise["try"] = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection(FUNCTION_ERROR + util.classString(fn));
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value;
    if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
                                  : tryCatch(fn).call(ctx, arg);
    } else {
        value = tryCatch(fn)();
    }
    var promiseCreated = ret._popContext();
    debug.checkForgottenReturns(
        value, promiseCreated, "Promise.try", ret);
    ret._resolveFromSyncValue(value);
    return ret;
};
```

:::

本質的に`Promise.try()`の再現に必要な部分は以下のみで、それ以外はデバッグやエラーハンドリングのための潤沢な処理も含まれています。

```js
Promise.attempt = Promise["try"] = function (fn) {
    // 新しいPromiseを生成: new Promise()部分
    var ret = new Promise(INTERNAL);
    
    // 関数の実行結果を取得
    var value = tryCatch(fn)();
    
    // Promiseとして実行結果を解決: resolve(syncOrAsync())部分. ResolveされたPromiseを返す
    ret._resolveFromSyncValue(value);
    return ret;
}
```

こうしてみると、内部的には③の「新しくPromiseを生成して、そのなかでsync/asyncな関数を解決する方法」を採用していることがわかります。

ライブラリは以下のようにして使用します。

```js
Promise.try(syncOrAsync()).then(console.log).catch(console.error);
```

### Sindre Sorhus： [`p-try`](https://github.com/sindresorhus/p-try)

BlueBirdと同様、内部的には③の「新しくPromiseを生成して、そのなかでsync/asyncな関数を解決する方法」を採用しています。

```js
// https://github.com/sindresorhus/p-try/blob/main/index.js
export default async function pTry(function_, ...arguments_) {
 return new Promise(resolve => {
  resolve(function_(...arguments_));
 });
}
```

`p-try`は以下のようにして使用します。

```js
import pTry from 'p-try';

pTry(syncOrAsync()).then(console.log).catch(console.error);
```

このように、Bluebirdや`p-try`のようなライブラリはどちらも③の「新しくPromiseを生成して、そのなかでsync/asyncな関数を解決する方法」のSyntax Sugarのような印象です。

では、JSCは`Promise.try`をどのように実装しているのでしょうか？

## Dive in to Promise.try in JSC

WebkitのJavaScriptエンジンであるJSCに実装された`Promise.try()`の実装を見てみます。

[[JSC] Implement Promise.try #24802](https://github.com/WebKit/WebKit/pull/24802)
[[promise-try] Implement and stage Promise.try](https://github.com/v8/v8/commit/dd9e9aef970a9f60d607c88e6f875d4d1cdfaca1#diff-4a6fd4b52213c38fb444e9a5dbd20d924b72714aa70c321f4524f936ede143e1R5)

JSCはC++で実装されており、JavaScriptでの実装にはC++で書かれた内部関数を呼び出すための特別な構文を使用していることがあります。

`Promise.try`も実装にJavaScriptが使用されているものの1つですが、JSC独自のシンタックスシュガーを使用して、最終的にはC++で処理できるようになっています。
<!-- 本当か？という感じなので、具体的なC++の実装にたどり着くまで追ってみます。 -->
以下はJSCにおける`Promise.try()`の実装です。

```js
function try(callback /*, ...args */)
{
    "use strict";

    if (!@isObject(this))
        @throwTypeError("|this| is not an object");

    var args = [];
    for (var i = 1; i < arguments.length; i++)
        @putByValDirect(args, i - 1, arguments[i]);

    // thisはPromiseコンストラクタ 
    var promiseCapability = @newPromiseCapability(this);
    try {
        // 指定された引数でコールバック関数を実行
        // @applyは、関数を特定の値と引数で呼び出すための内部メソッド
        var value = callback.@apply(@undefined, args);
        // Promiseを解決するためにresolve関数を呼び出す
        promiseCapability.resolve.@call(@undefined, value);
    } catch (error) {
        promiseCapability.reject.@call(@undefined, error);
    }

    return promiseCapability.promise;
}
```

例えば、Promiseがresolveされる場合は以下のような順番で処理され、リンキングの段階では直接C++で処理されることになります。

1. [@newPromiseCapability](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/JavaScriptCore/builtins/PromiseOperations.js#L87)でPromiseCapabilityを生成
2. [@resolvePromiseWithFirstResolvingFunctionCallCheck](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/JavaScriptCore/builtins/PromiseOperations.js#L245)でPromiseが一度も解決されていない場合は、resolvePromiseを呼び出す
3. [@resolvePromise](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/JavaScriptCore/builtins/PromiseOperations.js#L178)でPromiseを適切に解決
4. [@fulfillPromise](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/JavaScriptCore/builtins/PromiseOperations.js#L229)でPromiseを成功とする
5. [@triggerPromiseReactions](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/JavaScriptCore/builtins/PromiseOperations.js#L156)で`enqueueJob`を用いてコールバック関数をキューに入れて非同期的に実行
6. [@enqueueJob・Source/JavaScriptCore/runtime/JSGlobalObject.cpp](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/JavaScriptCore/runtime/JSGlobalObject.cpp#L689C1-L700C2)のように、enqueueJobはC++で実装されている
※[JSC_DEFINE_HOST_FUNCTION](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/WTF/wtf/PlatformCallingConventions.h#L55C9-L55C33)というマクロの利用により、C++で実装された処理をJSで実行できるように宣言している

Promiseに関する必要な処理は大体ここ（[WebKit/Source/JavaScriptCore/builtins/PromiseOperations.js](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/JavaScriptCore/builtins/PromiseOperations.js)）で実装されています。

では、`Promise.try()`を`Promise.resolve()`のシンタックスシュガーとして実装していたときとの差分はどうでしょうか？
`Promise.try()`を`Promise.resolve()`を用いて実装した場合、JSCでの処理の流れは以下のようになります。

このように、`Promise.try()`は`Promise.resolve()`を用いて実装できますが、`Promise.try()`としてJSCに実装されることにより、よりコンパイラレベルでの最適化がなされた状態で`Promise.try()`を使用できるようになります。

<!-- Promise.tryがどうして8年もかかったのか聞きたい -->

## 昨今のECMAScriptのPromise動向

最後に、ECMAScriptにおけるPromiseの全体像と今後の動向についてProposalを参考に見ていきましょう。

PromiseはHTML5の仕様が策定されていく中で、fetch APIやlocalStorage、IndexedDBやwebcryptoなどの非同期処理を含むAPIを扱う中で出てきました。
当時は決まった形式の非同期処理を扱うためのAPIがなかったため、Promise-likeなインターフェースやコールバック、Eventemitterなどでの非同期処理ハンドリングが混在していました。
そこで、Promise/A+によりPromise統一の動きが始まり、Promiseに関するドキュメントやテストが整備されました。

そのPromise/A+の恩恵を受けて、ES6でPromiseが標準化され、`Promise.resolve`や`Promise.reject`、`Promise.all`や`Promise.race`が追加されました。
ES2017では`async`/`await`が追加され、ES2018では`Promise.finally`で`then()`や`catch()`以降の処理のハンドリングに対応し、ES2020では`Promise.allSettled`によりXXまで対応、ES2021では`Promise.any`により最初に解決されたPromiseを返すAPIが追加されました。ES2024の`Promise.withResolvers`では、Promiseのコンストラクタをより簡潔に書くためのAPIが導入され、来年のES2025には今回撮りあげた`Promise.try`が導入されていきます。

このように進化を遂げてきたPromiseですが、今後はどのような提案がされているのでしょうか？

### [Await dictionary of Promises](https://github.com/tc39/proposal-await-dictionary)

連想配列のプロパティに対するPromiseを、プロパティ名を保持したまま並列で実行できるようになる提案です。
`Promise.all()`では配列の順序に依存した返り値ですが、この提案により、プロパティ名と返り値を紐づけることができます。

### [await operations](https://github.com/tc39/proposal-await.ops)

Promiseを意識することなく、非同期処理を行なうための提案です。
この提案では`await.all`のように書けるようにすることで、より自然な`async-await`スタイルでの並列処理を実現します。

### [Faster Promise Adoption](https://github.com/tc39/proposal-faster-promise-adoption)

## まとめ

- `Promise.try()`は、同期処理と非同期処理を統一的に扱うためのAPI
- 既存のライブラリは、`Promise.try()`を`Promise.resolve()`を用いて実装している
- JSCは`Promise.try()`をJS-wayで実装している
- Promiseの扱いづらい部分は積極的に改善されていきそう

## 参考

[@isObject](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/JavaScriptCore/runtime/JSCJSValueInlines.h#L785)
[@throwTypeError](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/WebCore/bindings/js/JSDOMExceptionHandling.cpp#L214)
[@newPromiseCapabilitySlow](https://github.com/WebKit/WebKit/blob/09a39c7410120fcf29cdb6310eabad53edaba847/Source/JavaScriptCore/builtins/PromiseOperations.js#L55)
https://github.com/tc39?q=promise&type=all&language=&sort=

https://claude.ai/chat/19f3d834-785e-427f-8353-97fa9a25d776
https://promisesaplus.com/
https://teamdev.com/molybden/docs/development/javascript-to-cpp.html
shindreさんめっちゃ未来のPromise作ってる：https://github.com/sindresorhus/promise-fun
https://zon8.re/posts/jsc-part3-the-dfg-jit-graph-building/
非同期性の処理: Promise.tryは、同期的な処理を非同期的に扱うために非常に便利です。関数がスローした例外をPromiseの拒否として扱えるため、非同期処理を一貫して行なえます。
