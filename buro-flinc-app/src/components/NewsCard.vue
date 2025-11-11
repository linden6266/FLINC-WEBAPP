<template>
  <div class="card hover:scale-[1.02] cursor-pointer" @click="goToDetail">
    <div class="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
      <img
        :src="news.image"
        :alt="news.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute top-4 right-4">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold text-white"
          :class="categoryClass"
        >
          {{ categoryLabel }}
        </span>
      </div>
    </div>

    <div class="space-y-3">
      <h3 class="text-xl font-bold text-flinc-darkgray line-clamp-2">
        {{ news.title }}
      </h3>
      <p class="text-gray-600 text-sm line-clamp-3">{{ news.excerpt }}</p>

      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex items-center space-x-2">
          <img
            :src="`https://ui-avatars.com/api/?name=${news.author}&background=004E89&color=fff`"
            :alt="news.author"
            class="w-6 h-6 rounded-full"
          />
          <span>{{ news.author }}</span>
        </div>
        <span>{{ formatDate(news.date) }}</span>
      </div>

      <div
        class="flex items-center justify-between pt-3 border-t border-gray-100"
      >
        <button
          @click.stop="toggleLike"
          class="flex items-center space-x-2 transition-all duration-200 hover:scale-110"
          :class="
            news.isLiked
              ? 'text-flinc-pink'
              : 'text-gray-500 hover:text-flinc-pink'
          "
        >
          <svg
            class="w-5 h-5"
            :fill="news.isLiked ? 'currentColor' : 'none'"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span class="font-semibold">{{ news.likes }}</span>
        </button>

        <div class="flex items-center space-x-2 text-gray-500">
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span class="font-semibold">{{ news.comments.length }}</span>
        </div>

        <button
          class="flex items-center space-x-2 text-gray-500 hover:text-flinc-blue transition-colors"
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useNewsStore, NewsItem } from "../stores/newsStore";
import { mapActions } from "pinia";

export default defineComponent({
  name: "NewsCard",
  props: {
    news: {
      type: Object as PropType<NewsItem>,
      required: true,
    },
  },
  computed: {
    categoryClass() {
      const classes = {
        nieuws: "bg-flinc-blue",
        success: "bg-green-500",
        verjaardag: "bg-flinc-yellow text-flinc-darkgray",
        event: "bg-purple-500",
      };
      return classes[this.news.category];
    },
    categoryLabel() {
      const labels = {
        nieuws: "Nieuws",
        success: "Succes",
        verjaardag: "Verjaardag",
        event: "Event",
      };
      return labels[this.news.category];
    },
  },
  methods: {
    ...mapActions(useNewsStore, ["toggleLike"]),
    formatDate(date: Date) {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / 86400000);

      if (days === 0) return "Vandaag";
      if (days === 1) return "Gisteren";
      if (days < 7) return `${days} dagen geleden`;

      return date.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
      });
    },
    goToDetail() {
      this.$router.push(`/nieuws/${this.news.id}`);
    },
  },
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

