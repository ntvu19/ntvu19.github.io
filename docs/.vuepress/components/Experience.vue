<!-- Work experience -->
<template>
  <div class="home-experience">
    <div class="header">
      <span id="experience-header">WORK EXPERIENCE</span>
    </div>

    <div class="content">
      <!-- <Opswat :opswat-data="opswat[1]"></Opswat> -->
      <Opswat :opswat-data="opswat[0]"></Opswat>
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
      opswat: [
        {
          id: 0,
          title: "Associate Software Engineer",
          product: "MetaDefender ICAP Server",
          teamStructure: "(Team structure)",
          description: "(This is description)",
          technicalStacks: "(Technical stack includes: ...)",
          problemsResolve: "(Problems resolved includes: ...)",
        },
        {
          id: 1,
          title: "Software Engineer",
          product: "MetaDefender ICAP Server",
          teamStructure: "(Team structure)",
          description: "(This is description)",
          technicalStacks: "(Technical stack includes: ...)",
          problemsResolve: "(Problems resolved includes: ...)",
        },
      ],
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
