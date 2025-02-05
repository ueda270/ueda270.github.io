---
title: "Perplexity AIのOpenSearch.xmlを自作した"
date: "2025-02-04"
layout: with-opensearch
opensearchFile: "perplexity-opensearch.xml"
opensearchTitle: "Search with Perplexity AI"
---

# Perplexity AI OpenSearch

Perplexity AIの [opensearch.xml](https://www.perplexity.ai/opensearch.xml) が壊れているので自作した。

```xml
<OpenSearchDescription
  xmlns="http://a9.com/-/spec/opensearch/1.1/"
  xmlns:moz="http://www.mozilla.org/2006/browser/search/"
>
  <ShortName>Perplexity</ShortName>
  <Description>Ask Perplexity</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/x-icon">
    https://www.perplexity.ai/static/icons/favicon.ico
  </Image>
  <Url
    type="text/html"
    method="get"
    template="https://www.perplexity.ai/search/new?q={searchTerms}"
  />
  <moz:SearchForm>https://www.perplexity.ai/</moz:SearchForm>
</OpenSearchDescription>
```

このページのヘッダーにこのXMLをリンクしているので、アドレスバーを右クリックするとPerplexity AIの検索エンジンを追加できる。