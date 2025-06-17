import { defineClientConfig } from "vuepress/client";
import Welcome from "./components/Welcome.vue";
import Experience from "./components/Experience.vue";
import Project from "./components/Project.vue";
import Article from "./components/Article.vue";
import Knowledge from "./components/Knowledge.vue";
import GlobalModal from "./components/GlobalModal.vue";
import CodeMirror from "./components/editors/CodeMirror.vue";

import Layout from "./layouts/Layout.vue";

export default defineClientConfig({
  setup() {
    // This setup function runs globally, not per component
    // We should not use Vue lifecycle hooks here
  },
  layouts: {
    Layout,
  },
  enhance({ app, router, siteData }) {
    // Register components
    app
      .component("Welcome", Welcome)
      .component("Experience", Experience)
      .component("Project", Project)
      .component("Article", Article)
      .component("Knowledge", Knowledge)
      .component("GlobalModal", GlobalModal)
      .component("CodeMirror", CodeMirror);

    // Handle icon rotation logic only on client side
    if (typeof window !== "undefined") {
      let iconIndex: number = 0;
      let intervalId: number;

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
        try {
          localStorage.setItem("lastIconIndex", iconIndex.toString());
          localStorage.setItem("lastIconUpdate", Date.now().toString());
        } catch (e) {
          // Handle cases where localStorage might not be available
          console.warn("Could not save to localStorage:", e);
        }
      };

      const initializeIconRotation = () => {
        // Calculate initial icon index based on stored state
        try {
          const lastIconIndex = localStorage.getItem("lastIconIndex");
          const lastIconUpdate = localStorage.getItem("lastIconUpdate");

          if (lastIconIndex && lastIconUpdate) {
            const timePassed = Date.now() - parseInt(lastIconUpdate);
            const intervalsPassed = Math.floor(timePassed / (15 * 60 * 1000));
            iconIndex =
              (parseInt(lastIconIndex) + intervalsPassed) % icons.length;
          }
        } catch (e) {
          // Handle cases where localStorage might not be available
          console.warn("Could not read from localStorage:", e);
        }

        // Set the initial icon
        setIcon(iconIndex);

        // Change the icon every 15 minutes
        intervalId = window.setInterval(updateIcon, 15 * 60 * 1000);
      };

      // Initialize when DOM is ready
      const startIconRotation = () => {
        if (document.readyState === "loading") {
          document.addEventListener(
            "DOMContentLoaded",
            initializeIconRotation,
            { once: true }
          );
        } else {
          // DOM is already ready
          initializeIconRotation();
        }
      };

      // Start the icon rotation
      startIconRotation();

      // Clean up interval when page unloads
      window.addEventListener("beforeunload", () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      });

      // Clean up on router navigation (for SPA behavior)
      router.afterEach(() => {
        // Re-initialize icon if needed after navigation
        if (!intervalId) {
          initializeIconRotation();
        }
      });
    }
  },
});
