<template>
    <div class="knowledge-section">
        <h2 class="section-title">{{ sectionName }}</h2>
        <div v-if="articles && articles.length > 0" class="articles-grid">
            <div v-for="(article, index) in displayedArticles" :key="index" class="article-col">
                <Article :title="article.title" :image="article.image" :url="article.url" />
            </div>
        </div>
        <div v-else class="no-articles-message">
            <p>No articles available for this section.</p>
        </div>
        <div v-if="articles && articles.length > 6" class="show-more-container">
            <button @click="toggleShowAll" class="show-more-button">
                {{ showAll ? 'Show Less' : 'Show More' }}
            </button>
        </div>
    </div>
</template>

<script>
import Article from './Article.vue'

export default {
    name: 'Knowledge',
    components: {
        Article
    },
    props: {
        sectionName: {
            type: String,
            required: true
        },
        articles: {
            type: Array,
            default: () => [],
            validator: function (value) {
                return value.every(article =>
                    typeof article.title === 'string' &&
                    typeof article.image === 'string' &&
                    typeof article.url === 'string'
                )
            }
        }
    },
    data() {
        return {
            showAll: false
        }
    },
    computed: {
        displayedArticles() {
            return this.showAll ? this.articles : this.articles.slice(0, 6)
        }
    },
    methods: {
        toggleShowAll() {
            this.showAll = !this.showAll
        }
    }
}
</script>

<style scoped lang="scss">
.knowledge-section {
    margin-bottom: 40px;

    .section-title {
        font-size: 1.8rem;
        margin-bottom: 24px;
        border-bottom: 2px solid #eaecef;
        padding-bottom: 12px;
    }

    .articles-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    @media (max-width: 768px) {
        .articles-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 480px) {
        .articles-grid {
            grid-template-columns: 1fr;
        }
    }

    .no-articles-message {
        padding: 20px;
        background-color: #f8f8f8;
        border-radius: 8px;
        text-align: center;
        color: #666;
        font-style: italic;
    }

    .show-more-container {
        margin-top: 20px;
        text-align: center;

        .show-more-button {
            background-color: #3eaf7c;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
                background-color: #2c8f5e;
            }
        }
    }
}
</style>
