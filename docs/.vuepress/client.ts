import { defineClientConfig } from "vuepress/client";
import Welcome from "./components/Welcome.vue";
import Contact from "./components/Contact.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("Welcome", Welcome).component("Contact", Contact);
  },
});
