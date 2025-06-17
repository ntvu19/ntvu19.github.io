# CodeMirror Vue Component

A comprehensive, customizable CodeMirror 6 component for Vue 3 applications with support for multiple programming languages, themes, and data sources.

## Features

- ✅ **Multi-language support**: C++, Java, Go, JavaScript, Python, Markdown, JSON
- ✅ **Multiple data sources**: Raw text, file loading, URL fetching
- ✅ **Theme support**: Light and dark themes
- ✅ **Customizable styling**: Colors, fonts, dimensions, borders
- ✅ **Built-in controls**: Language selector, theme switcher, format/copy/reset buttons
- ✅ **Real-time editing**: Two-way data binding with Vue reactivity
- ✅ **Status bar**: Cursor position, document length, language info
- ✅ **Accessibility**: Keyboard navigation, screen reader support
- ✅ **Responsive design**: Mobile-friendly layout

## Installation

The component requires CodeMirror 6 packages. Install them using:

```bash
npm install --legacy-peer-deps codemirror @codemirror/state @codemirror/view @codemirror/basic-setup @codemirror/theme-one-dark @codemirror/lang-cpp @codemirror/lang-java @codemirror/lang-go @codemirror/lang-javascript @codemirror/lang-python @codemirror/lang-markdown @codemirror/lang-json
```

## Basic Usage

### Simple Text Editor

```vue
<template>
  <CodeMirror 
    v-model="code"
    language="cpp"
    height="400px"
  />
</template>

<script setup>
import { ref } from 'vue'
import CodeMirror from './CodeMirror.vue'

const code = ref(`#include <iostream>
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`)
</script>
```

### Loading from URL

```vue
<template>
  <CodeMirror 
    source-type="url"
    :url="'https://raw.githubusercontent.com/user/repo/main/example.cpp'"
    language="cpp"
    @ready="onEditorReady"
    @error="onError"
  />
</template>

<script setup>
const onEditorReady = (editor) => {
  console.log('Editor is ready:', editor)
}

const onError = (error) => {
  console.error('Error loading code:', error)
}
</script>
```

### File Loading (requires backend API)

```vue
<template>
  <CodeMirror 
    source-type="file"
    :file-path="'./examples/sorting.cpp'"
    language="cpp"
    :show-reset-button="true"
  />
</template>
```

## Props

### Basic Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The code content (v-model) |
| `language` | `string` | `'cpp'` | Programming language |
| `theme` | `string` | `'light'` | Editor theme |
| `height` | `string` | `'400px'` | Editor height |
| `width` | `string` | `'100%'` | Editor width |
| `readOnly` | `boolean` | `false` | Make editor read-only |

### Language Support

Supported languages: `cpp`, `java`, `go`, `javascript`, `python`, `markdown`, `json`

### Data Source Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sourceType` | `string` | `'text'` | Source type: `'text'`, `'file'`, `'url'` |
| `filePath` | `string` | - | File path (when `sourceType='file'`) |
| `url` | `string` | - | URL to fetch code from |

### Customization Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fontSize` | `string` | `'14px'` | Font size |
| `tabSize` | `number` | `2` | Tab size |
| `backgroundColor` | `string` | - | Background color |
| `textColor` | `string` | - | Text color |
| `borderColor` | `string` | - | Border color |
| `borderRadius` | `string` | - | Border radius |
| `customStyles` | `object` | `{}` | Additional CSS styles |

### UI Control Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showControls` | `boolean` | `true` | Show control bar |
| `showStatusBar` | `boolean` | `true` | Show status bar |
| `showResetButton` | `boolean` | `false` | Show reset button |
| `lineNumbers` | `boolean` | `true` | Show line numbers |
| `lineWrapping` | `boolean` | `true` | Enable line wrapping |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Code content changed |
| `change` | `string` | Code content changed |
| `ready` | `EditorView` | Editor initialized |
| `error` | `string` | Error occurred |
| `focus` | `FocusEvent` | Editor focused |
| `blur` | `FocusEvent` | Editor blurred |

## Methods

Access these methods using template refs:

