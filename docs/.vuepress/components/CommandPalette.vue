<template>
    <GlobalModal>
        <div class="command-palette">
            <h2>Command Palette</h2>
            <div class="search-box">
                <input type="text" placeholder="Type a command..." v-model="searchQuery" @keydown.stop>
            </div>
            <div class="commands-list">
                <div v-for="command in filteredCommands" :key="command.id" class="command-item"
                    @click="executeCommand(command)">
                    <span class="command-title">{{ command.title }}</span>
                    <span class="command-shortcut">{{ command.shortcut }}</span>
                </div>
            </div>
        </div>
    </GlobalModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import GlobalModal from './GlobalModal.vue'

const router = useRouter()
const searchQuery = ref('')

const commands = [
    {
        id: 1,
        title: 'Go to Home',
        shortcut: '⌘ H',
        action: () => router.push('/')
    },
    {
        id: 2,
        title: 'Toggle Dark Mode',
        shortcut: '⌘ D',
        action: () => {
            // Implement dark mode toggle
        }
    },
    // Add more commands as needed
]

const filteredCommands = computed(() => {
    return commands.filter(command =>
        command.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const executeCommand = (command) => {
    command.action()
}
</script>

<style scoped>
.command-palette {
    color: var(--c-text);
}

.search-box {
    margin-bottom: 1rem;
}

.search-box input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid var(--c-border);
    border-radius: 4px;
    background: var(--c-bg);
    color: var(--c-text);
}

.commands-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.command-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.command-item:hover {
    background-color: var(--c-brand-light);
}

.command-shortcut {
    font-size: 0.9rem;
    color: var(--c-text-lighter);
}
</style>