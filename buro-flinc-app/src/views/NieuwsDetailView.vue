<template>
  <div v-if="newsItem" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Back Button -->
    <button
      @click="$router.back()"
      class="flex items-center space-x-2 text-gray-600 hover:text-flinc-pink mb-6 transition-colors"
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span class="font-semibold">Terug naar nieuws</span>
    </button>

    <!-- Article Header -->
    <div class="card mb-6">
      <div class="relative h-96 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-xl">
        <img
          :src="newsItem.image"
          :alt="newsItem.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute top-4 left-4">
          <span
            class="px-4 py-2 rounded-full text-sm font-semibold text-white"
            :class="categoryClass"
          >
            {{ categoryLabel }}
          </span>
        </div>
      </div>

      <h1 class="text-4xl font-bold text-flinc-darkgray mb-4">
        {{ newsItem.title }}
      </h1>

      <div
        class="flex items-center justify-between mb-6 pb-6 border-b border-gray-200"
      >
        <div class="flex items-center space-x-3">
          <img
            :src="`https://ui-avatars.com/api/?name=${newsItem.author}&background=004E89&color=fff`"
            :alt="newsItem.author"
            class="w-12 h-12 rounded-full"
          />
          <div>
            <p class="font-semibold text-flinc-darkgray">
              {{ newsItem.author }}
            </p>
            <p class="text-sm text-gray-500">{{ formatDate(newsItem.date) }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button
            @click="toggleLike(newsItem.id)"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
            :class="
              newsItem.isLiked
                ? 'bg-flinc-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            "
          >
            <svg
              class="w-5 h-5"
              :fill="newsItem.isLiked ? 'currentColor' : 'none'"
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
            <span class="font-semibold">{{ newsItem.likes }}</span>
          </button>

          <button
            class="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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

      <!-- Article Content -->
      <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        <p>{{ newsItem.content }}</p>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="card">
      <h3 class="text-2xl font-bold text-flinc-darkgray mb-6">
        💬 Reacties ({{ newsItem.comments.length }})
      </h3>

      <!-- Add Comment Form -->
      <div class="mb-6 pb-6 border-b border-gray-200">
        <div class="flex space-x-3">
          <img
            :src="userAvatar"
            :alt="userName"
            class="w-10 h-10 rounded-full"
          />
          <div class="flex-1">
            <textarea
              v-model="newComment"
              placeholder="Plaats een reactie..."
              rows="3"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-flinc-pink focus:ring-2 focus:ring-flinc-pink focus:ring-opacity-20 outline-none transition-all"
            ></textarea>
            <div class="mt-2 flex justify-end">
              <button
                @click="submitComment"
                :disabled="!newComment.trim()"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Plaatsen
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments List -->
      <div class="space-y-4">
        <div
          v-for="comment in newsItem.comments"
          :key="comment.id"
          class="flex space-x-3 p-4 rounded-lg hover:bg-flinc-gray transition-colors"
        >
          <img
            :src="`https://ui-avatars.com/api/?name=${comment.author}&background=004E89&color=fff`"
            :alt="comment.author"
            class="w-10 h-10 rounded-full"
          />
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <span class="font-semibold text-flinc-darkgray">{{
                comment.author
              }}</span>
              <span class="text-xs text-gray-500">{{
                formatDate(comment.date)
              }}</span>
            </div>
            <p class="text-gray-700">{{ comment.content }}</p>
          </div>
        </div>
      </div>

      <!-- Empty Comments -->
      <div
        v-if="newsItem.comments.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <p>Nog geen reacties. Wees de eerste om te reageren!</p>
      </div>
    </div>
  </div>

  <!-- Not Found -->
  <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
    <svg
      class="w-24 h-24 mx-auto text-gray-300 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h2 class="text-2xl font-bold text-gray-600 mb-2">Nieuws niet gevonden</h2>
    <p class="text-gray-500 mb-6">
      Dit nieuwsbericht bestaat niet of is verwijderd.
    </p>
    <router-link to="/nieuws" class="btn-primary inline-block">
      Terug naar nieuws
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "pinia";
import { useNewsStore } from "../stores/newsStore";
import { useUserStore } from "../stores/userStore";

export default defineComponent({
  name: "NieuwsDetailView",
  data() {
    return {
      newComment: "",
    };
  },
  computed: {
    ...mapState(useUserStore, ["userName", "userAvatar"]),
    newsItem() {
      const newsStore = useNewsStore();
      const item = newsStore.getNewsById(Number(this.$route.params.id));
      if (!item) return null;
      console.log("News item:", item);
      return item;
    },
    categoryClass() {
      if (!this.newsItem) return "";
      const classes = {
        nieuws: "bg-flinc-blue",
        success: "bg-green-500",
        verjaardag: "bg-flinc-yellow text-flinc-darkgray",
        event: "bg-purple-500",
      };
      return classes[this.newsItem.category];
    },
    categoryLabel() {
      if (!this.newsItem) return "";
      const labels = {
        nieuws: "Nieuws",
        success: "Succes",
        verjaardag: "Verjaardag",
        event: "Event",
      };
      return labels[this.newsItem.category];
    },
  },
  methods: {
    ...mapActions(useNewsStore, ["toggleLike", "addComment"]),
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
      if (days < 7) return `${days}d geleden`;

      return dateObj.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    submitComment() {
      if (this.newComment.trim() && this.newsItem) {
        this.addComment(
          this.newsItem.id,
          this.newComment.trim(),
          this.userName
        );
        this.newComment = "";
      }
    },
  },
});
</script>

