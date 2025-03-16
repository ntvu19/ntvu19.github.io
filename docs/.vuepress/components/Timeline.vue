<template>
    <div class="timeline-container" ref="timelineContainer">
        <div v-for="(item, index) in items" :key="index" class="timeline-item" ref="timelineItems">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-text">{{ item.content }}</div>
                <div class="timeline-time">{{ item.timeRange }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Timeline',
    props: {
        items: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.adjustVerticalLine();
        });

        // Adjust the line when window resizes
        window.addEventListener('resize', this.adjustVerticalLine);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.adjustVerticalLine);
    },
    updated() {
        this.$nextTick(() => {
            this.adjustVerticalLine();
        });
    },
    methods: {
        adjustVerticalLine() {
            const items = this.$refs.timelineItems;
            if (!items || items.length === 0) return;

            const container = this.$refs.timelineContainer;
            const firstItem = items[0];
            const lastItem = items[items.length - 1];

            // Get the position of the first and last dots
            const firstDot = firstItem.querySelector('.timeline-dot');
            const lastDot = lastItem.querySelector('.timeline-dot');

            const firstDotPos = firstDot.getBoundingClientRect();
            const lastDotPos = lastDot.getBoundingClientRect();
            const containerPos = container.getBoundingClientRect();

            // Calculate top and height
            const top = firstDotPos.top - containerPos.top + firstDotPos.height / 2;
            const bottom = lastDotPos.top - containerPos.top + lastDotPos.height / 2;
            const height = bottom - top;

            // Set custom CSS variables
            container.style.setProperty('--line-top', `${top}px`);
            container.style.setProperty('--line-height', `${height}px`);
        }
    }
}
</script>

<style scoped lang="scss">
$dot-size: 8px;
$connected-line-size: 2px;
$before-item-size: 32px;

.timeline-container {
    position: relative;
    padding: 0;

    &::before {
        content: '';
        position: absolute;
        top: var(--line-top, 0);
        height: var(--line-height, 100%);
        left: calc(($before-item-size - $connected-line-size) / 2);
        width: $connected-line-size;
        background-color: #e0e0e0;
    }

    .timeline-item {
        position: relative;
        padding-left: $before-item-size;
        margin: 10px 0;
        display: flex;

        .timeline-dot {
            position: absolute;
            left: calc($before-item-size / 2);
            top: 50%;
            width: $dot-size;
            height: $dot-size;
            background-color: #3eaf7c;
            border: 5px solid white;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
        }

        .timeline-content {
            width: 100%;
            font-size: 12px;

            .timeline-text {
                font-weight: bold;
                color: #999;
            }

            .timeline-time {
                font-weight: bold;
                color: #3eaf7c;
            }

        }
    }
}
</style>