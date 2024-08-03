import { defineClientConfig } from "vuepress/client";
import Welcome from "./components/Welcome.vue";
import Experience from "./components/Experience.vue";
import Project from "./components/Project.vue";
import Contact from "./components/Contact.vue";

export default defineClientConfig({
  enhance({ app }) {
    app
      .component("Welcome", Welcome)
      .component("Experience", Experience)
      .component("Project", Project)
      .component("Contact", Contact);
  },
});
