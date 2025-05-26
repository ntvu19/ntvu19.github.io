<template>
    <Teleport to="body" :disabled="!isMounted">
        <Transition name="modal">
            <div v-if="isOpen" class="modal-overlay" @click="closeModal">
                <div class="modal-content" @click.stop @wheel.passive @touchstart.passive @touchmove.passive
                    @scroll.passive>
                    <slot></slot>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const isMounted = ref(false)
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
    isMounted.value = true
    document.addEventListener('keydown', handleKeyPress, { capture: true })
})

onUnmounted(() => {
    isMounted.value = false
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
}

.modal-content {
    background: var(--c-bg);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    overscroll-behavior: contain;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
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
</style>