<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-flinc-gradient rounded-lg flex items-center justify-center"
          >
            <span class="text-white font-bold text-xl">F</span>
          </div>
          <div>
            <h1
              class="text-xl font-bold bg-flinc-gradient bg-clip-text text-transparent"
            >
              Buro Flinc
            </h1>
            <p
              class="text-xs bg-flinc-gradient bg-clip-text text-transparent hidden sm:block"
            >
              {{ greeting }}, {{ userName }}
            </p>
          </div>
        </div>

        <!-- Right side - Notifications and Profile -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <div class="relative">
            <button
              @click="showNotifications = !showNotifications"
              class="relative p-2 transition-colors hover:scale-110"
            >
              <svg
                class="w-6 h-6 bg-flinc-gradient bg-clip-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span
                v-if="unreadCount > 0"
                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-flinc-gradient rounded-full"
              >
                {{ unreadCount }}
              </span>
            </button>

            <!-- Notifications Dropdown -->
            <transition name="fade">
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
              >
                <div
                  class="bg-flinc-gradient text-white px-4 py-3 flex justify-between items-center"
                >
                  <h3 class="font-semibold">Notificaties</h3>
                  <button
                    @click="markAllAsRead"
                    class="text-xs hover:underline"
                  >
                    Alles gelezen
                  </button>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    @click="markAsRead(notification.id)"
                    class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                    :class="{ 'bg-pink-50': !notification.read }"
                  >
                    <p class="font-medium text-sm text-flinc-darkgray">
                      {{ notification.title }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatDate(notification.date) }}
                    </p>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- User Profile Dropdown -->
          <div class="relative">
            <button
              @click="showProfile = !showProfile"
              class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div class="relative w-10 h-10 rounded-full overflow-hidden">
                <img
                  :src="userAvatar"
                  :alt="userName"
                  class="w-full h-full rounded-full object-cover bg-flinc-gradient"
                />
              </div>
              <div class="hidden md:block">
                <p
                  class="text-sm font-semibold bg-flinc-gradient bg-clip-text text-transparent"
                >
                  {{ userName }}
                </p>
                <p class="text-xs text-gray-500">{{ userRole }}</p>
              </div>
            </button>

            <!-- Profile Dropdown Menu -->
            <transition name="fade">
              <div
                v-if="showProfile"
                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
              >
                <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p class="text-sm font-semibold text-flinc-darkgray">
                    {{ userName }}
                  </p>
                  <p class="text-xs text-gray-500" v-if="isAdmin">👑 Admin</p>
                </div>
                <div class="py-2">
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    ← Uitloggen
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "../stores/userStore";
import { mapState, mapActions } from "pinia";

export default defineComponent({
  name: "Header",
  data() {
    return {
      showNotifications: false,
      showProfile: false,
    };
  },
  computed: {
    ...mapState(useUserStore, [
      "userName",
      "userRole",
      "userAvatar",
      "notifications",
      "unreadCount",
      "isAdmin",
    ]),
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Goedemorgen";
      if (hour < 18) return "Goedemiddag";
      return "Goedenavond";
    },
  },
  methods: {
    ...mapActions(useUserStore, ["markAsRead", "markAllAsRead", "logout"]),
    formatDate(date: Date | string | undefined) {
      if (!date) return "Nu";

      // Convert string to Date if needed
      const dateObj = typeof date === "string" ? new Date(date) : date;

      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return "Nu";
      }

      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "Nu";
      if (minutes < 60) return `${minutes}m geleden`;
      if (hours < 24) return `${hours}u geleden`;
      if (days === 1) return "Gisteren";
      return `${days}d geleden`;
    },
    handleLogout() {
      this.logout();
      this.$router.push("/login");
    },
  },
  mounted() {
    // Close notifications and profile when clicking outside
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative")) {
        this.showNotifications = false;
        this.showProfile = false;
      }
    });
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

