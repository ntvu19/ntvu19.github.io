import { onMounted, onUnmounted } from "vue";
import { defineClientConfig } from "vuepress/client";
import Welcome from "./components/Welcome.vue";
import Experience from "./components/Experience.vue";
import Project from "./components/Project.vue";
import Article from "./components/Article.vue";
import Knowledge from "./components/Knowledge.vue";

import Layout from "./layouts/Layout.vue";

export default defineClientConfig({
  setup() {
    let iconIndex: number = 0;
    let intervalId: number;

    onMounted(() => {
      // TODO: Fix the icon change every 15 minutes
      const icons = [
        "/icon/main/icon.png",
        "/icon/main/icon1.png",
        "/icon/main/icon2.png",
        "/icon/main/icon3.png",
        "/icon/main/icon4.png",
        "/icon/main/icon5.png",
      ];

      const setIcon = (index: number) => {
        const iconUrl = icons[index];
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

      const updateIcon = () => {
        setIcon(iconIndex);
        iconIndex = (iconIndex + 1) % icons.length;

        // Save current state to localStorage
        localStorage.setItem("lastIconIndex", iconIndex.toString());
        localStorage.setItem("lastIconUpdate", Date.now().toString());
      };

      // Calculate initial icon index based on stored state
      const lastIconIndex = localStorage.getItem("lastIconIndex");
      const lastIconUpdate = localStorage.getItem("lastIconUpdate");

      if (lastIconIndex && lastIconUpdate) {
        const timePassed = Date.now() - parseInt(lastIconUpdate);
        const intervalsPassed = Math.floor(timePassed / (15 * 60 * 1000));
        iconIndex = (parseInt(lastIconIndex) + intervalsPassed) % icons.length;
      }

      // Set the initial icon without incrementing
      setIcon(iconIndex);

      // Change the icon every 15 minutes
      intervalId = window.setInterval(updateIcon, 15 * 60 * 1000);
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
      .component("Project", Project)
      .component("Article", Article)
      .component("Knowledge", Knowledge);
  },
});
