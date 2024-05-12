---
title: "TSKaigi2024に参加してきました"
emoji: "🎉"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ['tskaigi']
published: false
---

2024/5/11日に初開催された、TSKaigiに参加してきました。

私が聴講したセッションの軽いまとめ＆感想と、TSKaigi全体を通しての感想をまとめたいと思います。

備忘録がてらの事後記録なので、詳細は書いていません。

## 👏🏻 KeyNote

「ただセッションを聞くだけでなく、TypeScript仲間と交流することでTSコミュニティを盛り上げてほしい」といった発言のもと、TSKaigiがスタートされました。

## 👏🏻 KeyNote: What's New in TypeScript

MicrosoftのPrincipal Product Manager である @drosenwasserさんによる基調講演でした。
[Announcing TypeScript 5.5 Beta](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/)にてTypeScript5.5 Betaのアナウンスをされた方です。

Feature in TypeScript 5.4として、主に以下のトピックが取り上げられていました。

https://devblogs.microsoft.com/typescript/announcing-typescript-5-4-beta/#the-noinfer-utility-type

***

New feature in TypeScript 5.5として、主に以下のWhat's Newが述べられていました。

Type Imports in JSDoc:
https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/#type-imports-in-jsdoc

Regular Expression Syntax Checking:
https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/#regular-expression-syntax-checking

Inferred Type Predicates:
https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/#inferred-type-predicates

Isolated Declarations:
https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/#isolated-declarations

以上の項目が、ライブコーディングつきで説明されました、すごい。
フルEnglishでしたが、同時翻訳付きでの発表でした。(目悪くて自分の席からは読解不可能でしたが)

## 👏🏻 TypeScript AST を利用したコードジェネレーターの実装入門

[@himenon/openapi-typescript-code-generator](https://github.com/Himenon/openapi-typescript-code-generator)を作られている方のセッションで気になったので聴講しました。

「ASTとは」についてや、ASTがTS Compiler APIやLanguage Server Protocolに理解されてTSのType checkやエディタのコード補完や構文チェックに使用されているという身近な使用例から始まりました。

ASTに関しての詳細な説明や、AST木構造の走査アルゴリズムについての紹介があったのち、欲しいコードジェネレータを[TypeScript AST Viewer](https://ts-ast-viewer.com/)から生成されるFactoryコードを用いて実装する方法についての紹介がありました。Factoryコードが得られてしまえばunperseするだけでコードが生成できてしまう、すごい。

しかし、上記のようにASTのみを使用する方法はFactoryコードが莫大になる観点から本セッションではアンチパターンとして取り上げられている例でした。

その解決策として、StringとASTをハイブリッドに用いる方法が提示されている部分が本セッションの肝でした。

https://www.docswell.com/s/hireroo/K382Y1-tskaigi-2024-05-11-11-30

https://github.com/Himenon/tskaigi-2024-code-sample

コードジェネレータはgraphql-codegenを利用するときに触れた経験があり、仕組みを理解したいという期待でした。
結果として、graphql-codegenは文字列結合をしているという話が聞けてよかったです。
まだわかってないので復習したい

***

## スポンサーLT

### TypescriptでのContextualな構造化ロギングと社内全体への導入！（10分）

log出力のカスタマイズができるライブラリ、pino紹介されてました。
私はこれを最近知ったのでタイムリーだなと思いながら聴いてました。
datadogで出すlogが綺麗になるみたい。

***

## 👏🏻 TypeScript と型のパフォーマンス　 

エディタで編集時の型補完や定義へのジャンプ、エラー表示をするための計算を担ってくれているtsserver。このtsserverが重くなってしまう原因である、Type Instantiationの回数がなぜ増えてしまうのか、実例を交えながら解説するセッションでした。

一回のType Instantiationとは**型パラメータを埋めた型を一回作る**ことであり、この**Instantiationの回数**がパフォーマンスに影響を与えています。

今回肝となっている、**Instantiationの回数**は、Distributive Conditional Type(型の分配法則)やGeneric Constraint(型引数の制約)、Template Literal Types(テンプレートリテラル型)またはこれらの組み合わせの活用に大きく影響されます。

このように、Instantiationの回数はジェネリック型でのループや再帰から爆発的に増加し、結果としてtsserverの型生成量オーダに大きな影響を与えていることが理解できました。

セッションでは、このような計算量を必要とする型を改善する有力な方法として、オーバーロードやインタフェースを工夫して回避する方法2つが挙げられていました。

https://drive.google.com/file/d/16ibOO_a2y0AI7tv7yPWHcyV0sHlC4TZ9/view

今まで「遅いな〜」くらいで本質を理解していなかったtsserverにかかる計算量の具体的な話だけでなく、JS Profilerを用いたパフォーマンスに影響を与えている原因の特定など、非常に勉強になる内容でした。

## 👏🏻 複雑なビジネスルールに挑む：正確性と効率性を両立する fp-ts のチーム活用術

https://speakerdeck.com/kakehashi/strike-a-balance-between-correctness-and-efficiency-with-fp-ts

## 👏🏻　Step by Step で学ぶ、ADT(代数的データ型)、モナドから Effect-TS まで 

https://tskaigi.org/talks/takezoux2

***

## LT

### 👏🏻　TypeScript できると思ったのは勘違いだった件

https://tskaigi.org/talks/dai_shi

### 👏🏻　Effect で作る堅牢でスケーラブルな API ゲートウェイ

https://speakerdeck.com/yasaichi/robust-and-scalable-api-gateway-built-on-effect

### 👏🏻　Introduction to Database Connection Management Patterns in TypeScript

https://speakerdeck.com/sugarcat7/introduction-to-database-connection-management-patterns-in-typescript

### 👏🏻 Prisma でスキーマ変更を行う際のベストプラクティス

https://speakerdeck.com/ryusaka/prismadesukimabian-geng-woxing-uji-nobesutopurakuteisu

## 👏🏻 Exploring type-informed lint rules in Rust based TypeScript Linters

https://speakerdeck.com/unvalley/exploring-type-informed-lint-rules-in-rust-based-linters

***

## 👏🏻 Prettier の未来を考える

https://zenn.dev/sosukesuzuki/articles/756e04848885bd

***

## LT

### 👏🏻　Documentation tests の恩恵

https://speakerdeck.com/ssssota/documentation-testing-benefits

### 👏🏻　Full TypeScript だから実現できる世界線

https://tskaigi.org/talks/k1rof18

### 👏🏻　Real World Type Puzzle and Code Generation

https://speakerdeck.com/yukukotani/real-world-type-puzzle-and-code-generation

## 全体的な感想
各セッション、CFP読んで理解が滞らないようにしておいたり疑問点など考えておいたりしておくと良さそうだなと思っています。

誤った解釈や記述があれば教えていただけると幸いです🐣 