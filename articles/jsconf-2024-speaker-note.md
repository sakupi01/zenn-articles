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

## JavaScriptにおける同期処理と非同期処理の共存の難しさ

### 方法①: そのままsync/asyncな関数を扱おうとする

```ts
// Property 'then' does not exist on type '"sync"'.ts(2339)
syncOrAsync()
  .then(console.log)
    .catch(console.error);
```

メリット：🤔
デメリット：型エラー

### 方法②: `Promise.resolve().then()`内でsync/asyncな関数を扱う

<!-- 同期関数はthenableではないため、`.then()`するには、Promise(`Promise.resolve().then()`)でラップしなければならない -->

```ts
Promise.resolve().then(syncOrAsync)
    .then(console.log)
      .catch(console.error);
```

メリット：簡潔
デメリット：不必要に非同期にsyncOrAsyncが実行される（同期関数だった場合も非同期的に実行される）

### 方法③: 新しくPromiseを生成して、その中でsync/asyncな関数を解決する

```ts
new Promise((resolve) => resolve(syncOrAsync()))
    .then(console.log)
      .catch(console.error);
```

メリット：不必要に非同期にsyncOrAsyncが実行される問題は解消
デメリット：書きぶりが冗長

## Promise.tryが解決すること

```ts
// 不必要に非同期実行をしない
// 簡潔に書ける！！
Promise.try(syncOrAsync)
 .then(console.log)
   .catch(console.error);
```

## 既存のPromise.try

## JSCに実装されたPromise.try

## 昨今のECMAScriptのPromise動向
