---
title: "TypeScriptの名前空間を活用したUIコンポーネントライブラリの設計と型安全性の追求"
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

そしてご存知の通り、TypeScriptにおいて、型はトランスパイル時に削除されJavaScriptのコードには残りません。しかし、`const`や`enum`、`class`などはトランスパイル後も残ります。
今回は「型」を「ランタイムに影響しない要素」として、`const`や`enum`、`class`などのような「値」を「ランタイムに影響する要素」としてお話します。

早速ですが、みなさんはJSXやTSXを用いてUIコンポーネントを実装する際、どのようにコンポーネントを書いていますか？
EcmaScript Modulesが広く使われるようになった今、多くの人は以下のようにコンポーネントを定義していると思いますし、実際私のチームでもこのような書き方でコンポーネントを定義しています。

```tsx:components/button.tsx
export type ButtonProps = { ... };

export function Button(props: ButtonProps) { ... }
```

こうした書き方をすることで、このようにButtonコンポーネントとそのPropsの型をインポートして以下のように使うことができます。

```tsx:components/better-button.tsx
import { Button, type ButtonProps } from "./button";

export type FormButtonProps = ButtonProps & { ... };

export function FormButton(props: FormButtonProps) { ... }
```

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

ESMでネイティブにモジュールシステムを利用しているので、このように１ファイル１モジュールとしてコンポーネントを定義することが一般的です。

しかし、このようなノリでコンポーネントやデータ型を定義していくと、やたら冗長な型名になってしまうことはよくあることだと思います。

こうした事態になる背景として以下が考えられます。

1. 命名によってデータの性質・構造を表現したい
   1. 例えば、`EnhancedNavigationButtonProps`という名前はEnhancedなNavigationのButtonコンポーネントのPropsであることを表現している
2. 型が値に関するものであることを表現したい
   1. 1と関連するが、`ButtonProps`という名前はButtonコンポーネントのPropsであることを表現している
3. Globalで名前の衝突を避けたい
   1. 例えば、`ButtonProps`という名前は他のコンポーネントのPropsと名前が衝突しないようにするためにつけている
   2. ❓./component/button.tsx と ./component/button2.tsx で同じ名前のPropsを定義して、それぞれ別々のコンポーネントでのみしか使用していない場合、名前はGlobalで衝突するのか？

このように、名前の衝突を避けたりコンポーネントとの関係性を示したりするためにコンポーネント名を冠した名前をつけることが多いです。

しかし、こうした命名による解決策には限界があり、関連するデータが肥大化していくにつれ命名が複雑化していったり、コンポーネントのPropsの型を変更する際にコンポーネント名を変更する必要が出てくるなど、保守性の面でも問題が生じてくることは容易に想像し得ます。

こうした背景事情を踏まえると、命名の工夫以外で、データの構造を表現しつつ、コンポーネントという「値」とそのPropsである「型」を一体化して管理する方法が必要になってきます。

### 1. 型をモジュール化してネストされたデータ構造を表現する

値においては、オブジェクトを使用したり、IIFE（即時実行関数式）を利用してスコープ制限を行ったりすることで、モジュールかを行うことができます。また、バレルファイルを利用して複数のモジュールから1つの便利なモジュールにエクスポートをロールアップして整理したりする方法もあります。

しかし、型のモジュール化はこのような方法では達成できず、TypeScriptで型をモジュール化する方法は、現時点では２通りの方法のみしかありません。

1. ESMの`import as`
2. TSの`namespace`

まず、ESMの`import as`を使った方法を見ていきます。

```tsx
// components/navigation/index.tsx
// Buttonコンポーネントの定義
export type Props = { ... };
export function Button(props: Props) { ... }

// components/navigation/index.tsx
// Navigationコンポーネントの定義
import * as Button from './button';
export * as Button from './button'; // Navigation.Button.Propsとするためにre-export

export type Props = Button.Props & { ... };
export function Navigation(props: Props) { ... }

// components/enhanced-navigation/index.tsx
// EnhancedNavigationコンポーネントの定義
import * as Navigation from './navigation';

export type Props = Navigation.Button.Props & { ... };
export function EnhancedNavigation(props: Props) { ... }
```

