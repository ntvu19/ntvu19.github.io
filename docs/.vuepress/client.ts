import { defineClientConfig } from "vuepress/client";
import Welcome from "./components/Welcome.vue";
import Experience from "./components/Experience.vue";
import Project from "./components/Project.vue";

import Layout from "./layouts/Layout.vue";

export default defineClientConfig({
  layouts: {
    Layout,
  },
  enhance({ app }) {
    app
      .component("Welcome", Welcome)
      .component("Experience", Experience)
      .component("Project", Project);
  },
});
