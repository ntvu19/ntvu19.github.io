<template>
    <div class="article-card">
        <a :href="url" class="article-link">
            <div class="article-image">
                <img :src="currentImage" :alt="title" @error="handleImageError" />
            </div>
            <h3 class="article-title">{{ title }}</h3>
        </a>
    </div>
</template>

<script>
export default {
    name: 'Article',
    props: {
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false,
            default: '/images/image_unavailable.png'
        },
        objectFit: {
            type: String,
            required: false,
            default: 'contain'
        },
        url: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentImage: this.image || '/images/image_unavailable.png'
        }
    },
    methods: {
        handleImageError() {
            this.currentImage = '/images/image_unavailable.png'
        }
    }
}
</script>

<style scoped lang="scss">
.article-card {
    width: 100%;
    padding: 10px 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    margin-bottom: 20px;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .article-link {
        text-decoration: none;
        color: inherit;
        display: block;

        &:hover {
            text-decoration: none;
        }

        .article-image {
            width: 100%;
            height: 160px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: v-bind('objectFit');
            }
        }

        .article-title {
            padding: 12px 16px;
            margin: 0;
            font-size: 1.1rem;
            white-space: normal;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            line-height: 1.4;
            height: auto;
            max-height: calc(1.1em * 2);
        }
    }
}
</style>
