import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { mediumZoomPlugin } from "@vuepress/plugin-medium-zoom";
import { defineUserConfig } from "vuepress";
import type { UserConfig } from "vite";

// TODO: Implement test for the file path (images, links, etc. in the markdown files)

export default defineUserConfig({
  plugins: [
    mediumZoomPlugin({
      selector: ".zoomable-images img", // Use this selector to enable zooming for all images with the class "zoomable-images"
    }),
  ],
  bundler: viteBundler({
    viteOptions: {
      css: {
        preprocessorOptions: {
          scss: {
            quietDeps: true, // Suppress deprecation warnings
          },
        },
      },
      define: {
        // Enable Vue hydration mismatch details for debugging
        // __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
        // Also enable for development
        // __VUE_OPTIONS_API__: true,
        // __VUE_PROD_DEVTOOLS__: false,
      },
      // Add compiler options for custom elements
      vue: {
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes("-"),
          },
        },
      },
    } as UserConfig,
  }),
  extendsPage: (page) => {
    const postfix = " - Vu T. Nguyen";
    if (page.title) {
      page.title = `${page.title}${postfix}`;
    }

    page.frontmatter.head = page.frontmatter.head || [];
    page.frontmatter.head.push(["title", {}, page.title]);
  },
  head: [["link", { rel: "icon", href: "/icon/main/icon.png" }]],
  theme: defaultTheme({
    // Find methods in `DefaultThemeLocaleData.ts`
    locales: {
      "/": {
        selectLanguageText: "English",
        selectLanguageName: "English",
        navbar: [
          {
            text: "Algorithm",
            link: "/algorithm/",
          },
          {
            text: "Programming",
            link: "/programming/",
          },
          {
            text: "Database",
            link: "/database/",
          },
          {
            text: "Networking",
            link: "/networking/",
          },
          {
            text: "Operating System",
            link: "/operating-system/",
          },
          {
            text: "Others",
            children: [
              { text: "Books", link: "/others/books/" },
              { text: "References", link: "/others/references/" },
            ],
          },
        ],
      },
      "/vi/": {
        selectLanguageName: "Việt Nam",
        selectLanguageText: "Việt Nam",
        navbar: [
          {
            text: "Giải thuật",
            link: "/vi/algorithm/",
          },
          {
            text: "Lập trình",
            link: "/vi/programming/",
          },
          {
            text: "Cơ sở dữ liệu",
            link: "/vi/database/",
          },
          {
            text: "Mạng máy tính",
            link: "/vi/networking/",
          },
          {
            text: "Hệ điều hành",
            link: "/vi/operating-system/",
          },

          {
            text: "Khác",
            children: [
              { text: "Tài liệu", link: "/vi/others/books/" },
              { text: "Tham khảo", link: "/vi/others/references/" },
            ],
          },
        ],
      },
    },
    colorMode: "light",
    colorModeSwitch: false,
    pageNavbarLabel: null,
    logo: "/signature.svg",
    logoDark: "/signature.svg",
    contributors: false,
    lastUpdated: false,
  }),
  locales: {
    "/": {
      lang: "en-US",
    },
    "/vi/": {
      lang: "vi-VN",
    },
  },
  pagePatterns: ["**/*.md", "!**/README.md", "!.vuepress", "!node_modules"],
});
