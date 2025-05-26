<template>
    <ClientOnly>
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="isOpen" class="modal-overlay" @click="closeModal">
                    <div class="modal-content" @click.stop @wheel.passive @touchstart.passive @touchmove.passive
                        @scroll.passive>
                        <slot></slot>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const triggerKey = 'k' // You can change this to any key you want

const openModal = () => {
    isOpen.value = true
}

const closeModal = () => {
    isOpen.value = false
}

const handleKeyPress = (event) => {
    if (event.key.toLowerCase() === triggerKey && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        event.stopPropagation()

        if (!isOpen.value) {
            openModal()
        }
        return false
    }

    if (event.key === 'Escape' && isOpen.value) {
        closeModal()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeyPress, { capture: true })
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress, { capture: true })
})

defineExpose({
    openModal,
    closeModal,
    isOpen
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: #ffffff;
    color: #2c3e50;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    overscroll-behavior: contain;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Dark mode support */
html.dark .modal-content {
    background: #22272e;
    color: #f0f6fc;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Improve text readability in modal */
.modal-content h1,
.modal-content h2,
.modal-content h3,
.modal-content h4,
.modal-content h5,
.modal-content h6 {
    color: inherit;
    margin-top: 0;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: inherit;
    border-radius: 6px;
    padding: 0.5rem;
}

html.dark .modal-content input,
html.dark .modal-content textarea,
html.dark .modal-content select {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-content input:focus,
.modal-content textarea:focus,
.modal-content select:focus {
    outline: 2px solid #3eaf7c;
    outline-offset: 2px;
}
</style>