`import as`・`export as`を用いると、コンポーネントとそのPropsの型をひとつの変数にまとめてインポート・エクスポートすることができます。
ECMAScript仕様では`import as`・`export as`によって作られる変数をモジュール名前空間オブジェクト (module namespace object) と呼びます。

これでも実現できるのですが、`import as`では利用側で自由に名前をつけて import できてしまうことから一貫性が損なわれてしまうおそれがあります。

さらに、`Navigation.Button.Props` のようなネストされた型オブジェクトとして型を扱いたい場合、ESM形式ではre-exportを重ねる必要があります。
ESMの仕様的にはおかしくないのですが、単にデータ構造を表現するためだけにそこまでファイル分割をしたくない場合には namespace を活用することが有効です。

```tsx
// components/navigation/button/index.tsx
// Buttonコンポーネントの定義
export namespace ButtonProps {
   export type Props = { ... };
}
export function Button(props: Props) { ... }

// components/navigation/index.tsx
// Navigationコンポーネントの定義
import { ButtonProps, Button} from './button';

export namespace NavigationProps {
  export type Button = ButtonProps.Props;
  export type Props = Button.Props & { ... };
}
export function Navigation(props: NavigationProps.Props) { ... }

// components/enhanced-navigation/index.tsx
// EnhancedNavigationコンポーネントの定義
import {NavigationProps, Navigation} from './navigation';

export namespace EnhancedNavigationProps {
  export type Props = NavigationProps.Button.Props & { ... };
}
export function EnhancedNavigation(props: EnhancedNavigationProps.Props) { ... }
```

### 2. 値と型を一体化して管理する

TypeScriptの利点の一つとして、値と型を別のものとして扱うことができるという点があります。

例えば、これによって、もともとはJavaScriptで記述されたライブラリに後から型定義を追加することができるようになっています。
DefinitelyTypedはその良い例です。

逆を言うと、値と型は別のものとして扱われるので、意識的に保守していかない限りは値と型の整合性が取れなくなるともいえます。

この問題を回避するために、`class`を用いて値と型をセットで扱う方法もありますが、
コンパニオンオブジェクトパターンを用いると、もっと手軽に値と型をセットで扱うことができます。

このように、値と型を同名で定義することで値と型を一体化できます。

```tsx:components/button.tsx
export type Button = { ... };

export function Button(props: Button) { ... }
```

```tsx:components/better-button.tsx
import { Button } from "./button";

export type Props = Button & { ... };

export function BetterButton(props: Props) { ... }
```

コンパニオンオブジェクトパターンは、上記のようなtypeとfunctionの組み合わせのみならず、以下のような組み合わせでも利用することができます。

- type + function
- const + type
- class + namespace
- type + namespace
- const + type + namespace

### 3. 型のモジュール化+値と型の一体化でUIコンポーネントを設計する

1. namespaceを用いてデータ型の構造をモジュールで表現する方法
2. コンパニオンオブジェクトパターンで値と型を一体化して管理する方法

する方法を見ていきました。これらの方法を組み合わせることで、データ型の構造をモジュールで表現しつつ、値と型を一体化して管理することができます。

```tsx:components/button.tsx
export namespace Button {
  export type Props = { ... };
}

export function Button(props: Button.Props) { ... }
```

```tsx:components/better-button.tsx
import { Button } from "./button";

export namespace BetterButton {
  export type Props = Button.Props & { ... };
}

export function BetterButton(props: BetterButton.Props) { ... }
```

さらに、namespace内には他の型定義や関数を定義することもできるため、コンポーネントに関連する型定義や関数を一箇所にまとめることができます。

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

### ネストした型Objectを実現したいとき

全てのファイルを一モジュールとして扱うESModules形式でこれを再現しようとすると、ネストの代わりにre-exportを重ねる必要があり、そこまでファイルを分割管理したくない場合にはnamespaceを活用することになります。

使用できそうな箇所は少ないですが、UIコンポーネントの設計においては一定の有用性があると考えられます。
