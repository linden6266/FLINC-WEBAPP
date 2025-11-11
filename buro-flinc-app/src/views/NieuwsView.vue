<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-flinc-darkgray mb-4">
        📰 Nieuws & Verhalen
      </h2>
      <p class="text-gray-600">
        Blijf op de hoogte van het laatste nieuws bij Buro Flinc
      </p>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-6 overflow-x-auto">
      <div class="flex space-x-2 min-w-max">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectedCategory = category.value"
          class="px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          :class="
            selectedCategory === category.value
              ? 'bg-flinc-pink text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          "
        >
          {{ category.icon }} {{ category.label }}
        </button>
      </div>
    </div>

    <!-- News Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NewsCard
        v-for="newsItem in filteredNews"
        :key="newsItem.id"
        :news="newsItem"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredNews.length === 0" class="text-center py-12">
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
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">
        Geen nieuws gevonden
      </h3>
      <p class="text-gray-500">
        Er zijn momenteel geen nieuwsberichten in deze categorie.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useNewsStore } from "../stores/newsStore";
import NewsCard from "../components/NewsCard.vue";

export default defineComponent({
  name: "NieuwsView",
  components: {
    NewsCard,
  },
  data() {
    return {
      selectedCategory: "all" as string,
      categories: [
        { value: "all", label: "Alles", icon: "📰" },
        { value: "nieuws", label: "Nieuws", icon: "📢" },
        { value: "success", label: "Successen", icon: "🏆" },
        { value: "verjaardag", label: "Verjaardagen", icon: "🎉" },
        { value: "event", label: "Events", icon: "🎪" },
      ],
    };
  },
  computed: {
    ...mapState(useNewsStore, ["newsItems"]),
    filteredNews() {
      if (this.selectedCategory === "all") {
        return this.newsItems;
      }
      return this.newsItems.filter(
        (item) => item.category === this.selectedCategory
      );
    },
  },
});
</script>

