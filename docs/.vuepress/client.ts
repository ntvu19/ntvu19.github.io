import { onMounted, onUnmounted } from "vue";
import { defineClientConfig } from "vuepress/client";
import Welcome from "./components/Welcome.vue";
import Experience from "./components/Experience.vue";
import Project from "./components/Project.vue";

import Layout from "./layouts/Layout.vue";

export default defineClientConfig({
  setup() {
    let iconIndex: number = 0;
    let intervalId: number;

    onMounted(() => {
      const icons = [
        "/icon/main/icon.png",
        "/icon/main/icon1.png",
        "/icon/main/icon2.png",
        "/icon/main/icon3.png",
        "/icon/main/icon4.png",
        "/icon/main/icon5.png",
      ];

      const updateIcon = () => {
        const iconUrl = icons[iconIndex];
        iconIndex = (iconIndex + 1) % icons.length;

        let link = document.querySelector(
          'link[rel~="icon"]'
        ) as HTMLLinkElement;
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }

        link.href = iconUrl;
      };

      // Change the icon every 15 minutes
      intervalId = window.setInterval(updateIcon, 15 * 60 * 1000);

      // Set the initial icon
      updateIcon();
    });

    onUnmounted(() => {
      if (intervalId) {
        // Clear the interval when the component is unmounted
        clearInterval(intervalId);
      }
    });
  },
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
