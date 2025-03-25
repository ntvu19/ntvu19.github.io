<!-- Work experience -->
<template>
  <div class="home-experience">
    <div class="header">
      <span id="experience-header">Work Experience</span>
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
      // Collect icons here: https://techicons.dev/
      opswat: {
        product: "MetaDefender ICAP Server",
        description:
          "Working on an ICAP Server project that integrates with ICAP-supported proxies to inspect requests for malware and sensitive data, determine appropriate verdict for each request. Responsibilities include integrating with central management and antivirus scan servers, enhancing scanning rule (such as file type, request info, encryption/decryption), designing scalable and maintainable software architecture, and optimizing database performance. Developing high-quality software using test-driven development and domain-driven development to minimize user-impacting issues.",
        technicalStacks: [
          { name: "C++", iconUrl: "/icon/skill/cpp.svg" },
          { name: "Qt", iconUrl: "/icon/skill/qt.svg" },
          { name: "CMake", iconUrl: "/icon/skill/cmake.svg" },
          { name: "Windows", iconUrl: "/icon/skill/windows11.svg" },
          { name: "Linux", iconUrl: "/icon/skill/linux.svg" },
          { name: "PostgreSQL", iconUrl: "/icon/skill/postgresql.svg" },
          { name: "SQLite", iconUrl: "/icon/skill/sqlite.svg" },
          { name: "NGINX", iconUrl: "/icon/skill/nginx.svg" },
          { name: "Jenkins", iconUrl: "/icon/skill/jenkins.svg" },
          { name: "Docker", iconUrl: "/icon/skill/docker.svg" },
          { name: "gRPC", iconUrl: "/icon/skill/grpc.svg" },
          { name: "jUnit", iconUrl: "/icon/skill/junit.svg" },
        ],
        problemsResolve: [
          "Software Architecture",
          "Database Optimization",
          "ICAP Protocol",
          "High Concurrency Application",
          "RESTful API",
          "Security Application",
          "Unit Testing",
          "Automation Testing",
        ],
        careerDevs: [
          {
            timeline: "01/2025 - Present",
            title: "Software Engineer",
          },
          {
            timeline: "01/2024 - 12/2024",
            title: "Associate Software Engineer",
          },
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
