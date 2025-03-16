<template>
  <div class="opswat">
    <div class="overview">
      <div class="logo-container">
        <img v-bind:src="opswatLogoUrl" alt="OPSWAT Logo" class="company-logo" />
      </div>

      <Timeline :items="timelineItems" />
    </div>

    <ul class="work-description">
      <li>Product: {{ opswatData.product }}</li>
      <li>Team Structure: {{ opswatData.teamStructure }}</li>
      <li>Description: {{ opswatData.description }}</li>
      <li>Technical Stack: {{ opswatData.technicalStacks }}</li>
      <li>Resolved Problems: {{ opswatData.problemsResolve }}</li>
    </ul>
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
