<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:relative md:border-t-0 md:shadow-none z-50"
  >
    <div class="max-w-7xl mx-auto">
      <div
        class="flex justify-around md:justify-center md:space-x-8 py-4 md:py-4"
      >
        <router-link
          v-for="item in navItems.filter((item) => item.visible !== false)"
          :key="item.path"
          :to="item.path"
          class="nav-item flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-2 px-3 py-2 rounded-lg transition-all duration-200"
          :class="
            isActive(item.path)
              ? 'bg-flinc-gradient text-white'
              : 'text-gray-600 hover:text-flinc-pink'
          "
        >
          <component :is="item.icon" class="w-6 h-6" />
          <span class="text-xs md:text-sm font-medium">{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Home,
  Newspaper,
  Gamepad2,
  Settings,
  LogIn,
  Shield,
  Dices,
} from "lucide-vue-next";
import { useUserStore } from "../stores/userStore";
import { mapState } from "pinia";

export default defineComponent({
  name: "NavigationBar",
  components: {
    Home,
    Newspaper,
    Gamepad2,
    Settings,
    LogIn,
    Shield,
    Dices,
  },
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      navItems: [
        { path: "/", label: "Home", icon: "Home" },
        { path: "/nieuws", label: "Nieuws", icon: "Newspaper" },
        { path: "/bingo", label: "Bingo", icon: "Dices" },
        { path: "/quiz", label: "quiz", icon: "Gamepad2" },
        {
          path: "/login",
          label: "Login",
          icon: "LogIn",
          visible: !this.isLoggedIn,
        },
      ],
    };
  },
  computed: {
    ...mapState(useUserStore, ["isAdmin"]),
  },
  watch: {
    isAdmin(newVal) {
      this.updateNavItems();
    },
  },
  methods: {
    isActive(path: string): boolean {
      if (path === "/") {
        return this.$route.path === "/";
      }
      return this.$route.path.startsWith(path);
    },
    updateNavItems() {
      this.navItems = [
        { path: "/", label: "Home", icon: "Home" },
        { path: "/nieuws", label: "Nieuws", icon: "Newspaper" },
        { path: "/bingo", label: "Bingo", icon: "Dices" },
        { path: "/quiz", label: "quiz", icon: "Gamepad2" },
        {
          path: "/admin/events",
          label: "Admin",
          icon: "Shield",
          visible: this.isAdmin,
        },
        {
          path: "/login",
          label: "Login",
          icon: "LogIn",
          visible: !this.isLoggedIn,
        },
      ];
    },
  },
  mounted() {
    this.updateNavItems();
  },
});
</script>

<style scoped>
.nav-item {
  min-width: 60px;
}

.router-link-active {
  @apply bg-flinc-gradient text-white;
}

@media (min-width: 768px) {
  .nav-item {
    min-width: auto;
  }
}
</style>

