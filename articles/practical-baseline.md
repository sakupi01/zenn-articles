---
title: "プロダクト開発の基準に Baseline を取り入れるまで"
emoji: "✅" # お好きな絵文字を
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["baseline", "Web標準"]
published: true
publication_name: "cybozu_frontend"
published_at: 2025-09-21 12:00 # 未来の日時を指定する
---

こんにちは！サイボウズでデザインテクノロジストをしている [saku (@sakupi01)](https://x.com/sakupi01) です。

# はじめに

数ヶ月前に、個人ブログにて以下のエントリを投稿しました。

https://blog.sakupi01.com/dev/articles/thoughts-on-our-baseline

このエントリの執筆背景として、プロダクトで開発時に利用する Web 標準の機能において、社内で利用可能基準を策定していたことがありました。

そこから数ヶ月が経ち、開発時における利用可能機能の基準を「**Baseline Widely Available**」とし、現在、[kintone](https://kintone.cybozu.co.jp/) のフロントエンドというスコープで運用を開始しています。

本エントリでは、Baseline に決着するまでの背景と運用に至るまでに考慮したこと、弊社での活用方法について記します。

:::message

今回議論の対象としている基準は、 プロダクト開発時の基準として ”内部的に” 利用するものであり、外部に公開している動作保証よりも厳しい基準となっています。

外部的な動作の保証に関しては、 [動作環境 | サイボウズのクラウド基盤サイト](https://www.cybozu.com/jp/service/requirements.html) にて公開されているものを参照ください。

:::

# 前置き

Web 標準の機能を使う際に、その機能をプロダクトに入れても、機能が実装されていないブラウザをユーザが利用しているのであれば、その機能は動作しません。

そのため、そのプロダクトを使っているユーザの `User-Agent` 情報や RUM などからログを取って、その機能が動かないユーザをできるだけ少なくなるよう対応を講じたいというのが前提の考えとしてあります。

# 背景

元々、kintone では、`User-Agent` 情報をもとにアクセスログを収集し、あまりにも古いブラウザからアクセスされた場合には「警告バナー」を表示するようにしていました。
その後、[IE の完全サポート終了](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge/) (2022年6月) の影響を受けて、IE でページを表示した際に警告バナーが出現されるようにしていました。

- [サイボウズ製品・サービスでの Internet Explorer 11 サポート終了について（2022/08/17 更新） | サイボウズからのお知らせ](https://cs.cybozu.co.jp/2022/007588.html)

## 利用可能機能基準が曖昧に

開発時に利用して良い Web 標準の機能基準に関しては、2022年6月までは「IE11 = 最低保証ライン」という暗黙的な基準が存在していた節がありました。
しかし、IE をサポートしなくなった先で、Chrome / Edge / Safari / Firefox それぞれのサポート機能の差異に対して、「**どのブラウザのどこまでのバージョンを開発で利用可能とするか**」という声が疑問として上がりました。

そこで、「全体の98% 以上のユーザはサポートできるようにしよう」という社内合意のもと、開発で利用可能な Web 標準の機能基準は以下のように定義されていました。

- Chrome & Edge: アクセスログの利用率をもとにバージョンを判断（2% 未満であれば切る）
- Safari: iOS のサポート方針に合わせる。基本は最新 2 バージョン & 最新バージョンリリースから半年までは 3 バージョンをサポート
- Firefox: ESR バージョンまでサポート

**ブラウザのバージョン単位**で**アクセスログをもとに**した基準を設け、開発時に利用する機能の判断基準とするものです。

## 利用可能機能基準の管理問題

開発時における利用可能機能基準ができて、それに則って警告バナーを出せるようになりましたが、最初は各チームがブラウザバージョンを管理する仕組みを持っているような状態でした。
ブラウザバージョンの更新を忘れると「ページによってサポートするバージョンが違う」ことになってしまうので問題です。
そこで、「サポートするブラウザのバージョンを一元化するパッケージ」を作成して、持ち回りでバージョンを更新してメンテナンスしていました。

結果、**パッケージのオーナーシップが曖昧に**なってしまい、最終的にバージョン更新が滞ってしまっていました。

## 利用可能機能基準に対する認識のズレ・薄れ

リリース前のチームでは特に、「サポートするブラウザのバージョンを一元化するパッケージ」を依存に取り込んでおらず、**利用可能基準に対する共通認識が実質取れていない**という状況もありました。

そもそも、このパッケージの管理&生成物は、以下のような「バージョン」以外の何者でもなく、**実際に開発する際に意識する利用可能機能の基準としては、**（静的解析や MDN での参照などで）**活用しにくかった**のが現状でした。

```js
export const SUPPORTED_BROWSER_VERSIONS = {
  FIREFOX: 115,
  SAFARI: 17,
  CHROMIUM_EDGE: 122,
  CHROME: 122,
} as const;
```

---

これらの問題に加えて、業界として [**Baseline**](https://web.dev/baseline) という指標の認識が拡大しつつあったこともあり、開発時における利用可能機能基準を見直すのに良いタイミングなのでは？となったのが、ことのきっかけです。

# Baseline の利用でサポートできるユーザの概算

Baseline の採用を検討するにあたって、まず、今までの社内合意を経た独自の基準とどのくらいの乖離が生じるのかが気になるポイントでした。

これまでの基準では、社内合意のもと「98% 以上のユーザはサポートできるようにしよう」という方針だったため、Baseline の採用で**どの程度のユーザをサポートできそうか/できなさそうか**を事前に調査する必要がありました。

## Baseline Checker の活用

Google Analytics Baseline Checker というものがあり、GA から取得した特定の形式のデータをこの Checker にかけることで、サイトのアクティブユーザデータに基づいた Baseline ターゲットを確認することができます。

https://chrome.dev/google-analytics-baseline-checker/

社内規定上 3rd Party Scripts の利用にルールがあり、GA の利用ができないため、アクセスログの採取で利用していた Redash のデータをパースして、GA Baseline Checker で読み取り可能な形式に変換して利用しました。

その結果、以下のようなデータが得られました。

![cybozu.com のアクティブユーザデータに基づいた Baseline ターゲット](/images/baseline-report.png)
*cybozu.com のアクティブユーザデータに基づいた Baseline ターゲット*

## 考えられる影響

**Baseline Widely Available の基準を適用した場合、99.0% のユーザをサポートできる**ことが結果として得られました。
これは、「98% 以上のユーザはサポートできるようにしよう」というこれまでの内部基準に対して、**Widely Available の基準がより厳格なことを示す**ものです。

Widely Available の基準がより厳格なことにより、具体的には以下のような影響が出ることがわかりました。

- これまでの基準以上であったユーザについては特に影響はない
- これまでの基準未満で Baseline Widely Available 以上の約 1% のユーザに対して、警告バナーが出現しなくなる（＝サポートできるようになるため、警告バナーを出す必要がなくなる）
- Baseline Widely Available を利用することによってサポートできるユーザは、これまでの基準を利用していた頃に比べて約 1% 増加する
- （最も直近の）Baseline Widely Available 未満のユーザについては、これまでの基準時代でも出ていた警告バナーが引き続き出現する（＝サポートを保証できないので、警告バナーを出す必要がある）

![Baseline または旧基準と警告バナーの出現相関](/images/warning-banner-comparison.png)
*Baseline または旧基準と警告バナーの出現相関*

よって、弊社の場合は、基準を Baseline Widely Available にしても、社内規定の基準を満たすことができることが確認できました。
図の示す通り、従来警告バナーが出ていたユーザから「警告が消える可能性」は 1% 前後ありますが、その逆はないので、ネガティブな顧客影響は出にくいと結論づけています。

# ブラウザのバージョン単位でサポートするという考え方に対する懸念

そもそも「アクセスログに基づいたブラウザのバージョン単位でのサポート」という従来の考え方に対しての懸念からも、Baseline の採用が積極的に考えられました。

今ままでは、「98% 以上のユーザはサポートできるようにしよう」という独自の基準を、「プロダクトのアクセスログ」に基づいた「ブラウザのバージョン単位」で運用していましたが、この考え方はそもそも適切なのか？という話がありました。

## その `User-Agent` の精度は本当に信用できるのか

これまでの独自基準は、 `User-Agent` の情報をもとにパースしてブラウザとそのバージョンを叩き出し、その結果を「ユーザ」の情報として集計して基準にしているものです。
そもそもこれは、きちんと「ユーザ」の情報を反映した基準になっているのでしょうか？

`User-Agent` は HTTP ヘッダからくる文字列であり、簡単に偽装可能な情報です。
特にアクセスログには、Bot・クローラー・攻撃者・etc の「非ユーザ」が大量に含まれており、古い `User-Agent` を意図的に送信してくるケースも考えられるため、**実際の「ユーザ」の情報を反映しているとは限りませんでした**。

## UA の基準は利用可能な”機能の基準”を反映できているのか

`User-Agent` の情報をもとにブラウザとそのバージョンを特定し、それを基準として利用していますが、この **「UA の情報」がそのまま「ユーザが利用可能な機能」を反映しているとも限りません**。
ユーザはさまざまな設定や制限のもと、ブラウザを利用しています。

[ITP](https://webkit.org/blog/9521/intelligent-tracking-prevention-2-3/) の有効/無効、[Feature Flags](https://developer.chrome.com/docs/web-platform/chrome-flags) の ON/OFF、[Finch](https://developer.chrome.com/docs/web-platform/chrome-finch) のヒット状況、Stable/Beta/Nightly/TP など様々なビルドの利用、[組織ポリシー](https://chromeenterprise.google/policies/)による制限など、`User-Agent` だけでは到底判断できない要素が多数存在します。

特定機能のサポート状況を正確に把握したければ、`User-Agent` からの推測ではなく、[Feature Detection](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing/Feature_detection) による実測が信頼性の高い手法にはなり得ます。

とはいえ、ユーザの環境での機能の利用可能状況を調べたいのであれば、その機能を実際に使って検証する以上に精度の高い方法はないでしょう。

## ブラウザのバージョンを独自でサポートする責任

ブラウザの定期的なアップデートは、新機能の追加だけでなく、脆弱性対応による安全性の確保が目的なところもあります。
となると、古いバージョンをサポートすることは、**単なる「機能の有無」の問題ではなく、「ユーザの安全を担保できるか」という責任に直結する話**ともいうことができます。

仮に古いバージョンの脆弱性を突かれてインシデントが発生した場合、「ユーザのサポートを尊重した」では済まされなくなるかもしれません。
また、ユーザ企業や組織の中にはブラウザの更新が制限されている環境も存在する可能性があります。
しかし、これらの「特殊な環境」を「サポートしなければならない基準内だから」という理由で無条件にサポートすることは、他の大多数のユーザーのリスクを高めることになりかねません。

「サポートブラウザのバージョン」を決めることは、**その範囲内でサービスがユーザの安全を担保するということ**にも繋がります。

# Baseline が機能基準であることのメリット

開発時における利用可能機能の基準が Baseline であることにより享受できるメリットも大きいです。
例えば、弊社の場合は以下のような恩恵を受けることができると考えられました。

- **開発ランドで利用可否を都度人力判断する手間がなくなる**
  - 静的解析ツールやダウンパイルのオプションで Baseline を指定できるものも増えてきており、人力の判断なしでブラウザバージョンに即した機能を開発で取り込める
  - [VSCode](https://web.dev/blog/baseline-vscode) や [Chrome の Devtools](https://web.dev/blog/baseline-devtools-css) でも CSS や HTML のホバーカードに Baseline の情報が表示されるようになるなど、開発時に利用可能な機能を即座に確認できる地盤が整い始めている
  - 都度 MDN や caniuse で「この機能って、独自基準の範囲だっけ？というか、今の独自基準ってなんだっけ？」を調べる必要がなくなる
- **独自基準をメンテナンスしなくて良くなる**
  - 指標は WebDX のリポジトリでオープンに管理されているため、独自基準を人力で定期更新する必要がなくなる
  - [web-platform-dx/web-features](https://github.com/web-platform-dx/web-features/)
  - Widely Available になった主要ブラウザのバージョンを自動的に更新する仕組みも用意されている（静的解析やダウンパイラのオプション、UA のヒット判定に利用可能）
    - [web-platform-dx/baseline-browser-mapping](https://github.com/web-platform-dx/baseline-browser-mapping)
- **共通認識が揃えやすくなる**
  - 独自指標ではなく、Web プラットフォーム共通の指標を利用することで、MDN など、業界で広く認知されているリファレンスで参照が容易になる
  - 今まで独自指標の存在を知らなかった人や Newcomer でも、業界共通認識として共有可能

特に、Baseline が WebDX CG によって管理されており、定期更新される仕組みを持っているため、利用可能基準のメンテナンスを安心して外部に移譲できます。
「独自基準をパッケージとして管理し、オーナーシップを失って衰退した」という過去があるうえで、メンテナンスの負担を~~軽減できる~~なくせるというのは大きなメリットでした。

---

以上の背景を経て、**開発時に内部的に保証する利用可能機能の基準として「Baseline Widely Available」を採用する**という結論に至りました。
kintone フロントエンドにおいて、「Baseline Widely Available」の参照は、 特別な理由がない限り必ず遵守すべき項目としています。

![Baseline Widely Available は kintone フロントエンド技術標準の must 項目です](/images/baseline-must.png)
*Baseline Widely Available は kintone フロントエンド技術標準の must 項目です*

# Baseline の活用方法

Baseline の活用は、現状以下のような方法で開発チームに働きかけています。

## 警告バナーの表示

Baseline Widely Available の対象範囲から漏れてしまうブラウザを利用している場合には、一部機能が正常に動作しない可能性があります。
そのことをユーザに伝達するために「警告バナー」を表示するようにしています。

![Widely Available の対象範囲から漏れた場合に出現する警告バナー](/images/warning-banner.png)
*Widely Available の対象範囲から漏れた場合に出現する警告バナー*

Widely Available の対象範囲から漏れてしまうブラウザに出現させる必要があるため、この警告バナーのスクリプトはターゲットをかなり下げてビルドします。

Baseline に対する UA のヒット判定には、[web-platform-dx/baseline-browser-mapping](https://github.com/web-platform-dx/baseline-browser-mapping) を利用しています。
baseline-browser-mapping は、指定の Baseline Target と互換性のあるブラウザとそのバージョンを配列で返してくれます。
この情報を、警告バナー表示の際の UA ヒット判定に利用しています。

警告バナーはフロントエンド領域の Monorepo として実装しており、ビルド成果物を各チームが取り込んで利用するという形で運用しています。

## 静的解析ツールの設定に Widely Available を指定する

CSS においては、ESlint や Stylelint などの静的解析ツールで Baseline をもとにしたルールやプラグインが充実してきました。
これらを活用することで、Baseline に則ったコードかどうか、実装時点で気付けるようになります。

### @cybozu/esliet-config | css-baseline preset の提供

eslint に関しては、[@cybozu/esliet-config](https://github.com/cybozu/eslint-config) から [css-baseline プリセット](https://github.com/cybozu/eslint-config/blob/master/flat/presets/css-baseline.js)を提供するようにしました。
弊社では、ほとんどのチームが @cybozu/esliet-config を利用しており、css-baseline プリセットを追加で利用することで Baseline Widely Available に則った CSS の実装ができるようになります。

![Widely Available 未満の CSS を利用した際に警告する](/images/css-baseline.png)
*Widely Available 未満の CSS を利用した際に警告する*

---

そのほかの静的解析ツールを利用している場合は、それぞれの設定を参照するようにします。

- stylelint:
  - baseline 指定: [ryo-manba/stylelint-plugin-use-baseline: A Stylelint plugin that enforces Baseline CSS features.](https://github.com/ryo-manba/stylelint-plugin-use-baseline)
  - browserlist 指定: [stylelint-no-unsupported-browser-features](https://github.com/RJWadley/stylelint-no-unsupported-browser-features)
- [Support for CSS and Baseline has shipped in ESLint  |  Blog  |  web.dev](https://web.dev/blog/eslint-baseline-integration)

## トランスパイラの設定に Widely Available  を指定する

ビルドツールが Browserslist や esbuild ビルド target の設定をによるダウンパイルをサポートしているのであれば、 Baseline Target をクエリに指定することで、選択した Baseline Target に応じてコードがトランスパイルされるようになります。

弊社のほとんどのチームで利用されている Vite は、 2025/08 時点では [Browserlist を `build.target` としてサポートしていません](https://github.com/vitejs/vite/issues/11489)。
しかし、 `build.target` を指定しない場合、Vite は[デフォルトで Baseline Widely Available をターゲットとしてトランスパイルする](https://vite.dev/guide/build#browser-compatibility)ので設定不要です。

そのほかのトランスパイラを利用している場合は、それぞれの公式ページを参照して設定します。

- Browserslist 形式
  - e.g. [webpack](https://webpack.js.org/configuration/target/), [Rsbuild](https://rsbuild.dev/guide/advanced/browserslist), [Babel](https://babeljs.io/docs/babel-preset-env#browserslist-integration), [autoprefixer](https://github.com/postcss/autoprefixer?tab=readme-ov-file#browsers), [eslint](https://github.com/amilajack/eslint-plugin-compat) …
- browserslist to esbuild : [marcofugaro/browserslist-to-esbuild](https://github.com/marcofugaro/browserslist-to-esbuild)
- esbuild 形式
  - e.g. [Vite](https://vite.dev/guide/build#browser-compatibility)
- [Use Baseline with Browserslist  |  Articles  |  web.dev](https://web.dev/articles/use-baseline-with-browserslist)

# あとがき

Baseline という指標の導入で、適切に計測できているかも怪しい「サービス独自の基準」を廃止し、「Web 全体」で統計がとられた機能単位の基準に寄せることができます。

「Web 全体」の指標をサービスに持ち込むことに定量的な根拠が必要なのであれば、[Baseline Checker を利用](#baseline-の利用でサポートできるユーザの概算)して、組織合意を得る際に活用できるでしょう。

Web の機能をどこまで開発で利用可能とするのかに責任を持つことは、そのプロダクトがどこまでの HTML/CSS/ARIA/JS/プライバシー/セキュリティ etc... に責任を持っているのかを明確にすることにも繋がります。

ブラウザで開発している以上、それに対して最も機能責任を持っている Web プラットフォームが表明する「Baseline」という指標を、開発に取り入れる地盤を作り、それをチームに啓蒙して活用し、「プロダクトの責任」を 「Web の責任」に整合させていくことが重要だと考えています。
