<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-flinc-darkgray mb-2">
        {{ greeting }},
        {{ userName.charAt(0).toUpperCase() + userName.slice(1) }}! 👋
      </h2>
      <p class="text-gray-600 text-lg">Dit speelt er vandaag bij Buro Flinc</p>
    </div>

    <!-- Main Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - News Feed -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-1xl font-bold text-flinc-darkgray">
            📰 Nieuws & Updates
          </h3>
          <router-link
            to="/nieuws"
            class="bg-flinc-gradient text-white px-2 py-1 rounded-md font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center space-x-1 transition-colors"
          >
            <span>Alles bekijken</span>
            <svg
              class="w-4 h-4"
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
          </router-link>
        </div>

        <!-- Featured News Items -->
        <div class="space-y-4">
          <NewsCard
            v-for="newsItem in featuredNews"
            :key="newsItem.id"
            :news="newsItem"
          />
        </div>
      </div>

      <!-- Right Column - Tiles & Widgets -->
      <div class="space-y-6">
        <!-- Quick Access Tiles -->
        <div>
          <h3 class="text-xl font-bold text-flinc-darkgray mb-4">
            ⚡ Snelkoppelingen
          </h3>
          <div class="grid grid-cols-1 gap-4">
            <QuickTile
              v-for="tile in quickAccessTiles"
              :key="tile.title"
              v-bind="tile"
            />
          </div>
        </div>

        <!-- Quiz Widget -->
        <div
          class="card bg-gradient-to-br from-purple-500 to-pink-500 text-white"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold mb-2">🎮 Quiz van de Week</h3>
              <p class="text-sm opacity-90">Test je kennis over Buro Flinc!</p>
            </div>
            <svg
              class="w-12 h-12 opacity-20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <router-link
            to="/quiz"
            class="btn-primary w-full text-center block bg-white text-purple-600 hover:bg-opacity-90"
          >
            Start Quiz
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "../stores/userStore";
import { useNewsStore } from "../stores/newsStore";
import NewsCard from "../components/NewsCard.vue";
import QuickTile from "../components/QuickTile.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    NewsCard,
    QuickTile,
  },
  data() {
    return {
      quickAccessTiles: [
        {
          title: "SharePoint",
          description: "Documenten & sjablonen",
          icon: "Folder",
          gradient: "linear-gradient(135deg, #004E89 0%, #1A659E 100%)",
          url: "https://sharepoint.com",
        },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: "Teamuitje Q1 2025",
          date: new Date(2025, 0, 15),
          time: "14:00 - 18:00",
        },
        {
          id: 2,
          title: "All Hands Meeting",
          date: new Date(2025, 0, 20),
          time: "10:00 - 11:00",
        },
        {
          id: 3,
          title: "BOOST Workshop",
          date: new Date(2025, 0, 25),
          time: "13:00 - 16:00",
        },
      ],
      teamMemberCount: 12,
    };
  },
  computed: {
    ...mapState(useUserStore, ["userName", "userTeam"]),
    ...mapState(useNewsStore, ["newsItems"]),
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Goedemorgen";
      if (hour < 18) return "Goedemiddag";
      return "Goedenavond";
    },
    featuredNews() {
      return this.newsItems.slice(0, 3);
    },
  },
  async mounted() {
    // Fetch news from API on mount
    const newsStore = useNewsStore();
    await newsStore.fetchNewsFromAPI();
  },
});
</script>

