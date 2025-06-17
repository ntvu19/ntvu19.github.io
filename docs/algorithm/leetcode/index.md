---
lang: en-US
title: LeetCode
---

- Refer to: [LeetCode](https://leetcode.com/)

## Java Example from Local File

<CodeMirror 
  source-type="file"
  :file-path="'examples/algorithms/binary_search.java'"
  language="java"
  theme="dark"
  height="350px"
  :showStatusBar="true"
  :showResetButton="true" 
  @error="(error) => console.log('Failed to load Java example:', error)"
/>

## JavaScript Example from Local File

<CodeMirror 
  source-type="file"
  :file-path="'examples/algorithms/binary_search.js'"
  language="javascript"
  :readOnly="true"
  :showControls="false"
  height="300px"
  backgroundColor="#f1f3f4"
  @error="(error) => console.log('Failed to load JavaScript example:', error)"
/>
