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

`Promise.try()`のみならず、近年、JavaScriptのPromiseをシンプルに扱う方法が提案されています。

- `Promise.any()`
- `Promise.allSettled()`
- `Promise.resolveAll()`

まず、そのなかでも、`Promise.try()`がどのような辛みを解決してくれるのか見てみましょう。

## JavaScriptにおける同期処理と非同期処理の共存の難しさ

`Promise.try()`を理解する前に、JavaScriptにおける同期処理と非同期処理の共存の難しさをおさらいしていきます。

例えば、 `syncOrAsync`という、同期・非同期的な返り値の両方を返す可能性がある関数があるとします。
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
<!-- JSならエラー起きないのか？ -->

### 方法②: `Promise.resolve().then()`内でsync/asyncな関数を扱う

<!-- 同期関数はthenableではないため、`.then()`するには、Promise(`Promise.resolve().then()`)でラップしなければならない -->

```ts
Promise.resolve().then(syncOrAsync)
    .then(console.log)
      .catch(console.error);
```

この方法では割と簡潔な書き方で`syncOrAsync`を扱うことができています。しかし、同期関数はthenableではないため、`then`プロパティを使用するには、Promise(`Promise.resolve().then()`)であらかじめラップしてPromiseオブジェクト化する必要があります。
これによって、`syncOrAsync`は否が応でも非同期的に実行されるため、不必要に非同期に`syncOrAsync`が実行されることになります。

### 方法③: 新しくPromiseを生成して、そのなかでsync/asyncな関数を解決する

```ts
new Promise((resolve) => resolve(syncOrAsync()))
    .then(console.log)
      .catch(console.error);
```

この方法を使用すると、同期処理の場合`new Promise((resolve) => resolve('sync value'))`のようになり、Promiseは即座に解決されるため、不必要な非同期処理は発生しません。
不必要に非同期に`syncOrAsync`が実行される問題は解消されますが、書きぶりが少々冗長です。

[es6-promise-try](https://git.cryto.net/joepie91/node-es6-promise-try/src/branch/master/src/index.js) はこのやり方。

<!-- 
```js
Promise.resolve(syncOrAsync())
    .then(console.log)
      .catch(console.error);
```
-->

<!-- だと、同期的なエラーが発生した場合、`catch`でキャッチできない。キャッチするには、さらにTry-Catchを使う必要がある。 -->

## Promise.tryが解決すること

Promise.try is like a .then, but without requiring a previous Promise.

```ts
// 不必要に非同期実行をしない
// 簡潔に書ける！！
Promise.try(syncOrAsync())
 .then(console.log)
   .catch(console.error);
```

不必要な非同期処理を起こさず、同期・非同期処理を統一的に扱える。
具体的には、同期処理の場合も非同期処理の場合もどちらの処理でも同じようにデータを扱え、かつエラーも同じようにキャッチできます。
さらに、これをシンプルな構文で済ませることができます。

このような書き方は古くから望まれていたため、`Promise.try()`が標準化される前にも、`Promise.try()`のような機能を提供するライブラリは存在していました。
実際にブラウザのJavaScriptエンジンに実装されている`Promise.try()`の仕組みを見る前に、既存のライブラリがどのように`Promise.try()`を実装しているか見てみましょう。

## 既存のPromise.try

### Bluebird [Promise.try/Promise.attempt](http://bluebirdjs.com/docs/api/promise.try.html)

<!-- demoしてもいいかも -->

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

以下のようにして使用できる。

```js
function getUserById(id) {
    return Promise.try(function() {
        if (typeof id !== "number") {
            throw new Error("id must be a number");
        }
        return db.getUserById(id);
    });
}
```

### [`p-try`](https://github.com/sindresorhus/p-try) by Sindre Sorhus

内部的には③の「新しくPromiseを生成して、そのなかでsync/asyncな関数を解決する方法」を採用している。
③の方法は書き方が冗長だったというだけで、`Promise.try()`の実現したいことはできていたので、冗長な書き方部分を`pTry`として提供しているだけです。

```js
// https://github.com/sindresorhus/p-try/blob/main/index.js
export default async function pTry(function_, ...arguments_) {
 return new Promise(resolve => {
  resolve(function_(...arguments_));
 });
}
```

以下のようにして使用できる。

```js
import pTry from 'p-try';

try {
 const value = await pTry(() => {
  return synchronousFunctionThatMightThrow();
 });
 console.log(value);
} catch (error) {
 console.error(error);
}

pTry(() => {
  return synchronousFunctionThatMightThrow();
 }).then(value => {
  console.log(value);
 }).catch(error => {
  console.error(error);
 });
```

## JSCに実装されたPromise.try

[[JSC] Implement Promise.try #24802](https://github.com/WebKit/WebKit/pull/24802)

```js
function try(callback /*, ...args */)
{
    "use strict";

    if (!@isObject(this))
        @throwTypeError("|this| is not an object");

    var args = [];
    for (var i = 1; i < arguments.length; i++)
        @putByValDirect(args, i - 1, arguments[i]);

    var promiseCapability = @newPromiseCapability(this);
    try {
        var value = callback.@apply(@undefined, args);
        promiseCapability.resolve.@call(@undefined, value);
    } catch (error) {
        promiseCapability.reject.@call(@undefined, error);
    }

    return promiseCapability.promise;
}
```

## 昨今のECMAScriptのPromise動向

An open standard for sound, interoperable JavaScript promises—by implementers, for implementers.

https://claude.ai/chat/19f3d834-785e-427f-8353-97fa9a25d776
https://promisesaplus.com/
shindreさんめっちゃ未来のPromise作ってる：https://github.com/sindresorhus/promise-fun
非同期性の処理: Promise.tryは、同期的な処理を非同期的に扱うために非常に便利です。関数がスローした例外をPromiseの拒否として扱えるため、非同期処理を一貫して行なえます。
