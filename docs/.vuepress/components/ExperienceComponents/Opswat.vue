<template>
  <div class="opswat">
    <div class="logo-container">
      <img v-bind:src="opswatLogoUrl" alt="OPSWAT Logo" class="company-logo" />
    </div>
    <!-- TODO: Use table format instead -->
    <!-- TODO: Custom the list icon -->
    <ul class="work-description">
      <b>{{ opswatData.title }}</b>
      <li>Product: {{ opswatData.product }}</li>
      <li>Team Structure: {{ opswatData.teamStructure }}</li>
      <li>Description: {{ opswatData.description }}</li>
      <li>Technical Stack: {{ opswatData.technicalStacks }}</li>
      <li>Resolved Problems: {{ opswatData.problemsResolve }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      opswatLogoUrl: "/opswat-light.svg",
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
