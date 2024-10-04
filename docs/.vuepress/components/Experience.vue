<!-- Work experience -->
<template>
  <div class="home-experience">
    <div class="header">
      <span id="experience-header">WORK EXPERIENCE</span>
    </div>

    <div class="content">
      <!-- <Opswat :opswat-data="opswat[1]"></Opswat> -->
      <Opswat :opswat-data="opswat"></Opswat>
    </div>
  </div>
</template>

<script>
import Opswat from "./ExperienceComponents/Opswat.vue";

export default {
  components: {
    Opswat,
  },
  name: "Experience",
  data() {
    return {
      opswat: {
        product: "MetaDefender ICAP Server",
        teamStructure: "(Team structure)",
        description: "(This is description)",
        technicalStacks: "(Technical stack includes: ...)",
        problemsResolve: "(Problems resolved includes: ...)",
        careerDevs: [
          {
            timeline: "01/2024 - Present",
            title: "Associate Software Engineer",
          },
          // {
          //   timeline: "12/2024 - Present",
          //   title: "Software Engineer",
          // },
        ],
      },
    };
  },
  methods: {
    //
  },
  mounted() {
    //
  },
};
</script>

<style scoped>
@import "../styles/experience.scss";
</style>
