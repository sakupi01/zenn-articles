---
title: "TSKaigi2024参加レポート"
emoji: "🎉"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ['typescript','tskaigi']
published: true
---

2024/5/11日に初開催された、TSKaigiに参加してきました。

私が聴講したセッションの軽いまとめ＆感想と、TSKaigi全体を通しての感想のまとめです。

備忘録がてらの事後記録のため、詳細は書いていません💦
(あと、LTセッションに関しても自分が聞いたものは残していますが、感想は含めていません。あしからずです🙇🏻‍♀️)

## 👏🏻 KeyNote

「ただセッションを聞くだけでなく、TypeScript仲間と交流することでTSコミュニティを盛り上げてほしい」といったオープニングのもと、TSKaigi2024がスタートされました👏🏻

## 👏🏻 KeyNote: What's New in TypeScript

MicrosoftのPrincipal Product Manager である @drosenwasserさんによる基調講演でした。
[Announcing TypeScript 5.5 Beta](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/)にてTypeScript5.5 Betaのアナウンスをされた方です。


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

その解決策として、StringとASTをハイブリッドに用いる方法が提示されている部分が本セッションの肝だったかなと思います。

https://www.docswell.com/s/hireroo/K382Y1-tskaigi-2024-05-11-11-30

https://github.com/Himenon/tskaigi-2024-code-sample

***

## スポンサーLT

- 👏🏻 TypescriptでのContextualな構造化ロギングと社内全体への導入！（10分）

log出力をみやすくカスタマイズができるライブラリ、pino紹介されてました。
私はこれを最近知ったのでタイムリーだなと思いながら聴いてました。

***

## 👏🏻 TypeScript と型のパフォーマンス　 

エディタで編集時の型補完や定義へのジャンプ、エラー表示をするための計算を担ってくれているtsserver。このtsserverが重くなってしまう原因である、Type Instantiationの回数がなぜ増えてしまうのか、実例を交えながらBig Oを用いて解説するセッションでした。

一回のType Instantiationとは**型パラメータを埋めた型を一回作る**ことであり、この**Instantiationの回数**がパフォーマンスに影響を与えています。

今回肝となっている、**Instantiationの回数**は、Distributive Conditional Type(型の分配法則)やGeneric Constraint(型引数の制約)、Template Literal Types(テンプレートリテラル型)またはこれらの組み合わせの活用に大きく影響されます。

このように、Instantiationの回数はジェネリック型でのループや再帰から爆発的に増加し、結果としてtsserverの計算量に大きな影響を与えていることが理解できました。

セッションでは、このような計算量を必要とする型を改善する有力な方法として、オーバーロードやインタフェースを工夫して回避する方法2つが挙げられていました。

https://drive.google.com/file/d/16ibOO_a2y0AI7tv7yPWHcyV0sHlC4TZ9/view

今まで「遅いな〜」くらいで本質を理解していなかったtsserverにかかる具体的な計算量の話だけでなく、JS Profilerを用いたパフォーマンスに影響を与えている原因の特定など、非常に勉強になる内容でした。

## 👏🏻 複雑なビジネスルールに挑む：正確性と効率性を両立する fp-ts のチーム活用術

まず、Excelに代表される表形式データのエラー検証を正確かつ効率的に行う際、エラーをまとめてスローしたいという要望がありました。
現状だと、エラーが発生した時点で処理が終了してしまい、まとまったエラー情報をユーザにフィードバックできない問題点がありました。

そこで、`fp-ts`を用いて自前実装のEither型を合成して、最終的にはフィードバックできる形式のEither型をえられるという知見が発表されていました。

また、表形式データにおけるシート同士が(テーブル同士が)、検証済みの行のみを参照できるよう、公渉型を使用して型推論の前に関門を設け、「この関数の検査を通過しないとxx型に変換不可能」という型変換機構の実装の紹介もありました。

https://speakerdeck.com/kakehashi/strike-a-balance-between-correctness-and-efficiency-with-fp-ts

セッションの中では、効率の良い合成の仕方として`pipe()`の使用や、関数型パラダイムを採用する`fp-ts`をオンボーディングコストを少なくチームに浸透させるための工夫なども紹介されていました。
バックエンドでTypeScriptを使用する際に便利そうだなと思いつつも、自分にとって新しく得るものが多かったです。

## 👏🏻　Step by Step で学ぶ、ADT(代数的データ型)、モナドから Effect-TS まで 
こちらも関数型のパラダイムを実現するためのライブラリの紹介で、Effectというライブラリが採用されていました。

`fp-ts`の`pipe()`を使用すると「Promiseはどう表現するの？」ということになり、Effectの`Task<T>`や`TaskEiher<L, R>`を使用することでPromiseをを扱えるようにした！という事例が紹介されていました。


