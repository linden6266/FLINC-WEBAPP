<template>
  <div class="min-h-screen bg-flinc-gray">
    <!-- Header only visible when logged in -->
    <Header v-if="isLoggedIn" />

    <main :class="{ 'pb-20 md:pb-6': isLoggedIn }">
      <RouterView />
    </main>

    <!-- Navigation bar only visible when logged in -->
    <NavigationBar :isLoggedIn="isLoggedIn" v-if="isLoggedIn" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import NavigationBar from "./components/NavigationBar.vue";
import Header from "./components/Header.vue";
import { useUserStore } from "./stores/userStore";
import { mapState } from "pinia";

export default defineComponent({
  name: "App",
  components: {
    RouterView,
    NavigationBar,
    Header,
  },
  computed: {
    ...mapState(useUserStore, ["isLoggedIn"]),
  },
  async mounted() {
    console.log("🚀 App mounted! isLoggedIn:", this.isLoggedIn);

    // Fetch notifications if logged in
    if (this.isLoggedIn) {
      const userStore = useUserStore();
      await userStore.fetchNotifications();

      // Poll for new notifications every 30 seconds
      setInterval(() => {
        if (userStore.isLoggedIn) {
          userStore.fetchNotifications();
        }
      }, 30000);
    }
  },
  watch: {
    isLoggedIn(newVal) {
      console.log("🔐 Login status changed:", newVal);
      if (newVal) {
        const userStore = useUserStore();
        userStore.fetchNotifications();
      }
    },
  },
});
</script>

<style scoped>
</style>
