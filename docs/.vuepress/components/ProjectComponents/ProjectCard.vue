<template>
  <!-- Project card -->
  <div
    v-for="(row, rowIndex) in chunkProjects"
    :key="rowIndex"
    class="project-row"
  >
    <div v-for="project in row" :key="project.id" class="project-column">
      <div class="project-card">
        <div class="project-logo">
          <img :src="project.imageUrl" alt="Project Logo" />
        </div>
        <h3 class="project-name">{{ project.name }}</h3>
        <p class="project-description">
          {{ project.description }}
        </p>
        <div class="project-buttons">
          <button class="details-btn" @click="showModal(project, 'details')">
            Details
          </button>
          <button class="demo-btn" @click="showModal(project, 'demo')">
            Demo
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div
    v-if="isModalVisible && currentProject"
    class="project-modal"
    @click.self="closeModal"
  >
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <h2>{{ currentProject.name }}</h2>
      <div class="modal-body">
        <!-- Details View -->
        <template v-if="modalType === 'details'">
          <img
            :src="currentProject.imageUrl"
            alt="Project Image"
            class="modal-image"
          />
          <p class="modal-description">{{ currentProject.description }}</p>

          <!-- Tech Stack -->
          <div class="tech-stack">
            <h3>Technical Stack</h3>
            <div class="tech-tags">
              <span
                v-for="tech in currentProject.techStack"
                :key="tech.name"
                class="tech-tag"
              >
                {{ tech.name }}
              </span>
            </div>
          </div>

          <!-- Problem Resolves -->
          <div class="problem-resolves">
            <h3>Key Features</h3>
            <div class="resolve-tags">
              <span
                v-for="problem in currentProject.problemResolves"
                :key="problem"
                class="resolve-tag"
              >
                {{ problem }}
              </span>
            </div>
          </div>
        </template>

        <!-- Demo View -->
        <template v-else>
          <div class="demo-container">
            <div v-if="currentProject.demoVideoUrl" class="video-wrapper">
              <iframe
                :src="getEmbedUrl(currentProject.demoVideoUrl)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="demo-video"
              ></iframe>
            </div>
            <div v-else class="no-video">
              <p>No demo video available</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { computed, ref } from "vue";

interface Project {
  id: string | number;
  name: string;
  description: string;
  imageUrl: string;
  demoVideoUrl: string;
  techStack: Array<{
    name: string;
    icon: string;
  }>;
  problemResolves: string[];
}

export default {
  name: "ProjectCard",
  props: {
    projects: {
      type: Array as PropType<Project[]>,
      required: true,
    },
  },
  setup(props) {
    const isModalVisible = ref(false);
    const currentProject = ref<Project | null>(null);
    const modalType = ref<"details" | "demo">("details");

    const getEmbedUrl = (url: string) => {
      if (!url) return "";
      // Convert YouTube URL to embed format
      const videoId = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/
      )?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    };

    const showModal = (project: Project, type: "details" | "demo") => {
      currentProject.value = project;
      modalType.value = type;
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
      currentProject.value = null;
    };

    const chunkProjects = computed(() => {
      const chunkSize = 3;
      const results: Project[][] = [];
      for (let i = 0; i < props.projects.length; i += chunkSize) {
        results.push(props.projects.slice(i, i + chunkSize));
      }
      return results;
    });

    return {
      chunkProjects,
      isModalVisible,
      currentProject,
      modalType,
      showModal,
      closeModal,
      getEmbedUrl,
    };
  },
};
</script>

<style lang="scss" scoped>
.project-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  .project-column {
    .project-card {
      user-select: none;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 400px;

      &:hover {
        transform: translateY(-5px);
      }

      .project-logo {
        text-align: center;
        margin-bottom: 15px;

        & img {
          max-width: 350px;
          max-height: 200px;
          object-fit: cover;
          object-position: center;
          overflow: hidden;
        }
      }

      .project-name {
        padding-top: 60px;
        font-size: 1.2rem;
        color: #333;
      }

      .project-description {
        flex-grow: 1;
        margin-bottom: 15px;
        color: #666;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 4.5em; /* Approximately 3 lines of text */
      }

      .project-buttons {
        display: flex;
        gap: 10px;

        .details-btn,
        .demo-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .details-btn {
          background-color: #4a6fa5;
          color: white;
        }

        .demo-btn {
          background-color: #5cb85c;
          color: white;
        }

        .details-btn:hover {
          background-color: #3a5a8a;
        }

        .demo-btn:hover {
          background-color: #4cae4c;
        }
      }
    }
  }
}

.project-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;

    .close-button {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }

    h2 {
      margin-bottom: 20px;
      color: #333;
    }

    .modal-body {
      .modal-image {
        width: 100%;
        max-height: 400px;
        object-fit: contain;
        margin-bottom: 20px;
      }

      .modal-description {
        color: #666;
        line-height: 1.6;
        margin-bottom: 20px;
      }

      .tech-stack,
      .problem-resolves {
        margin-bottom: 20px;

        h3 {
          color: #333;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }
      }

      .tech-tags,
      .resolve-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .tech-tag,
      .resolve-tag {
        background-color: #e9ecef;
        color: #495057;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 0.9rem;
      }

      .demo-container {
        width: 100%;
        aspect-ratio: 16/9;
        background-color: #f8f9fa;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        .video-wrapper {
          width: 100%;
          height: 100%;
        }

        .demo-video {
          width: 100%;
          height: 100%;
          border: none;
        }

        .no-video {
          color: #6c757d;
          font-size: 1.1rem;
        }
      }
    }
  }
}
</style>
