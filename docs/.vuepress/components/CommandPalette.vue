<template>
    <GlobalModal ref="modalRef">
        <div class="command-palette">
            <h2>Command Palette</h2>
            <div class="search-box">
                <input ref="searchInput" type="text" placeholder="Type a command..." v-model="searchQuery"
                    @keydown="handleKeydown">
            </div>
            <div class="commands-list">
                <div v-for="(command, index) in filteredCommands" :key="command.id" class="command-item"
                    :class="{ active: index === activeIndex }" @click="executeCommand(command)"
                    @mouseenter="activeIndex = index">
                    <span class="command-title">{{ command.title }}</span>
                    <span class="command-shortcut">{{ command.shortcut }}</span>
                </div>
            </div>
            <div v-if="filteredCommands.length === 0" class="no-results">
                No commands found
            </div>
        </div>
    </GlobalModal>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import GlobalModal from './GlobalModal.vue'

const router = useRouter()
const searchQuery = ref('')
const modalRef = ref(null)
const searchInput = ref(null)
const activeIndex = ref(0)

const toggleDarkMode = () => {
    return;

    // TODO: Implement dark mode toggle later
    const html = document.documentElement
    if (html.classList.contains('dark')) {
        html.classList.remove('dark')
        localStorage.setItem('vuepress-theme-appearance', 'light')
    } else {
        html.classList.add('dark')
        localStorage.setItem('vuepress-theme-appearance', 'dark')
    }
}

const commands = [
    {
        id: 1,
        title: 'Go to Home',
        shortcut: 'Enter',
        action: () => router.push('/')
    },
    {
        id: 2,
        title: 'Toggle Dark Mode',
        shortcut: '⌘ D',
        action: toggleDarkMode
    },
    {
        id: 3,
        title: 'Go to Programming',
        shortcut: '',
        action: () => router.push('/programming/')
    },
    {
        id: 4,
        title: 'Go to Database',
        shortcut: '',
        action: () => router.push('/database/')
    },
    {
        id: 5,
        title: 'Go to Networking',
        shortcut: '',
        action: () => router.push('/networking/')
    },
    {
        id: 6,
        title: 'Go to Operating System',
        shortcut: '',
        action: () => router.push('/operating-system/')
    }
]

const filteredCommands = computed(() => {
    return commands.filter(command =>
        command.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const executeCommand = (command) => {
    command.action()
    // Close modal after executing command
    if (modalRef.value) {
        modalRef.value.closeModal()
    }
    // Reset search
    searchQuery.value = ''
    activeIndex.value = 0
}

const executeFirstCommand = () => {
    if (filteredCommands.value.length > 0) {
        executeCommand(filteredCommands.value[activeIndex.value])
    }
}

const executeFirstResult = () => {
    if (filteredCommands.value.length > 0) {
        executeCommand(filteredCommands.value[0])
    }
}

const navigateUp = () => {
    if (activeIndex.value > 0) {
        activeIndex.value--
    } else {
        activeIndex.value = filteredCommands.value.length - 1
    }
}

const navigateDown = () => {
    if (activeIndex.value < filteredCommands.value.length - 1) {
        activeIndex.value++
    } else {
        activeIndex.value = 0
    }
}

const handleKeydown = (event) => {
    event.stopPropagation()

    // Handle Ctrl + Enter to execute first result
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        executeFirstResult()
        return
    }

    // Handle regular Enter to execute selected command
    if (event.key === 'Enter') {
        event.preventDefault()
        executeFirstCommand()
        return
    }

    // Handle arrow navigation
    if (event.key === 'ArrowUp') {
        event.preventDefault()
        navigateUp()
        return
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault()
        navigateDown()
        return
    }
}

// Focus search input when modal opens
const focusSearchInput = () => {
    nextTick(() => {
        if (searchInput.value) {
            searchInput.value.focus()
        }
    })
}

// Watch for modal opening and focus input
onMounted(() => {
    if (modalRef.value) {
        // Watch the modal's isOpen state
        watch(
            () => modalRef.value?.isOpen,
            (isOpen) => {
                if (isOpen) {
                    focusSearchInput()
                }
            },
            { immediate: true }
        )
    }
})
</script>

<style scoped>
.command-palette {
    color: #2c3e50;
    min-height: 300px;
}

html.dark .command-palette {
    color: #f0f6fc;
}

.search-box {
    margin-bottom: 1rem;
}

.search-box input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #2c3e50;
    outline: none;
    transition: border-color 0.2s;
}

.search-box input:focus {
    border-color: #3eaf7c;
    box-shadow: 0 0 0 2px rgba(62, 175, 124, 0.2);
}

html.dark .search-box input {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #f0f6fc;
}

.commands-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.command-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
    border: 1px solid transparent;
}

.command-item:hover,
.command-item.active {
    background-color: rgba(62, 175, 124, 0.1);
    border-color: rgba(62, 175, 124, 0.3);
}

html.dark .command-item:hover,
html.dark .command-item.active {
    background-color: rgba(62, 175, 124, 0.2);
}

.command-title {
    font-weight: 500;
}

.command-shortcut {
    font-size: 0.85rem;
    color: #6b7280;
    background: rgba(0, 0, 0, 0.05);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
}

html.dark .command-shortcut {
    color: #9ca3af;
    background: rgba(255, 255, 255, 0.1);
}

.no-results {
    text-align: center;
    color: #6b7280;
    font-style: italic;
    padding: 2rem;
}

html.dark .no-results {
    color: #9ca3af;
}
</style>