```vue
<template>
  <CodeMirror ref="editorRef" />
  <button @click="formatCode">Format</button>
</template>

<script setup>
import { ref } from 'vue'

const editorRef = ref()

const formatCode = () => {
  editorRef.value.formatCode()
}
</script>
```

Available methods:
- `getValue()`: Get current code
- `setValue(code)`: Set code content
- `focus()`: Focus the editor
- `formatCode()`: Format the code
- `copyCode()`: Copy code to clipboard
- `resetCode()`: Reset to original code
- `getEditor()`: Get raw CodeMirror editor instance

## Advanced Examples

### Custom Styled Editor

```vue
<template>
  <CodeMirror 
    v-model="code"
    language="cpp"
    theme="dark"
    height="500px"
    font-size="16px"
    background-color="#1a1a1a"
    text-color="#ffffff"
    border-color="#333333"
    border-radius="12px"
    :custom-styles="{
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Fira Code, monospace'
    }"
  />
</template>
```

### Multiple Language Support

```vue
<template>
  <div>
    <select v-model="selectedLanguage">
      <option value="cpp">C++</option>
      <option value="java">Java</option>
      <option value="go">Go</option>
      <option value="javascript">JavaScript</option>
    </select>
    
    <CodeMirror 
      v-model="code"
      :language="selectedLanguage"
      height="400px"
      @change="onCodeChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const selectedLanguage = ref('cpp')
const code = ref('')

const codeTemplates = {
  cpp: '#include <iostream>\nint main() {\n    // Your C++ code here\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        // Your Java code here\n    }\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Your Go code here\n}',
  javascript: 'function main() {\n    // Your JavaScript code here\n}\n\nmain();'
}

watch(selectedLanguage, (newLang) => {
  if (!code.value) {
    code.value = codeTemplates[newLang]
  }
})

const onCodeChange = (newCode) => {
  console.log('Code changed:', newCode)
}
</script>
```

### Read-only Documentation

```vue
<template>
  <CodeMirror 
    :model-value="documentationCode"
    language="cpp"
    :read-only="true"
    :show-controls="false"
    height="300px"
    background-color="#f8f9fa"
  />
</template>

<script setup>
const documentationCode = `// Binary Search Algorithm
// Time Complexity: O(log n)
// Space Complexity: O(1)

int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1; // Not found
}`
</script>
```

## TypeScript Support

The component is fully typed with TypeScript interfaces:

```typescript
interface Props {
  modelValue?: string
  language?: 'cpp' | 'java' | 'go' | 'javascript' | 'python' | 'markdown' | 'json'
  theme?: 'light' | 'dark'
  height?: string
  width?: string
  fontSize?: string
  tabSize?: number
  lineNumbers?: boolean
  lineWrapping?: boolean
  readOnly?: boolean
  placeholder?: string
  showControls?: boolean
  showStatusBar?: boolean
  showResetButton?: boolean
  autoFormat?: boolean
  sourceType?: 'text' | 'file' | 'url'
  filePath?: string
  url?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: string
  customStyles?: Record<string, string>
}
```

## Styling

The component uses scoped CSS with CSS custom properties for easy theming:

```css
/* Override default styles */
.code-mirror-wrapper {
  --border-color: #e1e5e9;
  --background-color: #ffffff;
  --text-color: #333333;
}

/* Dark theme */
.code-mirror-wrapper.dark-theme {
  --border-color: #404040;
  --background-color: #1e1e1e;
  --text-color: #cccccc;
}
```

## Performance Considerations

- **Lazy Loading**: Consider lazy loading the component for better initial page load
- **Large Files**: For files >10MB, implement pagination or virtualization
- **Multiple Instances**: Each instance creates its own editor; use sparingly
- **Memory Management**: The component properly cleans up on unmount

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 12+)
- Internet Explorer: Not supported

## Contributing

When extending language support:

1. Install the language package: `npm install @codemirror/lang-{language}`
2. Import in the component: `import { language } from '@codemirror/lang-{language}'`
3. Add to the `getLanguageExtension` function
4. Update the language prop type and selector options

## License

This component is part of your VuePress documentation site and follows the same license. 