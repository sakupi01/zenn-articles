---
title: "Interop 2024の中間アップデートなど: Cybozu Frontend Weekly (2024-07-16号)" # 目立ったニュースを選ぶ
emoji: "🌻" # お好きな絵文字を
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["CybozuFrontendWeekly", "frontend"]
published: true
publication_name: "cybozu_frontend"
published_at: 2024-07-17 18:00 # 未来の日時を指定する
---

こんにちは！サイボウズ株式会社フロントエンドエンジニアの[saku (@sakupi01)](https://x.com/sakupi01)です。

# はじめに

サイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。

今回は、2024/07/16のFrontend Weeklyで取り上げた記事や話題を紹介します。

# 取り上げた記事・話題

## MySQLデータベースエンジンでJSをサポート
<!-- textlint-disable -->
データベースエンジン側にあらかじめまとまったクエリの処理などを登録しておき、必要に応じて呼び出すことでその処理を実行できるストアドプロシージャやストアドファンクションという機能の処理をJavaScriptで記述可能になります。
<!-- textlint-enable -->
MySQLのデータベースエンジン側でJavaScriptを実行する機能を提供しているのはGraalVM上で実装されている[GraalJS](https://github.com/oracle/graaljs)です。

以下のように、`LANGUAGE JAVASCRIPT AS $$`とすることでSQLの中にストアドプログラムをJSで記述できるようになります。

```sql
CREATE FUNCTION gcd_js (a INT, b INT) RETURNS INT 
LANGUAGE JAVASCRIPT AS $$

  let [x, y] = [Math.abs(a), Math.abs(b)];
  while(y) [x, y] = [y, x % y];
  return x;

$$;
```

https://www.publickey1.jp/blog/24/mysqljavascriptjavascript.html 

https://blogs.oracle.com/mysql/post/introducing-javascript-support-in-mysql

## Vitest2.0リリース: Browser Mode support など

Vitest2.0がリリースされました。

ブラウザ上でテストが実行可能になるブラウザモードのサポートが追加されました。
実際のブラウザ環境でテストを実行し、ビューポートの変更、マウス操作のシミュレーション、スクリーンショットの取得、DOM要素の操作とアサーションなど、挙動を直接テストすることが可能になります。

また、[forks(node:child_processベース)で実行やデバッグが安定しない懸念](https://github.com/vitest-dev/vitest/pull/5047)があったため、デフォルトをthreads(node:worker_threadsベース)にする変更が加わりました。
threadsを使用することで、実行時間が多少遅くなる懸念はあるものの、安定性が向上することが期待されるようです。

https://github.com/vitest-dev/vitest/releases/tag/v2.0.0 

## Interop2024中間アップデート

Interop2024の中間アップデートが公開されました。

[2024/2にスタートしたInterop 2024](https://zenn.dev/cybozu_frontend/articles/few-2024-02-06#the-web-just-gets-better-with-interop-2024)の時点でのスコアは65だったのに対し、2024/6の時点でのスコアは75と、10ポイントの向上となりました。

Popover APIがBaselineに追加されたことや、FireFoxの`@property`を使ったカスタムプロパティへの貢献、Chromeの`font-size-adjust`やSafariの`text-wrap: balance`への貢献がスコア上昇に寄与したようです。

https://web.dev/blog/interop-2024-midyear?hl=en

## トロイの木馬化した改ざん版jQueryの脅威

トロイの木馬化した改ざん版のjQueryがCDNやnpmなどを介して拡散された可能性があると発表されました。

https://thecyberexpress.com/jquery-attack-hits-npm-github/ 

https://blog.phylum.io/persistent-npm-campaign-shipping-trojanized-jquery/ 

## ESLintの今後

ESLintの今後についての記事です。

FlatConfigの導入だけではなく、各言語プラグイン機能をサポートして現在以上に言語依存のないリンターへ進化することや、Coreの完全な書き直しが行なわれ、より柔軟で現代的なツールとなるとのことです。

https://eslint.org/blog/2024/07/whats-coming-next-for-eslint/ 

## フィヨルドブートキャンプがフロントエンジニアコースをオープン

オンラインプログラミングスクールであるフィヨルドブートキャンプがフロントエンドエンジニアコースをオープンしました。

https://bootcamp.fjord.jp/articles/125 

## Google I/O 2024 注目のフロントエンド技術

Google I/O 2024で注目されたフロントエンド技術についてまとめた記事です。

https://techblog.lycorp.co.jp/ja/20240709b 

### Built-in AI

AIモデルをブラウザに組み込みむ機能の開発ついての発表です。組み込みAIがWeb標準として定義され、JSによって扱えるようになります。

https://developer.chrome.com/docs/ai/built-in?hl=en

### View Transitions API

画面移動をなめらかに実現するView Transitions APIについても発表されています。

https://io.google/2024/explore/8ae18b72-028e-4722-9a05-4a480048e629/

### Speculation Rules API

ページのプレレンダリングやリソースのプリフェッチを可能にするAPIの紹介です。
ユーザーがよく訪れるであろうパスを事前に読み込む設定を書くことで、MPAでも高速な画面移動が可能になります。

https://io.google/2024/explore/24c82286-24fd-42b7-b5a8-bbe9c917cbe4/

https://developer.chrome.com/docs/web-platform/prerender-pages?hl=en

## ライブリージョンの正しい設定方法について

ライブリージョンが、SSRされた要素や`display: none`のコンテナを使うと機能しない現象に対して、理由と解決策を提案している記事です。
ブラウザと支援技術（スクリーンリーダ）の組み合わせも考慮しての正しいライブリージョンの設定方法についても詳説されています。

https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/ 

## プログレッシブ・エンハンスメントとは何なのか

ブラウザの機能に基づいて段階的に機能を追加することで、すべてのユーザーに最適な体験を提供する設計・開発手法である「プログレッシブ・エンハンスメント」についての記事です。

記事内では、JavaScriptは補助的な役割にとどめ、まずはHTMLとCSSで堅実なベースを構築し、その上で新しい技術を段階的に追加することが重要であると述べられています。

https://piccalil.li/blog/its-about-time-i-tried-to-explain-what-progressive-enhancement-actually-is/ 

https://zenn.dev/cybozu_frontend/articles/think-about-pe 

## [JSC] RegExp quantifier should allow 2^53 - 1 

WebKitのJavaScriptCoreは正規表現の量指定子で2^53 - 1までの大きな数値を使用できるようになり、ECMAScript仕様に完全に準拠する変更が加わりました。
これにより、より柔軟な正規表現パターンの記述が可能となり、他のJavaScriptエンジンとの互換性も向上しました。
実用的な場面での影響は限定的かもしれませんが、この修正によってエッジケースのサポートが強化されたようです。

https://github.com/WebKit/WebKit/pull/30559 

# あとがき

個人的には、Interop 2024の中間アップデートで主要ブラウザが貢献してきた新たなWeb標準に関する情報をまとめることができた週でした。
今年の[Focus Areas](https://web.dev/blog/interop-2024#all_focus_areas_for_2024)となっているWebComponentsに関する新機能なども含めて、その他Baselineの動向にも注目したいです🤸🏻‍♀️
