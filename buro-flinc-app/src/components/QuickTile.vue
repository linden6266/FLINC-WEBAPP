<template>
  <div
    @click="handleClick"
    class="tile group relative overflow-hidden"
    :style="{ background: gradient }"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <component :is="iconComponent" class="w-6 h-6 text-white" />
          <h3 class="text-white font-bold text-lg">{{ title }}</h3>
        </div>
        <p class="text-white text-sm opacity-90">{{ description }}</p>
        <div v-if="badge" class="mt-3">
          <span
            class="inline-block bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-xs font-semibold"
          >
            {{ badge }}
          </span>
        </div>
      </div>
      <div
        class="text-white opacity-50 group-hover:opacity-100 transition-opacity"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>

    <!-- Decorative background shapes -->
    <div
      class="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"
    ></div>
    <div
      class="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-5 rounded-full"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  FileText,
  Users,
  Calendar,
  GraduationCap,
  Zap,
  ExternalLink,
  Folder,
  Clock,
} from "lucide-vue-next";

export default defineComponent({
  name: "QuickTile",
  components: {
    FileText,
    Users,
    Calendar,
    GraduationCap,
    Zap,
    ExternalLink,
    Folder,
    Clock,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "FileText",
    },
    badge: {
      type: String,
      default: "",
    },
    gradient: {
      type: String,
      default: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
    },
    url: {
      type: String,
      default: "",
    },
    route: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconComponent() {
      return this.icon;
    },
  },
  methods: {
    handleClick() {
      if (this.route) {
        this.$router.push(this.route);
      } else if (this.url) {
        this.openSharePoint(this.url);
      }
      this.$emit("click");
    },
    openSharePoint(webUrl: string) {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const android = /Android/.test(navigator.userAgent);

      const appUrls = [
        `ms-sp://open?url=${encodeURIComponent(webUrl)}`,
        `ms-sharepoint://open?url=${encodeURIComponent(webUrl)}`,
        `ms-SharePoint://open?url=${encodeURIComponent(webUrl)}`,
      ];

      // Fallback to web if app doesn't open
      const fallbackDelayMs = 1500;
      const fallback = window.setTimeout(() => {
        window.open(webUrl, "_blank");
      }, fallbackDelayMs);

      const cancelFallbackIfHidden = () => {
        if (document.hidden) {
          clearTimeout(fallback);
          document.removeEventListener(
            "visibilitychange",
            cancelFallbackIfHidden
          );
        }
      };
      document.addEventListener("visibilitychange", cancelFallbackIfHidden);

      // Try known SharePoint schemes
      for (const u of appUrls) {
        try {
          window.location.href = u;
        } catch {}
      }

      // Android Chrome intent fallback
      if (android) {
        try {
          window.location.href = `intent://open?url=${encodeURIComponent(
            webUrl
          )}#Intent;scheme=ms-sp;package=com.microsoft.sharepoint;end`;
        } catch {}
      }

      // iOS last resort: keep user on page and let web open via fallback
    },
  },
});
</script>

