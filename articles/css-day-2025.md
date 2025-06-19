---
title: "CSSDay 2025 Report"
emoji: "🇳🇱"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ['css','web', 'conference']
published: true
publication_name: "cybozu_frontend"
published_at: 2025-06-20 12:00 # 未来の日時を指定する
---

こんにちは！サイボウズでデザインテクノロジストをしている [saku (@sakupi01)](https://x.com/sakupi01) です。

2025/06/04~05 にオランダのアムステルダムで開催された CSSDay 2025 に参加してきました🎨✨

![CSSDay のネームホルダー](/images/saku-cssday.png)

https://cssday.nl/

CSSDay は 2013 年から計 11 回開催されている、世界最大級の CSS に特化した伝統あるカンファレンスです。例年、世界的にみても著名なエンジニアや仕様策定者が登壇しています。

- [All Speakers & MCs](https://cssday.nl/speakers.html)

聴講したセッションを抜粋して軽いまとめ＆感想、スピーカーや参加者と個人的にディスカッションしたこと、CSSDay 2025 全体を通じた感想のまとめです。
スライドが公開されているものに関しては、各トークのセクションに添付しています。

# Day 1

MC: Stephen Hay

## 🌏 The Ultimate Scroller by Adam Argyle

最近まで Google で CSS 系の DevRel をしていた Adam Argyle による、CSS Scroll Behavior と Carousel を主に用いたスクロール実装方法のベストプラクティスに関するトークでした。

`overscroll-behavior: contain;` でスクロールしすぎた時のブラウザバックを防いだり、Scroll Snap, Scroll State を CSS Carousel と組み合わせて Nintendo Switch 風の UI を作るなど、Scroll Bar やそれと組み合わせた Carousel の実装、その過程における考慮漏れや Tips を紹介する内容でした。

https://css-day-2025.argyleink.deno.net/

![Adam Argyle](/images/adam-argyle.png)

実際に動作するデモを用いながら CSS 新機能を活用したスクロールのベストプラクティスを紹介し、リアルタイムで UI を改善していく、非常に Adam Argyle らしい趣向を凝らしたトークだったなと思います。

## 🌏 A Dao of CSS by John Allsopp

John Allsopp は、 2000 年に [A List Apart](https://alistapart.com/) で A Dao of Web Design を執筆し、レスポンシブデザインの元となる考え方を流布させたといっても過言ではない方です。

今回は、「A Dao of CSS」というタイトルで、CSS がどうあるべきかという哲学について考察したトークでした。

自身の A Dao of Web Design を元に、Web が、標準が、どのように Printed Design や多様なデバイスの登場と向き合ってきたかを振り返り、それによって CSS がどのような立ち位置を取ることになったのか考察します。これを元に、「The essence of the Web」として、7 つの CSS 基本原則を提唱し、CSS のあるべき姿を結論づけていました。

![John Allsopp](/images/john-allsopp.png)

個人的に、John のトークは全体を通しても特に印象に残るものでした。
CSS は Web の特性を反映したものであり、Web があらゆるコンテキストを包含するという特性を理解することは、CSS 進化背景の理解を試みる上でも非常に役立つと感じました。

ちなみに、A Dao of Web Design は Web 標準の黎明を受けて Web Design を考察したもので、Printed Design と Web Design の違いを明確にするだけでなく、Web の特性に関する洞察が書かれた記事になっています。25 年前の文章ですが、一読の価値があるものです。

https://alistapart.com/article/dao/

## 🌏 Is Sass Dead Yet? CSS Mixins & Functions by Miriam Suzanne

CSSWG の Invited Expert であり、Sass のコアコントリビュータである Miriam Suzanne が提案している [CSS Functions and Mixins Module](https://www.w3.org/TR/css-mixins-1/) に関するトークでした。

トークのメインは、CSS エンジンでの処理過程の切り口から、CSS Custom Properties、Functions、 Mixins が Sass のそれらとどのような点で異なるのかを解説したものでした。
「CSS is a Declarative Language」「There's no CSS Value Resolution system in Sass.」という点が主に強調されており、Q&A セッションでも「CSS という宣言的な言語にループや逐次的な処理を組み込むことはない。もし逐次処理をしたいなら Sass を使ってね。」という回答がありました。

![Miriam Suzanne](/images/miriam-suzanne.png)

Function や Mixin に関しての現場でのプラクティスが得られる感じのセッションかな〜と予想していたのですが、CSS 根底の仕組みを解説することで Sass との違いを明確にする、発展途上な技術のなかでも事実に基づいた見解を提供するような内容で、非常に知見が深まりました。Sass if、function、mixin の苦い背景から、これらを CSS でどのようにメンテナンスしていくのかがこれから問われていきそうですが、まずは Sass と CSS での違いを理解するという重要なステップを踏ませてくれるものだったかなと思います。

CSS Functions は、執筆時点（2025/06/20）で、 Chrome Dev ビルドで利用可能です。ぜひ Working Group に FB を、とのことでした。
CSS Mixins に関しては、実装が不完全な状態ですが、Canary ビルドを `--enable-blink-features=CSSMixins` フラグを有効にして起動することで利用可能です。

また、Miriam Suzanne は Cascade Layers や Container Queries、Scope を提案したことでも著名な人物です。

Mia のトークは笑いの要素が散りばめられていて、聞いていて楽しかった〜！

## 🌏 Select it! Styling new HTML UI capabilities by Brecht De Ruyte

Open UI で Customizable Range Element などを進めている Brecht De Ruyte による、CSE (Customizable Select Element) に関するトークでした。

Form Controls の課題から CSE が提案された背景や、トップレイヤーと関連した要素のアニメーション、`<optgroup>` を用いた CSE のスタイリング、CSS Carousel との合わせ技などの紹介がありました。

https://slides.utilitybend.com/styling-select

![Brecht De Ruyte](/images/brecht-de-ruyte.png)

CSE はアドベントカレンダーやカンファレンスで触れたこともあって、個人的に思い出深いトピックでした。

CSE は最近 Open UI で [Graduated Proposal となりつつあり](https://github.com/openui/open-ui/pull/1233#pullrequestreview-2911129787)、WHATWG でも [Stage 3](https://github.com/whatwg/html/issues/9799) に到達しています。また、Day2 の Tim の発表にも関連しますが、CSE は [CSS Form Controls Module Level 1](https://www.w3.org/TR/css-forms-1/) で進められている `appearance: base;` でオプトイン可能な Form Controls の一つであり、現状 **`appearance: base-select;`** でオプトインできる CSE はそのプレビュー版的な位置付けです。

2025/06/20 現在、 CSE は Single Select のみに対応しており、Multi Select は [select-v2](https://github.com/openui/open-ui/issues?q=is%3Aissue%20state%3Aopen%20label%3Aselect-v2) として現在仕様策定が進んでいます。Multi Select に関しては、Chrome Canary の `experimental-web-platform-features` フラグを有効にすることで試すことができます。

## 🌏 Multicol and fragmentation by Rachel Andrew

Google で CSS や Baseline を中心に DevRel として活動している Rachel Andrew から、CSS Multi-column Layout と Fragmentation に関するトークでした。

[Multi-column Layout](https://www.w3.org/TR/css-multicol-1/) は [Fragmentation](https://www.w3.org/TR/css-break-3/) と密接に関連した仕様です。Fragmentation は Web Page Print や Multi-column Layout で起こる、コンテンツの breaking のことです。Fragmentation にはさまざまなエッジケース・ユースケースが存在するため、これに関する仕様策定や実装は非常に難しくなっています。
トークでは、Fragmentation の説明や、Fragmentation が直面してきた課題、Fragmentation を利用する仕様である [CSS Paged Media](https://www.w3.org/TR/css-page-3/) , [CSS Generated Content](https://www.w3.org/TR/css-content-3/) , [CSS Multi-column Layout](https://www.w3.org/TR/css-multicol-1/) , [CSS Gap Decorations](https://www.w3.org/TR/css-gaps-1/) の紹介がありました。

https://noti.st/rachelandrew/mI9WWD/multicol-and-fragmentation

![Rachel Andrew](/images/rachel-andrew.png)

`@page` やそれに関する `@` ルールが 2024 年に Baseline Newly Available となりましたが、個人的に `@page` も Multi-column Layout も利用したことがなかったので、知らない領域の内容で非常に新鮮でした。

とはいえ、ここから派生する CSS Gap Decorations などは、Flexbox や Grid Layout といった親しみ深いレイアウトとも密接に関連するモジュールであり、仕様策定がスケーラブルに行われていることに感銘を受けました。

Multi-column に関してはさまざまなユースケースが考えられ、未だ仕様も策定中のため、多くの意見を募っているとのことです。

Fragmentation に関しては Rachel 自身が過去に執筆した以下の記事が非常に参考になります。

https://www.smashingmagazine.com/2019/02/css-fragmentation/

## 🌏 Design Token Architecture  by Brad & Ian Frost

Atomic Design を提唱した Brad Frost と、その弟である Ian Frost による、Design Token Architecture というトークでした。

同じ会社の中でもさまざまなプロダクトがあり、Web/ネイティブの区別がり、ブランドがあり、色があり、ユーザ層があり、スペクトラムがあり・・・ますが、これらに一貫性を持たせ、統一的に扱うことで、manageable にしたいです。そのための仕組みとして Design System が存在しますが、その一貫性ゆえに「Design Systems kill creativity！」と言われる節もしばしば。

トークでは、「Design System = Design Token System + Component System」として再定義し、Design Token System を中心に据えた Design System のあり方を提案していました。

また、Brad 自身が提唱し、2025 年現在 Open UI が主導している [GDS (Global Design System)](https://github.com/openui/design-system) についても言及がありました。将来的には、「Design Token System + Component System + Global Design System → UI！」となる構図が理想的だと主張していました。

![Brad & Ian Frost](/images/brad-and-ian-frost.png)

弊社でも複数の関連するプロダクトを持っており、全てを一貫したデザインシステムで管理しているわけではないので、この内容はとても刺さるものでした。

確かに Design Token は存在し、特定のプロダクトで機能していますが、Design Token System としてさまざまな Theme をもつ Architecture として機能し、さまざまなプロダクトに適用可能な仕組みにする方法論は、非常に今後の参考となるものでした。

また、個人的に追っていた GDS の話もあり、Open UI が目指す方向性、GDS をプロダクトデザインシステムと調和させる方法について改めて確認できたのもよかったです。

# A Little Break

会場の 2F にはコミュニケーションスペースが設けられていました。

![コミュニケーションスペース](/images/communication-space.png)

Google は社員に質問できるコーナーを設けており、話したかった人が順に回ってくるので、積極的に利用していました。

![質問できるコーナー](/images/help-desk.jpg)

CSSDay での Google お家芸（？）の「What's Missing Missing in HTML & CSS ?」も催されていました。
![What's Missing Missing in HTML & CSS ?](/images/whats-missing.jpg)

また、飲み物や軽食が常時提供されており、その周りで参加者同士の交流も活発に行われていました。

# Day 2

MC: Bramus

## 🌏 Scope in CSS by Chris Coyier

Codepen の作者であり CSS-Tricks の Founder でもある Chris Coyier による、CSS Scope の有用性に関するトークでした。

「CSS Scope is nothing special.」とし、これまでも Selector や MediaQueries などで CSS Rules 単位のスコープは存在していた事実を強調します。そして、Selector 単位のスコープが抱える「セレクタバッディング問題」への解決策として、React などフレームワークネイティブで CSS のスコーピング手法が存在しないものに対しては、 CSS Modules (Bundler) や CSS in JS が、Vue などフレームワークネイティブで CSS のスコーピング手法が存在するものに対してはそれが使われてきており、Chris はこれらに対して肯定的な姿勢でした。また、Utility Classes のような、各 HTML 要素に密に結びついた Class も、ある種 CSS のスコーピング手法となり得ることついても触れていました。

これらの事実を踏まえ、「シンプルな Selector 単位のスコープでおおむねは問題ない」「特有のドーナツスコープや Proximity を利用するのであれば、`@scope` は解決策になり得る」「要素の `<style>` 内に `@scope` を書いて Shadow DOM のスタイリングのようにして使うなら、とても良い解決策になり得る」と主張していました。

![Chris Coyier](/images/chris-coyier.png)

個人的にも、CSS にはすでに「スコープ」という概念は存在しており、CSS Scope はドーナツ型や Proximity を利用できることに強みがあると感じていました。
しかし、Shadow DOM に近しい形で `@scope` を利用する方法に関しては、コンポーネント特有のスタイルを特定の要素に閉じ込めつつ親スタイルの継承も可能なため、`@scope` の適切な利用を確実にできれば、適切にグローバルスタイルを継承したコンポーネントスタイリングを実現できるのではないかと感じました。

## 🌏 Form control styling by Tim Nguyen

[Form Control Styling Level 1 の First Public Working Draft を公開](https://lists.w3.org/Archives/Public/www-style/2025Mar/0004.html)した、WebKit の Tim Nguyen による、Form Control Styling に関するトークでした。

どうして現状の Web では Form Control のスタイリングや拡張が難しいのか、Form Control のスタイリングに関する歴史的な背景や、[Form Control Module Level 1](https://www.w3.org/TR/css-forms-1/) の概要と目的、今後についての説明がありました。

仕様では、`appearance: base;` を指定することで、Form Control にデフォルトの一貫した UA スタイルを付与し、CSS によるスタイリングを可能にすることができます。デフォルトのスタイルに関しては、[Design Principles for the Basic Appearance](https://drafts.csswg.org/css-forms-1/#basic-appearance-principles) の項目で決められており、WCAG 2.2 AA を 100% pass するように定義されているとのことです。

その他にも、Date Picker や HTMLInputElement type=range などといった複雑な UI パーツを含むコントロール、CJK の考慮など、現在も活発に議論が続いているため、ぜひ Working Group に FB を！とのことでした。

![Tim Nguyen](/images/tim-nguyen.png)

Form Control Styling の FPWD が公開されたことは、個人的にもとても嬉しかった出来事だったので、実際に Tim から背景や現在、今後の展望についても聞くことができて、とても貴重な経験でした。

## 🌏 The goose and the commons by Bruce Lawson

最後は CSS というか、 Web の健全性について、Vivaldi ブラウザの Founder であり元 Opera の Bruce Lawson によるトークでした。

タイトルの「The goose and the commons」は、ことわざで、「共有資源の私有化」を意味します。Web という共有資源に、Big Tech が与えてきた影響と、現在の Web を取り巻く社会情勢について警鐘を鳴らす内容でした。

PWA という「対ネイティブの夢」を十分にサポートせず、iOS マーケットで独占の姿勢を見せる Apple に対抗して [Open Web Advocacy](https://open-web-advocacy.org/en/) が立ち上がり、これが EU での [CMA(Competition and Markets Authority) による調査](https://www.gov.uk/government/news/cma-plans-market-investigation-into-mobile-browsers-and-cloud-gaming)、DMA(Digital Market Authority) による規制に繋がった流れを振り返ります。
その一連への報復として [Apple の PWA サポート取りやめ](https://www.apple.com/newsroom/2024/01/apple-announces-changes-to-ios-safari-and-the-app-store-in-the-european-union/)があり、対して Open Web Advocacy が多くの署名をもとに[反対の声](https://letter.open-web-advocacy.org/)を上げ、その結果、iOS の WebKit 縛りは残るものの、 [Apple の PWA サポート継続](https://developer.apple.com/support/dma-and-apps-in-the-eu#8)に至ったと言います。

その他のベンダにもテンションがかかる状態であり、MS は [EU で Edge のダウンロードを促すプロンプトを削除](https://blogs.windows.com/windows-insider/2025/06/02/updates-to-windows-for-the-digital-markets-act/)、Google は US で DOJ(Department of Justice) から Chrome の分社化を求められ、Mozilla の開発にも影響を与える可能性がある点など、Web の健全性を脅かす事例が多くあることを指摘していました。

トークの最後には、我々が PWA を作ることを検討し、規制当局に懸念を伝えることで、Big Tech 同士が押し潰し合い、Web が壊れるようなことは避けたいとしていました。

https://speakerdeck.com/brucel/cssday-amsterdam

![Bruce Lawson](/images/bruce-lawson.png)

Web 「技術」としては、昨今のさまざまな互換性のための取り組みや標準化団体の活動により、前進しやすい状態になってきています。しかし、Web ブラウザを運営する「企業」という文脈だと、また別の話なように思います。
CSS ではないものの、このトークに関心が寄せられ、採択され、カンファレンスの砦に持ってこられるくらいには、 「Web の健全性」は昨今において重要なトピックになっているのだと感じました。
企業の戦略や利益ではなく、純粋に Web のことだけを考えていたいものです......。

# Discussions

セッションの合間などに、複数のスピーカーや参加者の方とお話しすることができました。それぞれの軽い紹介と、実際に話した内容をメモ程度に書いておきます。

（※ なお、カジュアルトークも含まれており、話者間の推測や根拠に欠ける情報も含まれていると思います。100 % 正しい情報ではない点をご理解いただたけると幸いです。）

:::details 🗣️ Discussions Summary

（唐突のである調で）

## Rachel Andrew & Philip Walton

Rachel Andrew: Google の CSS系 DevRel。Baseline もやっている。CSSWG では、Reading Flow や Multi-column、Masonly などレイアウト周りをよく担当していると思う。
Philip Walton: Google. baseline-checker の作者。（[CSS Architecture](https://philipwalton.com/articles/css-architecture/) で有名な印象）

- ❓ : 最近社内でブラウザの[サポートバージョンどこまで担保する？の話](https://blog.sakupi01.com/dev/articles/thoughts-on-our-baseline)をしているので聞いた
- Rachel 的にも 「Widely Available を使うっていう判断」は間違ってないって感じだった。「[How to choose your Baseline target](https://web.dev/articles/how-to-choose-your-baseline-target)」が参考になるよとのこと。
- Philip 的には、もし Widely Available や Baseline の説明がしにくいとか、既存のログをベースにした閾値から移行しにくいなら、独自の Baseline でどのくらいサポートできるのかで説明できるようにするといいという感じだった。独自の Baseline を決めれるように [baseline-checker](https://chrome.dev/google-analytics-baseline-checker/) というツールを作ったから使ってね。（ここで、まさかの作者だったことが発覚）
- ただ、baseline-checker は Google Analytics 専用だから、いい感じに真似して独自のものを実装してみてね、とのこと。
- いずれにせよ、ブラウザごとのバージョンじゃなくて Baseline を使うことを推していた。
- web.dev とか firebase とか Google のサービスはどうしてるの？と聞いたら、特に Baseline は使ってなくて開発チームの裁量に任されているみたい。正確なところはわからないみたいな感じだった。

## Una Kravets

Google の CSS 系 DevRel。I/O でよく 「What's New in Web UI」とかをしている。

- ❓ : Carousel in CSS、どうなの？の話
- 賛否両論の意見が出てきている段階であり、HTML でも再考されている。TBD。
- 擬似要素とかをゴリゴリ作って CSS でやるというふうになったのは、 既存の任意 HTML セマンティクスをベースにしつつ、CSS でカルーセルにオプトインする思想で始まったからという感じだった
- Customizable Select Element とか、擬似要素は `::picker()` とかと一緒なイメージらしい

## Sacha Greif

Stage of whatever 系のサーベイをやっているひと。

- Sacha から話しかけにきてくれた。
- 話した時点では、今日明日 State of CSS 2025 リリースしようと思ってる〜っていってた
- そのほかは日本に関する雑談
- もっと色々聞けばよかった...

## Eric Leese

Chrome の DevTools の人。

- `if()` とか `@function` ってデバッグしたくなると思うんだけど、DevTools での対応どうなの？の話
- 確かに Dev では今動かないよな〜というのを [kizu.dev](http://kizu.dev) のデモを一緒に確認しながら確かめた。
- でも upcoming だよとのこと。Chrome Canary で `if()` とか `@function` ってデバッグ試せるので試してた
- こういう DevTools に欲しい機能とかってどこに言えばいいの？と聞いたら、crbug に issue 投げてくれるといいよ or DM でとのこと。

## Miriam Suzanne

Sass. CascadeLayers, Container Queries, Scope, if/function/mixin.の提案者。CSSWG の Invited Expert。

- ❓ : CSS 設計全体を見直す必要があるような機能追加が多いけど、どう取り入れていくのがベストプラクティスなの？
- まず、全てにおいてスモールスタートから始めるべき。そこから拡充。どういう状況かにもよるだろうし、ベストプラクティスのようなものは作りにくいので、試しながら段階的に導入していくといい
- Cascade Layers: Mia なら、Reset CSS 入れるのであれば絶対使う。新規だろうと、途中からだろうと。`@layer` 自体もそうデザインされていて、`@layer` したものよりもしてないものが優位なので、段階的に導入しやすい設計になっている。
- nesting は、まあいっぱい使って
- `@scope` は聞くの忘れた
- ❓ : `if()` とか `@function` とか Container Queries とか、内部に条件分岐含むやつ、デバッグしにくくない？
- Container Queries はすでにデバッガブルなので
- `if()` とか `@function` のデバッグは Canary できてる
- ❓ : Custom Property, function, mixin はトークン化したいけど、Figmaが対応してないよね・・・
- Mia のところでは SSOT は CSS ファイルにしているらしい。 Figma での管理は視覚的に確認したりデザイナと共有したいものだけにしている。

## Tim Neuen

FPWD Form Control issuer。Apple で WebKit やってる人。View Transition や Dialog, Popover API などの実装をした人。

- ❓ : Form Control 何がむずかしい？
- Customizable Range むずい。Range の後に DatePicker の標準化が待ってる感じある。
- Button とか Select みたいに、見た目と In/Out がほぼ決まってるやつは、見た目を標準化するのも大変だけど楽な方ではある
- ただ、いろんなバリエーションが見た目的にも機能的にもある Multi Range や Date Picker は鬼むずくて、誰もやろうとしない。Open UI では DatePicker は Research はあるけど Proposal は出てないし、、、Range に手をつけた Brecht はすごいみたいな話をしてた
- ❓ : `view-transition-name: auto;` 、どういう経緯で WebKit 実装したの？早すぎたのでは？
- CSSWG で resolve した後に TAG で Jake が謎に色々言い出して困った（笑）
- Elika (fantasai) vs Jake の構図
- Blink が実装しないだろうから、クロスブラウザでサポートはないだろうな〜とのこと。
- saku 的には Google に実装を push する価値ある提案だと思う？って Josh に聞かれた
- auto は match-element attr(id) の Syntax Sugar 的なものだと思ってるから、私ならそこまで実装を convince するモチベないかもな〜と答えた。なくてもいい代替がある。
- ❓ : 古い iPhone、OS のアップデートができなくて Safari のアップデートもできなくて詰むんだけど、Safari バックポートしたりできないの？
- できたらいいんだけど、、、WebKit のコアでハードウェアに依存したライブラリを使ってるから厳しい。ごめん。
- CSS Carousel の話も Tim とした記憶がある。Sara Soueidan が CSS Carousel ではなく HTML Carousel にすべきというブログ書いてたけど、Sara の提案は後々受け入れられることがあるから、ワンチャンあるかもね〜とのことだった。

## Brecht

Open UI のひと。Customizable Range 周りを進めている。

- Mia とのやりとりを忘れたくなくて、懇親会一旦抜けてメモしてたら、”Are you playing something with CSS?” って Brecht から話しかけにきてくれた・・・！そんなことある？！
- スピーカーだったので、今日のトークのこととか、OpenUI での Range proposal が難しそうという話とか CSS Carousels の A11y の話とかしてた
- そうしたら、登壇者限定のバッジと特大 Rebecca CSS、特別にあげるよ！と！嬉しかった〜

![Brecht からもらったスピーカバッジとステッカー](/images/speaker-badges-steckers.png)

- Range は input type=range に state で段階つけるのに周りが賛成しなくて rangegroup を作って Progressive Enhancement することになったんだけど、最初は納得いってなかったんだよねというお気持ちの話とか、
- Carousel は ship 早かったよね、Google I/O に間に合わせるため？でもまだいろんな問題あるよね？という話になって、Adam めっちゃいい奴だから聞こうよ！っていってくれて、 Adam Argyle を呼んでくれた
  - Adam は他の人が一緒にいたから Carousel の話できなかったけど、「Talk to you tomorrow!」 ってハイタッチして終わった
- 日本に関しては、コリスさんが Brecht の以下の記事を訳したくて連絡を取られたのが印象に残ってるらしい
  - [Going beyond pixels and (r)ems in CSS - Relative length units based on font - iO tech_hub](https://techhub.iodigital.com/articles/going-beyond-pixels-and-rems-in-css/relative-length-units-based-on-font)

## Brad Frost

Atomic Design のひと。Global Design System の提唱者。

- ❓ : Reset CSS の置き場として GDS は妥当だと思うんだけど、どう？を聞いた
- Reset CSS、良さそう。諸々に依存しないグローバルなコンポーネントライブラリを目指しているから、ブラウザ間の UA Style 差分をなくすことは必要。
- 明確なプロポーザルは出てないけど自ずとやるべきことになりそう、とのこと
- ❓ : GDS は WC の触媒になり得る？に関して聞いた
- そう思う。とのこと。
- OpenUI の人たちには2種類人種がいる気がしてて、Brad みたいにアイディアを持ってきてリアルワールドから提案をしていく人＋ spec people や implementers みたいにもっと具体レベルで標準化を進める人がいる
- だから、具体段階で WC に足りないところとかが出てきたら対応できるレイヤーは整っている。とのこと

## Bramus

Google の DevRel。 WG で Scroll Driven Animation, View Transition の議論や記事を書いている。 I/O でアニメーション系の発表してた人。

- ❓ : BlinkOn で Bramus が提案していた CSS Parser API について TypedOM と絡めて聞いた
- TypedOM は Parse された後にどうするかみたいなところを扱うので、Parser API がしようとしていることとは異なる。
- Parse の段階で undefined なプロパティを見つけて、 計算して、値を返して、使えるようにする。IVACT をバイパスする方法として新規だと思う。とのこと
- BlinkOn からのアプデは特になしだが、会期中の感触は（特に Brian Kardell の感触が）良かったっぽい
  - Brian は Extensible Web Manifesto やってたから
- August の F2F でやるかやらないか、詳細話し合って決めるらしい
  - やるってなったらユースケースいっぱいあげて、コントリビュートしてねとのこと

:::

# 全体を通して

今回のカンファレンスで最も大事にしていたことは、「人脈作り」でした。

CSSWG, WHATWG の Spec Writers、Google, Apple, MS などの業界を牽引するブラウザベンダのエンジニアから、普段考えていることについてどういう回答をもらえるか、そこでどういう人脈づくりができるかに、現地参加最大の価値を置いていました。

事前に「誰と」「何を」話したいかの項目をいくつか練っていき、セッションの合間やアフターパーティーの時間を使ってディスカッションをしていました。普段 Working Group や Intent to whatever のメールを見て一方的に知っている著名な人たちと、想像以上に有意義なディスカッションができたことには、非常に驚きました。数人とは、その後も連絡を取るような仲にまでなれて、とても嬉しかったです。

また、他の参加者との偶発的な出会いや会話からも、学びや Next Action につながる情報が得られました。ヨーロッパで開催されていることもあり、日本とまた違った Tech 事情を見聞できたり、CERN への行き方を教えてくれた親切な人もいて、実際に滞在期間中に CERN に行きが実現したりもしました。

もちろん、各セッションも非常に貴重な内容ばかりで、まだ国内だと CSS/Web 標準周りのイベント自体が稀有な中、仕様策定者・ブラウザベンダが直接介入するイベントは、非常に価値のあるものでした。各トークの後には Q&A セッションも設けられていて、トークの内容から飛躍した深い内容の議論が繰り広げられており、これもまた現地参加で聞けたメリットのひとつだったなと思います。

![Speakers](/images/speakers.png)

---

CSS のみならず、Web を支える技術や社会情勢は、止まることなく変化し続けます。私たちはその変化に向き合い、より良いプロダクト、より良い Web を作るために日々試行錯誤しているはずです。

だからこそ、仕様やブラウザエンジンの上で試行錯誤する人たちから、その背景にある哲学や本質を学ぶことは、絶え間なく変化する Web の行く末を少しでも予測し、現状を理解するためにも非常に重要なことだと改めて感じました。

最後に、膨大な準備時間を割いて、素晴らしいトークをしてくださったスピーカーの方々、場を設けてくださった運営の方々、参加を実現してくださった会社の方々、とても貴重な経験をありがとうございました！✨

Thank you to all the supporters and people who make the Web better!✨

# 最後に

サイボウズの開発組織やフロントエンドチームの取り組みについての記事は Cybozu Inside Out、Zenn サイボウズフロントエンド で公開しています。ぜひご覧ください。

https://blog.cybozu.io/

https://zenn.dev/p/cybozu_frontend

また、サイボウズのデザイン組織やメンバーの取り組みについての記事は kintone Design Magazine、Cybozu Product Design Magazine で公開しています。こちらもぜひご覧ください。

https://note.com/cybozu_design/m/mc12622f890cf

https://note.com/cybozu_design/m/mdc4ac766dcfc

サイボウズでは一緒に働くメンバーも募集しています。
「チームワークあふれる社会を創る」という理念のもと活動することにご興味のある方をお待ちしています！

https://cybozu.co.jp/recruit/entry/career/product-designer.html

https://cybozu.co.jp/recruit/entry/career/front-end-engineer-kintone.html

https://cybozu.co.jp/recruit/entry/career/front-end-expert.html

https://cybozu.co.jp/recruit/entry/career/design-technologist.html
