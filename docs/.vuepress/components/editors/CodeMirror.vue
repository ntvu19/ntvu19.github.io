<template>
    <div class="code-mirror-wrapper">
        <!-- Loading indicator -->
        <div v-if="loading" class="loading-indicator">
            <div class="spinner"></div>
            <span>Loading code...</span>
        </div>

        <!-- Error display -->
        <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            <span>{{ error }}</span>
            <button @click="clearError" class="clear-error-btn">×</button>
        </div>

        <!-- Controls -->
        <div v-if="showControls" class="controls">
            <div class="control-group">
                <label for="language-select">Language:</label>
                <select id="language-select" v-model="selectedLanguage" @change="updateLanguage"
                    class="language-selector">
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="go">Go</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="markdown">Markdown</option>
                    <option value="json">JSON</option>
                </select>
            </div>

            <div class="control-group">
                <label for="theme-select">Theme:</label>
                <select id="theme-select" v-model="selectedTheme" @change="updateTheme" class="theme-selector">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

            <div class="control-group">
                <button @click="formatCode" class="format-btn" :disabled="!canFormat">
                    Format
                </button>
                <button @click="copyCode" class="copy-btn">
                    {{ copyButtonText }}
                </button>
                <button v-if="showResetButton" @click="resetCode" class="reset-btn">
                    Reset
                </button>
            </div>
        </div>

        <!-- CodeMirror Editor -->
        <div ref="editor" class="code-editor" :class="{ 'dark-theme': selectedTheme === 'dark' }" :style="editorStyles">
        </div>

        <!-- Status bar -->
        <div v-if="showStatusBar" class="status-bar">
            <span class="cursor-position">Line {{ cursorLine }}, Column {{ cursorColumn }}</span>
            <span class="document-info">{{ documentLength }} characters</span>
            <span class="language-info">{{ selectedLanguage.toUpperCase() }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Extension, StateEffect } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { go } from '@codemirror/lang-go'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { markdown } from '@codemirror/lang-markdown'
import { json } from '@codemirror/lang-json'

// Props definition
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
    // Data source props
    sourceType?: 'text' | 'file' | 'url'
    filePath?: string
    url?: string
    // Styling props
    backgroundColor?: string
    textColor?: string
    borderColor?: string
    borderRadius?: string
    customStyles?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    language: 'cpp',
    theme: 'light',
    height: '400px',
    width: '100%',
    fontSize: '14px',
    tabSize: 2,
    lineNumbers: true,
    lineWrapping: true,
    readOnly: false,
    placeholder: 'Enter your code here...',
    showControls: true,
    showStatusBar: true,
    showResetButton: false,
    autoFormat: false,
    sourceType: 'text'
})

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: string]
    'change': [value: string]
    'focus': [event: FocusEvent]
    'blur': [event: FocusEvent]
    'ready': [editor: EditorView]
    'error': [error: string]
}>()

// Reactive state
const editor = ref<HTMLElement>()
const editorView = ref<EditorView>()
const selectedLanguage = ref(props.language)
const selectedTheme = ref(props.theme)
const loading = ref(false)
const error = ref('')
const cursorLine = ref(1)
const cursorColumn = ref(1)
const documentLength = ref(0)
const copyButtonText = ref('Copy')
const originalCode = ref('')

// Computed properties
const editorStyles = computed(() => ({
    height: props.height,
    width: props.width,
    fontSize: props.fontSize,
    backgroundColor: props.backgroundColor,
    color: props.textColor,
    border: props.borderColor ? `1px solid ${props.borderColor}` : undefined,
    borderRadius: props.borderRadius,
    ...props.customStyles
}))

const canFormat = computed(() => {
    return ['javascript', 'json', 'cpp', 'java'].includes(selectedLanguage.value)
})

// Language extensions mapping
const getLanguageExtension = (lang: string): Extension => {
    const extensions: Record<string, () => Extension> = {
        cpp: () => cpp(),
        java: () => java(),
        go: () => go(),
        javascript: () => javascript(),
        python: () => python(),
        markdown: () => markdown(),
        json: () => json()
    }

    return extensions[lang]?.() || cpp()
}

