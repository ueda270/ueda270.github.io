---
title: "GitHub Pagesのブログ記事ごとにOpenGraph画像を生成する"
date: "2025-04-09"
---

## はじめに

ブログ記事をSNSでシェアする際、リンク先のプレビュー画像が表示されているのをよく目にします。

例: はてな匿名ダイアリー ![参考:はてな匿名ダイアリーのOpenGraph画像](./images/hatena-anon-og-image-1500.gif)

この画像の設定方法は Open Graph Protocol (OGP) で決められています。
本記事では、GitHub PagesでホストされているHugoによるブログに対して、記事ごとにカスタム画像を自動生成しOGPに設定する方法を紹介します。


## OpenGraphとは

OpenGraphは、FacebookやTwitterなどのSNSでWebページがどのように表示されるかを制御するためのプロトコルです。HTMLヘッダーに`og:image`などのメタタグを使用することで、シェアされた際のプレビュー画像やタイトル、説明文をカスタマイズできます。

## 実装方法の概要

今回実装するシステムは以下の要素で構成されています：

1. **Hugo用のOpenGraphテンプレート**: 各ページに適切なOGメタタグを追加
2. **画像生成スクリプト**: 記事タイトルを使用してOG画像を生成
3. **GitHub Actions**: コンテンツが更新されたときに自動的に画像を生成

## 1. Hugoテンプレートの設定

まず、HugoのテンプレートにOpenGraphメタタグを追加します。PaperModテーマを使用している場合、`layouts/partials/templates/opengraph.html`を作成または編集します。

このテンプレートでは、記事のタイプやファイル構造に基づいて適切なOG画像パスを決定します。以下は重要な部分の抜粋です：

```html
{{/* Custom OpenGraph Image Logic */}}
{{- $ogImagePath := "" }}
{{- if .IsPage }}
  {{- $section := .Section }}
  {{- $relativePath := .File.Path }}
  {{- $baseName := path.Base .File.Path }}
  {{- $dirName := path.Dir .File.Path }}
  
  {{/* Handle index.md files specially */}}
  {{- $outputFileName := $baseName }}
  {{- if eq $baseName "index.md" }}
    {{- $outputFileName = path.Base $dirName }}
    {{- $ogImagePath = printf "/og-images/posts/%s/%s.png" (path.Base $dirName) $outputFileName }}
  {{- else }}
    {{- $outputFileName = strings.TrimSuffix ".md" $baseName }}
    {{- $ogImagePath = printf "/og-images/posts/%s.png" $outputFileName }}
  {{- end }}
  
  {{- $ogImageFullPath := printf "static%s" $ogImagePath }}
  
  {{/* Check if the OG image exists, otherwise use default */}}
  {{- if not (fileExists $ogImageFullPath) }}
    {{- $ogImagePath = "/og-images/about.png" }}
  {{- end }}
{{- else }}
  {{/* For non-page content like about.md */}}
  {{- $pageName := .Name }}
  {{- $specificOgImage := printf "/og-images/%s.png" $pageName }}
  {{- $specificOgImageFullPath := printf "static%s" $specificOgImage }}
  
  {{- if fileExists $specificOgImageFullPath }}
    {{- $ogImagePath = $specificOgImage }}
  {{- else }}
    {{- $ogImagePath = "/og-images/about.png" }}
  {{- end }}
{{- end }}

<meta property="og:image" content="{{ $ogImagePath | absURL }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

このテンプレートは以下のことを行います：

1. 記事ページかどうかを判断
2. 記事のMarkdownファイルパスから適切な画像パスを取得 (今回は2.で `/og-images/posts/<post-filename>.png` に画像を生成するのでそのパスを指定します。)
3. 画像が存在するかチェックし、存在しない場合はデフォルト画像を使用
4. 適切なOGメタタグを出力

## 2. 画像生成スクリプトの作成

次に記事タイトルからOG画像を生成するスクリプトを作成します。
今回はNode.js+canvasで作成しましたが、Python+OpenCVなどでも可能です。
また今回はGitHub Pagesリポジトリ内の、`scripts/og-image-generator`ディレクトリにスクリプトを配置します。

スクリプトの主な機能は以下の通りです：

- 記事のマークダウンファイルからタイトルを抽出
- canvasライブラリを使用して画像を生成
- 生成した画像を適切なディレクトリに保存

実装例 (一部)
```typescript
// 抜粋
export async function generateOgImage(
  title: string,
  outputPath: string,
  config: Config,
  language: string = "en"
): Promise<void> {
  // キャンバスの作成
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext("2d");

  // 背景画像の読み込み
  const backgroundImage = await loadImage(config.defaultBackground);
  ctx.drawImage(backgroundImage, 0, 0, config.width, config.height);

  // タイトルの描画（テキストラッピング処理など）
  // ...

  // 画像の保存
  const buffer = canvas.toBuffer("image/png");
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, buffer);
}
```

## 3. GitHub Actionsによる自動化

最後に、GitHub Actionsを使用して画像生成プロセスを自動化します。`.github/workflows/generate-og-images.yml`ファイルを作成します：

```yaml
name: Generate OpenGraph Images

on:
  push:
    branches: ["main"]
    paths:
      - 'content/**/*.md'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate-og-images:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: scripts/og-image-generator/package.json

      - name: Install dependencies for canvas
        run: |
          sudo apt-get update
          sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

      - name: Install dependencies
        working-directory: scripts/og-image-generator
        run: npm install

      - name: Generate OpenGraph images
        working-directory: scripts/og-image-generator
        run: npm run generate

      - name: Commit and push changes
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add static/og-images
          git diff --quiet && git diff --staged --quiet || (git commit -m "Update OpenGraph images and fonts" && git push)
```

ワークフローの主な処理内容：

1. リポジトリのチェックアウト
2. Node.jsのセットアップ
3. canvasライブラリに必要な依存関係のインストール
4. スクリプトの依存関係のインストール
5. OG画像の生成
6. 変更があった場合、生成された画像をコミットしてプッシュ

## 実装のポイント

記事のファイル構造に応じて適切な画像パスを生成するロジックを実装しています。特に、`index.md`ファイルと通常の`.md`ファイルで異なる処理を行っています。

## まとめ

GitHub PagesでホストされているHugoブログに対して、記事ごとにカスタムOpenGraph画像を自動生成する方法を紹介しました。

また、GitHub Actionsを活用することで、記事を追加したときも自動で画像生成されます。

この記事に生成される画像はこんな感じです。 ![この記事のOGP用画像](./images/generate-opengraph-image-for-github-pages.png)
