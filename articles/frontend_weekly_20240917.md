---
title: "Rolldown + oxcによるビルド＆型生成の高速化など: Cybozu Frontend Weekly (2024-09-17号)" # 目立ったニュースを選ぶ
emoji: "🎑" # お好きな絵文字を
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["CybozuFrontendWeekly", "frontend"]
published: true
publication_name: "cybozu_frontend"
published_at: 2024-09-19 18:00 # 未来の日時を指定する
---

こんにちは！サイボウズ株式会社フロントエンドエンジニアの[saku (@sakupi01)](https://x.com/sakupi01)です。

# はじめに

サイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。

今回は、2024/09/17のFrontend Weeklyで取り上げた記事や話題を紹介します。

# 取り上げた記事・話題

## 2024 WebKit Contributors Meeting

https://webkit.org/meeting/

WebKit Contributors Meeting 2024 の情報が公開されていました。
WebKit Contributor であれば参加できるようです。クパチーノで行われ、オンライン参加も可能とのことです。

## Rolldown + oxcによるビルド＆型生成の高速化

次世代のRust製JSバンドラであるRolldownとJSツールであるoxcを用いたVueのビルド＆型生成タイムの計測結果がEvan Youによって公開されていました。

https://x.com/youyuxi/status/1833492071862440070

投稿では、Rolldown + oxc + SWC を用いると、現状よりおよそ85倍高速になったと述べられています。

社内では、将来的にRolldownがViteに組み込まれることによる高速化が期待できそうという意見や、CSS in JSを採用しているためoxcによる高速化の恩恵を受けるためには専用のoxcプラグインが必要そうという議論もありました。

https://rolldown.rs/

https://oxc.rs/

## Biome v1.9 Anniversary Release

https://biomejs.dev/blog/biome-v1-9/

Biome 1.9がリリースされました。大きな変更としてはCSSのFormatter・Linterの安定版がリリースされ、GraphQLのFormatter・Linterのサポートも追加されました。
加えて、`.edtiorconfig`のサポートや`biome search`コマンドの追加も行われています。

CSSのLintに関しては、stylelintと互換性のあるルールが15個ほど採用されてはいるものの、現時点で完全な互換はされていないため、今後のルール拡充が期待されます。

`biome search`は、構文木レベルで検索ができる新たなCLIになっています。似たツールとして[AST grep](https://github.com/ast-grep/ast-grep)などが挙げられます。

リリースブログでは、Biome 2.0のリリースも示唆されていました。
今後どういった機能出すかなどもIssueで管理されており、誰でも見ることができます。
https://github.com/biomejs/biome/issues/3727

## What's missing from HTML and CSS? | Blog | Chrome for Developers

https://developer.chrome.com/blog/missing-from-css?hl=en

HTML / CSS に足らないもののアンケートがChromeチームでとられ、Top 10 が公開されていました。

- Support for styling inputs
- Visually hidden
- position: sticky inside overflow:hidden
- Animate to height: auto
- Additional input types
- Real random numbers in CSS
- Mixin style classes
- Global styles in shadow DOM
- Dividing mixed units
- nth-letter

賛成かどうかのアンケートフォームもあり、誰でも回答できるようになっています。

https://docs.google.com/forms/d/e/1FAIpQLSdOjK-b1UWv3SJCskuubZdlkLpup9ENgpLx3k69sTts7jYrQw/viewform

## Chrome ends support for First Input Delay

https://web.dev/blog/fid?hl=en

Core Web Vitals（CWV）の指標の一つである、First Input Delay (FID) のサポートがChromeで終了することが発表されました。
今年の5月にFID は Interaction to Next Paint (INP)に正式に置き換えられましたが、今回の発表を持って FID は完全に廃止され、Chromeツールでのサポートは今後されないとのことです。

## EmotionからCSS Modulesへの移行！React Server ComponentsのCSS対応

https://tech.findy.co.jp/entry/2024/09/09/090000

Next.jsのApp Routerへ移行する上で、EmotionからCSS Modulesへの移行を行った過程の記事です。

CSSツール移行の過程で、Tagged Template LiteralをサポートしているなどEmotionと書き心地に互換性のあるPanda CSS、Pigment CSSなどを検討したそうですが、最終的には他ライブラリへの将来的な移行が比較的容易なCSS Modulesの採用に至ったそうです。

CSS Modulesを使用する際のポイントとして、[Happy CSS Modules](https://github.com/mizdra/happy-css-modules)を採用し、CSSに対して型を生成することで、対象のCSSファイルにコードジャンプできるようにしていることが述べられていました。

## ムーザルちゃんねる： Hono Webフレームワークの新しい選択肢

https://www.youtube.com/watch?v=7U41SzC3yis

Hono機能や思想を特徴ベースで網羅的に紹介したYouTube動画が「むーざるチャンネル」から公開されていました。

「Honoって聞いたことあるけどよく知らない・使ったことない」人向けの動画となっており、会話調でわかりやすく解説されていました。

## Request for developer feedback: customizable select

https://developer.chrome.com/blog/rfc-customizable-select

https://x.com/una/status/1834275031926419648?s=46&t=ZKHFW4mhn8K-sTNo_SVqMQ

スタイラブルな`<select>`要素を提供する、[Customisable Select Element](https://open-ui.org/components/customizableselect/)がWHATWGのStage2になりました。

Chrome Canary 130のExperimental Web Platform Featuresフラグをonにすることで試すことができ、フィードバックが募られています。記事中では、新しい`<select>`要素のAnatomyや詳しいスタイル方法もまとめられています。

## date-fns： v4.0 is out with first-class time zones support!

https://blog.date-fns.org/v40-with-time-zone-support/

date-fns の v4 がリリースされました。
v4では、従来のdate-fns-tzの置換となる、新しいIntl APIベースのタイムゾーン拡張した軽量なTime zones support が実装されました。

## Math.sumPreciseの実装がWebKitに追加

https://github.com/WebKit/WebKit/pull/33707

WebKitのMath.sumPreciseの実装のPRがマージされました。
Math.sumPreciseの具体的なアルゴリズムは仕様で指定されていませんが、TC39の[@bakkot](https://github.com/bakkot)が作成したpolyfillをそのままC++で再実装する形になってるようです。

## Oracle, it’s time to free JavaScript.

https://javascript.tm/

Oracleに対するJavaScriptの商標放棄を求める署名です。
JS の商標はOracleが持っていますが、一般用語になったJSを商標登録していることに対して、「混乱を招くためパブリックにしてほしい」というものです。

## Breaking News: JSConf is Back and Joining the OpenJS Foundation

https://openjsf.org/blog/jsconf-brand-and-js-logo-and-wordmark-contributed

JSConf のブランドが OpenJS に所属することになったとのことです。
来年の OpenJS World というカンファレンスは JSConf にリブランドされる見込みです。

# あとがき

個人的に、追っていた Customisable Select Element が WHATWGでStage2 になったのが嬉しかったです。
要素名の変更など様々な変遷を遂げてきた提案であり、まだフィードバックを募っている段階ですが、これまでパブリックに公開されていなかった詳しいスタイル方法なども遂にまとめられていたので、今後の進展が楽しみです🌈
