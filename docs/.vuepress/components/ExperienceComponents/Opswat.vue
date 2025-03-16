<template>
  <div class="opswat">
    <div class="overview">
      <div class="logo-container">
        <img v-bind:src="opswatLogoUrl" alt="OPSWAT Logo" class="company-logo" />
      </div>

      <Timeline :items="timelineItems" />
    </div>

    <div class="work-description">
      <div class="product-name">
        <span class="product-name-text">{{ opswatData.product }}</span>
      </div>
      <div class="description">
        <span class="description-text">{{ opswatData.description }}</span>
      </div>
      <div class="technical-stacks">
        <div v-if="opswatData.technicalStacks && opswatData.technicalStacks.length > 0" class="tech-stack-list">
          <div v-for="(tech, index) in opswatData.technicalStacks" :key="index" class="tech-item">
            <img v-if="tech.iconUrl" :src="tech.iconUrl" :alt="tech.name" class="tech-icon" />
          </div>
        </div>
      </div>
      <div class="problem-resolve">
        <div class="tag-container">
          <div v-if="opswatData.problemsResolve && opswatData.problemsResolve.length > 0" class="tags-list">
            <span v-for="(tag, index) in opswatData.problemsResolve" :key="index" class="tag">
              {{ tag }}
            </span>
          </div>
          <div v-else class="no-tags">No problems/solutions listed</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timeline from '../Timeline.vue';

export default {
  components: {
    Timeline
  },
  data() {
    return {
      opswatLogoUrl: "/opswat-light.svg",
      timelineItems: []
    };
  },
  props: {
    opswatData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    isDarkMode() {
      return document.documentElement.classList.contains("dark");
    },
  },
  created() {
    // Transform career development data into timeline items format
    this.timelineItems = this.opswatData.careerDevs.map(career => ({
      timeRange: career.timeline,
      content: career.title
    }));
  },
  mounted() {
    const btnDarkMode = document.querySelector(".toggle-color-mode-button");
    const btnVpDarkMode = document.querySelector(
      ".vp-toggle-color-mode-button"
    );

    // Change OPSWAT logo on start
    setTimeout(() => {
      this.opswatLogoUrl =
        this.isDarkMode() === true ? "/opswat-dark.svg" : "/opswat-light.svg";
    }, 0);

    // Change OPSWAT logo dark/light mode (on local)
    btnDarkMode?.addEventListener("click", () => {
      this.opswatLogoUrl =
        this.isDarkMode() === true ? "/opswat-dark.svg" : "/opswat-light.svg";
    });

    // Change OPWAT logo dark/light mode (on cloud)
    btnVpDarkMode?.addEventListener("click", () => {
      this.opswatLogoUrl =
        this.isDarkMode() === true ? "/opswat-dark.svg" : "/opswat-light.svg";
    });
  },
};
</script>

<style scoped>
@import "../../styles/ExperienceComponents/opswat.scss";
</style>
