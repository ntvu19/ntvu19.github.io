import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme({
    // Find methods in `DefaultThemeLocaleData.ts`
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
      // {
      //   text: "Machine Learning",
      //   link: "/machine-learning/",
      // },
      {
        text: "Books",
        link: "/books/",
      },
      {
        text: "References",
        link: "/references/",
      },
      {
        text: "Others",
        children: [
          { text: "Other A", link: "/others/a/" },
          { text: "Other B", link: "/others/b/" },
        ],
      },
      {
        text: "About",
        link: "/about/",
      },
    ],
    contributors: false,
    lastUpdated: false,
  }),
  base: "/",
  lang: "en-US",
  title: "Vu T. Nguyen",
  pagePatterns: ["**/*.md", "!**/README.md", "!.vuepress", "!node_modules"],
});
