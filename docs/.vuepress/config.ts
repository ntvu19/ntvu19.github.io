import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme({
    // Find methods in `DefaultThemeLocaleData.ts`
    navbar: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      {
        text: "Programming",
        children: [
          // {text: 'C++', link: '/programming/cpp/'},
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
                link: "programming/java/basic/",
              },
              {
                text: "Advanced Java",
                link: "programming/java/advanced/",
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
        text: "Machine Learning",
        link: "/machine-learning/",
      },
      {
        text: "Others",
        children: [
          { text: "Other A", link: "/other/a/" },
          { text: "Other B", link: "/other/b/" },
        ],
      },
      {
        text: "About",
        link: "/about/",
      },
    ],
  }),
  lang: "en-US",
  title: "Vu T. Nguyen",
  pagePatterns: ["**/*.md", "!**/README.md", "!.vuepress", "!node_modules"],
});
