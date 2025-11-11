<template>
  <div class="min-h-screen bg-flinc-gray">
    <Header />
    <main class="pb-20 md:pb-6">
      <RouterView />
    </main>
    <NavigationBar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import NavigationBar from "./components/NavigationBar.vue";
import Header from "./components/Header.vue";

export default defineComponent({
  name: "App",
  components: {
    RouterView,
    NavigationBar,
    Header,
  },
});
</script>

<style scoped>
</style>
