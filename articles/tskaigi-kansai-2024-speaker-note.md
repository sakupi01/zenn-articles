---
title: "TypeScriptの名前空間を活用したUIコンポーネントの設計と型安全性の追求"
emoji: "📝"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["typescript"]
published: false
---

:::message
これは [TSKaigi Kansai](https://kansai.tskaigi.org/) 2024 での登壇内容のスピーカーノートです。
:::

<!-- トークのページを入れる -->

## はじめに

みなさんはTypeScriptのnamespaceを使ったことがありますか？
おそらく`.d.ts`で型定義を書くときに使うことが多いかもしれませんが、実際に自ら意図してnamespaceを活用したことがある人は少ないのではないでしょうか。
今回はそんなやや過小評価されがちなTypeScriptのnamespaceを理解し、使いどころを再考していきたいと思います。

### TypeScriptの値と型のモジュール化

みなさんもご存知の通り、TypeScriptは平たく言えばJavaScriptに型をつけた言語です。

そしてまたご存知の通り、TypeScriptにおいて、型はトランスパイル時に削除されJavaScriptのコードには残りません。しかし、`const`や`enum`、`class`などはトランスパイル後も残ります。

このように、ランタイムに影響しない要素とする要素を、「型」と「値」として区別します。

- 「型」：トランスパイル時に削除されて「ランタイムに影響しない要素」
- 「値」：JavaScriptのコードに残って「ランタイムに影響する要素」

昨今の多くのプログラミング言語では、モジュールを用いて論理構造を適切に整理する技術用いられており、JavaScriptにおいてもECMAScript Modules（ESM）が広く使われるようになりました。
一方で、TypeScriptでは「型」と「値」のモジュール化方法が異なるために、うまく実践できていないことがあります。

例えば、みなさんはTSXでUIコンポーネントを実装する際、どのようにコンポーネントを書いていますか？
多くの人は以下のようにコンポーネントを定義していると思いますし、私のチームでもこのような書き方でコンポーネントを定義しています。

```tsx:components/button.tsx
export type ButtonProps = { ... };

export function Button(props: ButtonProps) { ... }
```

こうした書き方をすることで、このようにButtonコンポーネントとそのPropsの型をインポートして以下のように使うことができます。

```tsx:components/navigation-button.tsx
import { Button, type ButtonProps } from "./button";

export type NavigationButtonProps = ButtonProps & { ... };

export function NavigationButton(props: NavigationButtonProps) { ... }
```

```tsx:components/enhanced-navigation-button.tsx
import { Button, type ButtonProps } from "./button";

export type EnhancedNavigationButtonProps = ButtonProps & { ... };

export function EnhancedNavigationButton(props: EnhancedNavigationButtonProps) { ... }
```

ESMでネイティブにモジュールシステムを利用しているので、このように１ファイル１モジュールの中にPropsとコンポーネントを定義することが一般的です。

しかし、このようなノリでProps定義していくと、Props名がやたら冗長になってしまうことはよくあることだと思います。

こうした事態になる背景として以下が考えられます。

1. 命名によってデータの性質・構造を表現したい
   1. 例えば、`EnhancedNavigationButtonProps`という名前はEnhancedなNavigationのButtonコンポーネントのPropsであることを表現している
2. 型が値に関するものであることを表現したい
   1. 1と関連するが、`ButtonProps`という名前はButtonコンポーネントのPropsであることを表現している
3. 1, 2を名前の衝突を防ぎつつ行いたい

このように、名前の衝突を避けつつ、コンポーネントとの関連を示すPropsを定義するために、コンポーネント名を冠したProps名をつけることが多いです。

しかし、こうした命名による解決策には限界があります。
関連するデータが肥大化していったり、多くの子コンポーネントを包含した親コンポーネントになるにつれ命名が複雑化していったりします。
さらに、Propsの型を変更するのに合わせてコンポーネント名を変更する必要が出てくるなど、保守性の面でも問題が生じてくることは容易に想像し得ます。

こうした背景事情を踏まえると、命名の工夫以外で、データの構造を表現しつつ、コンポーネントという「値」とそのPropsである「型」をセットで管理する方法が必要になってきます。

### 1. 型をモジュール化してネストされたデータ構造を表現する

値においては、オブジェクトを使用したり、IIFE（即時実行関数式）を利用してスコープ制限を行ったりすることで、モジュール化を行うことができます。また、[バレルファイル](https://typescript-jp.gitbook.io/deep-dive/main-1/barrel)を利用して複数のモジュールから1つの便利なモジュールにエクスポートをロールアップして整理したりする方法もあります。

しかし、型のモジュール化はこのような方法では達成できず、TypeScriptで型をモジュール化する方法は、現時点では２通りの方法のみしかありません。

1. ESMの`import as`
2. TSの`namespace`

まず、ESM構文を使った方法を見ていきます。

```tsx
/**
 * modules/types.ts
 */
export type LowerCase = 'a' | 'b' | 'c';

/**
 * modules/re-export.ts
 */
export * as Hoge from './modules/types';

/**
 * example.ts
 */
import * as Sample from './modules/re-export';

const text: Sample.Hoge.LowerCase = 'a';
```

`import as`・`export as`を用いると、コンポーネントとそのPropsの型をひとつの変数にまとめてインポート・エクスポートすることができます。
ECMAScript仕様では`import as`・`export as`によって作られる変数をモジュール名前空間オブジェクト (module namespace object) と呼びます。

これでも実現できるのですが、`import as`で利用側で自由に名前をつけて import できてしまうことから一貫性が損なわれてしまうおそれがあります。

さらに、`Sample.Hoge.LowerCase` のようなネストされた型オブジェクトとして型を扱いたい場合、ESM形式では上記のようにre-exportを重ねる必要があり、単にデータ構造を表現するためだけにそこまでファイル分割をしたくないです。

ここで、TSのnamespace構文を用いてnamespaceを作成することで同一ファイル内で型をモジュール化することができます。

```tsx
/**
 * modules/sample.ts
 */
export namespace Sample {
    namespace Hoge {
        export type LowerCase = 'a' | 'b' | 'c';
    }
}

/**
 * example.ts
 */
import { Sample } from './modules/sample';

const text: Sample.Hoge.LowerCase = 'a';
```

### 2. 値と型をセットで管理する

TypeScriptの利点の一つとして、値と型を別のものとして扱うことができるという点があります。

例えば、これによって、もともとはJavaScriptで記述されたライブラリに後から型定義を追加することができるようになっています。
[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)はその良い例です。

逆を言うと、値と型は別のものとして扱われるので、先ほどのコンポーネントのように値と型の関連を保ちたい場合は、意識的に保守していく必要があります。

この問題を回避するために、`class`を用いて値と型をセットで扱う方法もありますが、
TypeScriptの[コンパニオンオブジェクトパターン](https://typescriptbook.jp/tips/companion-object)を用いると、もっと手軽に値と型をセットで扱うことができます。

以下のように、値と型を同名で定義することで値と型を一体化できます。

```tsx:components/button.tsx
export type Button = { ... };

export function Button(props: Button) { ... }
```

```tsx:components/better-button.tsx
import { Button } from "./button";

// Button型として
export type Props = Button & { ... };

export function BetterButton(props: Props) { 
  // Buttonコンポーネントとして
  return <Button {...props} className={{ ... }} />;
 }
```

<!-- コンパニオンオブジェクトパターンは、上記のようなtypeとfunctionの組み合わせのみならず、以下のような組み合わせでも利用することができます。

- type + function
- const + type
- class + namespace
- type + namespace
- const + type + namespace -->

### 3. 型のモジュール化+値と型の一体化でUIコンポーネントを設計する

これまでに、以下の２つの方法を紹介しました。

1. namespaceを用いてデータ型の構造をモジュールで表現する
2. コンパニオンオブジェクトパターンで値と型をセットで管理する

これらの方法を組み合わせることで、データ型の構造をモジュールで表現しつつ、値と型を一体化して管理することができます。

まず、ButtonのProps、`Button.Props`という表現をしたいので、namespaceを用いてProps型をモジュール化します。

さらに、namespaceとコンポーネントをセットで管理するために、コンパニオンオブジェクトパターンを用いて、namespaceとコンポーネントを同名で定義します。

```tsx:components/button.tsx
export namespace Button {
  export type Props = { ... };
}

export function Button(props: Button.Props) { ... }
```

そうすると、以下のように、`Button.Props`として型の構造を表現しつつ、ButtonコンポーネントとそのPropsの型をセットで管理することができます。

```tsx:components/better-button.tsx
import { Button } from "./button";

export namespace BetterButton {
  export type Props = Button.Props & { ... };
}

export function BetterButton(props: BetterButton.Props) { 
  return <Button {...props} className={{ ... }} />;
 }
```

さらに、namespace内には他の型定義をすることもできるため、コンポーネントに関連する型定義を一箇所にまとめることができます。

```tsx:components/button.tsx
export namespace Button {
  export type Variant = "solid" | "ghost" | "outline";
  export type Size = "xs" |  "sm" | "md" | "lg" | "xl";
  export type Props = {
    variant: Variant;
    size: Size;
  }
}

export function Button(props: Button.Props) { ... }
```

## まとめ

TypeScriptのnamespaceを活用することで、データ型の構造をモジュールで表現しつつ、値と型を一体化して管理することができます。

これにより、コンポーネントに関連する型定義や関数を一箇所にまとめることができるため、コンポーネントの保守性を向上させることができます。

また、namespaceを用いることで、コンポーネントとそのPropsの型を一体化して管理することができるため、コンポーネントのPropsの型を変更する際にコンポーネント名を変更する必要がなくなり、コンポーネントの保守性を向上させることができます。

TypeScriptのnamespaceは使用箇所がどうしても限られそうな機能ですが、UIコンポーネントの設計においては一定の有用性があるかもしれません。
