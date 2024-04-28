import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme({
    // Find methods in `DefaultThemeLocaleData.ts`
    locales: {
      "/": {
        selectLanguageText: "English",
        selectLanguageName: "English",
        navbar: [
          {
            text: "Programming",
            children: [
              {
                text: "C++",
                children: [
                  {
                    text: "Basic C++",
                    link: "/programming/cpp/basic/",
                  },
                  {
                    text: "Advanced C++",
                    link: "/programming/cpp/advanced/",
                  },
                ],
              },
              {
                text: "Java",
                children: [
                  {
                    text: "Basic Java",
                    link: "/programming/java/basic/",
                  },
                  {
                    text: "Advanced Java",
                    link: "/programming/java/advanced/",
                  },
                ],
              },
            ],
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
          {
            text: "About",
            link: "/about/",
          },
        ],
      },
      "/vi/": {
        selectLanguageName: "Việt Nam",
        selectLanguageText: "Việt Nam",
        navbar: [
          {
            text: "Lập trình",
            children: [
              {
                text: "C++",
                children: [
                  {
                    text: "C++ cơ bản",
                    link: "/vi/programming/cpp/basic/",
                  },
                  {
                    text: "C++ nâng cao",
                    link: "/vi/programming/cpp/advanced/",
                  },
                ],
              },
              {
                text: "Java",
                children: [
                  {
                    text: "Java cơ bản",
                    link: "/vi/programming/java/basic/",
                  },
                  {
                    text: "Java nâng cao",
                    link: "/vi/programming/java/advanced/",
                  },
                ],
              },
            ],
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
          {
            text: "Giới thiệu",
            link: "/vi/about/",
          },
        ],
      },
    },
    contributors: false,
    lastUpdated: false,
  }),
  locales: {
    "/": {
      lang: "en-US",
      title: "Vu T. Nguyen",
      description: "This is my blog",
    },
    "/vi/": {
      lang: "vi-VN",
      title: "Vu T. Nguyen",
      description: "Đây là blog của tôi",
    },
  },
  pagePatterns: ["**/*.md", "!**/README.md", "!.vuepress", "!node_modules"],
});
