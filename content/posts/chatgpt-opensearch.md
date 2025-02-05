---
title: "ChatGPTのOpenSearch.xmlを自作した"
date: "2025-02-04"
layout: with-opensearch
opensearchFile: "chatgpt-opensearch.xml"
opensearchTitle: "Search with ChatGPT"
---

# ChatGPT OpenSearch

ChatGPTはOpenSearchに対応していないので自作した。

```xml
<OpenSearchDescription
  xmlns="http://a9.com/-/spec/opensearch/1.1/"
  xmlns:moz="http://www.mozilla.org/2006/browser/search/"
>
  <ShortName>ChatGPT</ShortName>
  <Description>Ask ChatGPT</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/x-icon">
    https://chatgpt.com/favicon.ico
  </Image>
  <Url
    type="text/html"
    method="get"
    template="https://chatgpt.com/?q={searchTerms}"
  />
  <moz:SearchForm>https://chatgpt.com/</moz:SearchForm>
</OpenSearchDescription>
```

このページのヘッダーにこのXMLをリンクしているので、アドレスバーを右クリックするとChatGPTの検索エンジンを追加できる。