// Load code from different sources
const loadCodeFromSource = async (): Promise<string> => {
    loading.value = true
    error.value = ''

    try {
        switch (props.sourceType) {
            case 'file':
                if (!props.filePath) throw new Error('File path is required for file source type')
                return await loadFromFile(props.filePath)

            case 'url':
                if (!props.url) throw new Error('URL is required for URL source type')
                return await loadFromUrl(props.url)

            case 'text':
            default:
                return props.modelValue || ''
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        error.value = errorMessage
        emit('error', errorMessage)
        return ''
    } finally {
        loading.value = false
    }
}

const loadFromFile = async (filePath: string): Promise<string> => {
    // In a real implementation, you'd use a file API or server endpoint
    // For now, this is a placeholder that shows how it could work
    try {
        const response = await fetch(`/api/files/${encodeURIComponent(filePath)}`)
        if (!response.ok) throw new Error(`Failed to load file: ${response.statusText}`)
        return await response.text()
    } catch (err) {
        throw new Error(`Could not load file ${filePath}: ${err}`)
    }
}

const loadFromUrl = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch from URL: ${response.statusText}`)
        return await response.text()
    } catch (err) {
        throw new Error(`Could not load from URL ${url}: ${err}`)
    }
}

// Editor setup and management
const createEditor = async () => {
    if (!editor.value) return

    const code = await loadCodeFromSource()
    originalCode.value = code

    const extensions: Extension[] = [
        basicSetup,
        getLanguageExtension(selectedLanguage.value),
        EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                const newValue = update.state.doc.toString()
                emit('update:modelValue', newValue)
                emit('change', newValue)
                documentLength.value = newValue.length

                // Update cursor position
                const selection = update.state.selection.main
                const line = update.state.doc.lineAt(selection.head)
                cursorLine.value = line.number
                cursorColumn.value = selection.head - line.from + 1
            }
        }),
        EditorView.theme({
            '&': {
                fontSize: props.fontSize,
            },
            '.cm-editor': {
                height: '100%',
            },
            '.cm-scroller': {
                fontFamily: 'Fira Code, Monaco, Consolas, "Ubuntu Mono", monospace',
            }
        })
    ]

    // Add theme
    if (selectedTheme.value === 'dark') {
        extensions.push(oneDark)
    }

    // Add read-only if specified
    if (props.readOnly) {
        extensions.push(EditorState.readOnly.of(true))
    }

    // Create editor state
    const state = EditorState.create({
        doc: code,
        extensions
    })

    // Create editor view
    editorView.value = new EditorView({
        state,
        parent: editor.value
    })

    // Initialize document length
    documentLength.value = code.length

    emit('ready', editorView.value)
}

const updateLanguage = async () => {
    if (!editorView.value) return

    const newExtensions = [
        basicSetup,
        getLanguageExtension(selectedLanguage.value),
        selectedTheme.value === 'dark' ? oneDark : [],
        props.readOnly ? EditorState.readOnly.of(true) : [],
        EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                const newValue = update.state.doc.toString()
                emit('update:modelValue', newValue)
                emit('change', newValue)
                documentLength.value = newValue.length
            }
        })
    ].flat()

    editorView.value.dispatch({
        effects: StateEffect.reconfigure.of(newExtensions)
    })
}

const updateTheme = () => {
    updateLanguage() // This will also update the theme
}

// Utility functions
const formatCode = () => {
    if (!editorView.value) return

    const code = editorView.value.state.doc.toString()
    let formattedCode = code

    // Basic formatting for different languages
    try {
        switch (selectedLanguage.value) {
            case 'json':
                formattedCode = JSON.stringify(JSON.parse(code), null, props.tabSize)
                break
            case 'javascript':
                // Basic JavaScript formatting (you might want to use a proper formatter like Prettier)
                formattedCode = code.replace(/;/g, ';\n').replace(/{/g, '{\n').replace(/}/g, '\n}')
                break
            // Add more formatters as needed
        }

        editorView.value.dispatch({
            changes: {
                from: 0,
                to: editorView.value.state.doc.length,
                insert: formattedCode
            }
        })
    } catch (err) {
        error.value = 'Failed to format code: Invalid syntax'
    }
}

const copyCode = async () => {
    if (!editorView.value) return

    const code = editorView.value.state.doc.toString()

    try {
        await navigator.clipboard.writeText(code)
        copyButtonText.value = 'Copied!'
        setTimeout(() => {
            copyButtonText.value = 'Copy'
        }, 2000)
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = code
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        copyButtonText.value = 'Copied!'
        setTimeout(() => {
            copyButtonText.value = 'Copy'
        }, 2000)
    }
}

const resetCode = () => {
    if (!editorView.value) return

    editorView.value.dispatch({
        changes: {
            from: 0,
            to: editorView.value.state.doc.length,
            insert: originalCode.value
        }
    })
}

const clearError = () => {
    error.value = ''
}

// Lifecycle
onMounted(async () => {
    await nextTick()
    await createEditor()
})

onUnmounted(() => {
    if (editorView.value) {
        editorView.value.destroy()
    }
})

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
    if (editorView.value && newValue !== editorView.value.state.doc.toString()) {
        editorView.value.dispatch({
            changes: {
                from: 0,
                to: editorView.value.state.doc.length,
                insert: newValue || ''
            }
        })
    }
})

watch(() => [props.language, props.theme], () => {
    selectedLanguage.value = props.language
    selectedTheme.value = props.theme
    updateLanguage()
})

// Expose methods for parent components
defineExpose({
    getEditor: () => editorView.value,
    getValue: () => editorView.value?.state.doc.toString() || '',
    setValue: (value: string) => {
        if (editorView.value) {
            editorView.value.dispatch({
                changes: {
                    from: 0,
                    to: editorView.value.state.doc.length,
                    insert: value
                }
            })
        }
    },
    focus: () => editorView.value?.focus(),
    formatCode,
    copyCode,
    resetCode
})
</script>

<style scoped>
.code-mirror-wrapper {
    display: flex;
    flex-direction: column;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    overflow: hidden;
    background: #ffffff;
    font-family: system-ui, -apple-system, sans-serif;
}

.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 0.5rem;
    background: #f8f9fa;
    color: #6c757d;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e9ecef;
    border-top: 2px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f8d7da;
    color: #721c24;
    border-bottom: 1px solid #f5c6cb;
    font-size: 14px;
}

.error-icon {
    font-size: 16px;
}

.clear-error-btn {
    margin-left: auto;
    background: none;
    border: none;
    color: #721c24;
    cursor: pointer;
    font-size: 18px;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.clear-error-btn:hover {
    background: rgba(114, 28, 36, 0.1);
}

.controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    flex-wrap: wrap;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.control-group label {
    font-size: 14px;
    font-weight: 500;
    color: #495057;
    white-space: nowrap;
}

.language-selector,
.theme-selector {
    padding: 0.375rem 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background: white;
    font-size: 14px;
    color: #495057;
    cursor: pointer;
}

.language-selector:focus,
.theme-selector:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.format-btn,
.copy-btn,
.reset-btn {
    padding: 0.375rem 0.75rem;
    border: 1px solid #007bff;
    border-radius: 4px;
    background: #007bff;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.format-btn:hover,
.copy-btn:hover,
.reset-btn:hover {
    background: #0056b3;
    border-color: #0056b3;
}

.format-btn:disabled {
    background: #6c757d;
    border-color: #6c757d;
    cursor: not-allowed;
}

.reset-btn {
    background: #dc3545;
    border-color: #dc3545;
}

.reset-btn:hover {
    background: #c82333;
    border-color: #bd2130;
}

.code-editor {
    flex: 1;
    min-height: 200px;
    position: relative;
}

.code-editor.dark-theme {
    background: #282c34;
}

.status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 12px;
    color: #6c757d;
}

.cursor-position,
.document-info,
.language-info {
    white-space: nowrap;
}

/* Dark theme adjustments */
.code-mirror-wrapper.dark-theme {
    background: #1e1e1e;
    border-color: #404040;
}

.dark-theme .controls {
    background: #2d2d30;
    border-bottom-color: #404040;
}

.dark-theme .status-bar {
    background: #2d2d30;
    border-top-color: #404040;
    color: #cccccc;
}

.dark-theme .control-group label {
    color: #cccccc;
}

.dark-theme .language-selector,
.dark-theme .theme-selector {
    background: #3c3c3c;
    border-color: #404040;
    color: #cccccc;
}

/* Responsive design */
@media (max-width: 768px) {
    .controls {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
    }

    .control-group {
        justify-content: space-between;
    }

    .status-bar {
        flex-direction: column;
        gap: 0.25rem;
        align-items: flex-start;
    }
}
</style>