https://tskaigi.org/talks/takezoux2

登壇者の方もおっしゃっていた気がするのですが、ADT（代数的データ型）を用いると、ロジックまで型で表現できてバグが減るし、データフローを定義するので宣言的なコードになって可読性がよくなる印象を受けました。

***

## LT

- 👏🏻　TypeScript できると思ったのは勘違いだった件

https://tskaigi.org/talks/dai_shi

- 👏🏻　Effect で作る堅牢でスケーラブルな API ゲートウェイ

https://speakerdeck.com/yasaichi/robust-and-scalable-api-gateway-built-on-effect

- 👏🏻　Introduction to Database Connection Management Patterns in TypeScript

https://speakerdeck.com/sugarcat7/introduction-to-database-connection-management-patterns-in-typescript

- 👏🏻 Prisma でスキーマ変更を行う際のベストプラクティス

https://speakerdeck.com/ryusaka/prismadesukimabian-geng-woxing-uji-nobesutopurakuteisu

***

## 👏🏻 Exploring type-informed lint rules in Rust based TypeScript Linters

Biomeのメンテナの方から、TypeScriptの型情報を用いたLintルールの実装をする上で、RustベースのType　Checkerが必要だけど難しいことに対する解決方法の提示でした。

現在、`typescript-eslint`においてはTypeScriptの型情報を用いたLintルールが実装されていますが、Biomeなどに含まれるRustベースのLinterではTypeScriptの型情報を扱うことができません。

セッションではその問題点として、パフォーマンスと実装コストによる難しさがあると述べられていました。

その解決策として、TypeScript Compilerの利用、Alternative TypeScript Compiler（(stc), eznoなど）の利用、Type Inferrence(サブセット)の実装が紹介されていました。

Type Inferrence(サブセット)の実装に関しては、型推論を必要としないTSファイルを得られるようになる、`--isolatedDeclarations`との相性が良さそうということも述べられていました。(`--isolatedDeclarations`に関してはKeynoteでTypeScript5.5のリリース内容として触れられていました)

https://speakerdeck.com/unvalley/exploring-type-informed-lint-rules-in-rust-based-linters


Rust製のLinterにおける、TypeScriptの型情報使ったLintを実現したい話が順序よく話されてて理解しやすかったです。

Biomeだけでなく、他のOSS(oxcやDeno)がどんな対応を考えているのかにも触れられていて、その点も良かったです。

## 👏🏻 Prettier の未来を考える

内容のまとめをするまでもなく、こちらのスピーカーノートで全てを説明してくださっています。

https://zenn.dev/sosukesuzuki/articles/756e04848885bd

７ページの(しかもほとんど画像)スライドで30分喋れて、しかもちゃんと面白い......さすがです、な発表でした。

PrettierがJS製なことによって、強力なJavaScriptのエコシステムを利用でき、現状Biomeでは難しいスピード感で多言語のサポートを継続できること、「なるほど」と思えました。

競合が登場したことにより、Prettier側もどんどん良くなろうとしていて、OSSって、開発の世界って、こうやって良くなっていくんだなと思いました(こなみ)。
***

## LT
- 👏🏻　Documentation tests の恩恵

https://speakerdeck.com/ssssota/documentation-testing-benefits

- 👏🏻　Full TypeScript だから実現できる世界線

https://tskaigi.org/talks/k1rof18

- 👏🏻　Real World Type Puzzle and Code Generation

https://speakerdeck.com/yukukotani/real-world-type-puzzle-and-code-generation

## 全体的な感想

このような大きなカンファレンスに参加すること自体、自分にとっての初めての経験でワクワクドキドキしながらの参加でした☀️

会場に着いて、たくさんのスポンサーブースで多くの人が盛り上がっていたり、参加者一人一人にグッズの用意があったり、休憩スペースではネルドリップのコーヒーや焼き菓子が用意されていたりと、趣向を凝らした会場構成で終始暇になることがなかったです☕

最初のKeynoteで15分くらい後ろにずれ込むところからスタートしましたが、特に何の滞りもなくスムーズな運営がなされており、その辺りもさすがだなと思いました。

ランチタイムにもLTが用意されており、ずっとトークのハシゴができる状態で、いい意味で最後には脳みそがパンクしていました。

個人的な反省点としては、各セッション、もっと詳しくCFP読み込む理解が滞らないようにしておいたり、疑問点など考えておいたりしておくとより良さそうだなと思いました。次に活かしたいです🏋🏻

最後に、膨大な準備時間を割いて、素晴らしいセッションやLTをしてくださった登壇者の方々、場を設けてくださった運営の方々、新卒としての参加を実現してくださった方々、とても貴重な経験をありがとうございました！！

※ 誤った解釈や記述があれば教えていただけると幸いです🐣 