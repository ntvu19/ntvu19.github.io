<script setup lang="ts">
import ParentLayout from "@vuepress/theme-default/layouts/Layout.vue";
import CommandPalette from "../components/CommandPalette.vue";
</script>

<template>
  <CommandPalette />
  <ParentLayout>
    <!-- <template #page-bottom>
            <div class="my-footer">This is my custom page footer</div>
        </template> -->
  </ParentLayout>
</template>

<style lang="scss">
/* .my-footer {
    text-align: center;
} */
</style>
