<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-flinc-darkgray mb-4">🔍 Zoeken</h2>
      <p class="text-gray-600">Vind snel mensen, documenten en nieuws</p>
    </div>

    <!-- Search Bar -->
    <div class="card mb-8">
      <div class="relative">
        <input
          v-model="searchQuery"
          @input="performSearch"
          type="text"
          placeholder="Zoek naar mensen, documenten, nieuws..."
          class="w-full px-6 py-4 pl-14 text-lg rounded-xl border-2 border-gray-300 focus:border-flinc-pink focus:ring-4 focus:ring-flinc-pink focus:ring-opacity-20 outline-none transition-all"
        />
        <svg
          class="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Search Filters -->
      <div v-if="searchQuery" class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="selectedFilter = filter.value"
          class="px-4 py-2 rounded-lg font-medium transition-all"
          :class="
            selectedFilter === filter.value
              ? 'bg-flinc-pink text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          "
        >
          {{ filter.icon }} {{ filter.label }} ({{
            getResultCount(filter.value)
          }})
        </button>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchQuery && hasResults" class="space-y-6">
      <!-- People Results -->
      <div
        v-if="
          (selectedFilter === 'all' || selectedFilter === 'people') &&
          filteredPeople.length > 0
        "
      >
        <h3
          class="text-xl font-bold text-flinc-darkgray mb-4 flex items-center"
        >
          <svg
            class="w-6 h-6 mr-2 text-flinc-pink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Mensen
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="person in filteredPeople"
            :key="person.id"
            class="card hover:shadow-xl transition-all cursor-pointer"
          >
            <div class="flex items-center space-x-4">
              <img
                :src="person.avatar"
                :alt="person.name"
                class="w-16 h-16 rounded-full"
              />
              <div class="flex-1">
                <h4 class="font-bold text-flinc-darkgray">{{ person.name }}</h4>
                <p class="text-sm text-gray-600">{{ person.role }}</p>
                <p class="text-xs text-gray-500">{{ person.team }}</p>
              </div>
            </div>
            <div class="mt-4 flex space-x-2">
              <button class="flex-1 btn-primary text-sm py-2">
                <svg
                  class="w-4 h-4 inline mr-1"
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
                Chat
              </button>
              <button class="flex-1 btn-secondary text-sm py-2">Profiel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents Results -->
      <div
        v-if="
          (selectedFilter === 'all' || selectedFilter === 'documents') &&
          filteredDocuments.length > 0
        "
      >
        <h3
          class="text-xl font-bold text-flinc-darkgray mb-4 flex items-center"
        >
          <svg
            class="w-6 h-6 mr-2 text-flinc-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Documenten
        </h3>
        <div class="space-y-3">
          <div
            v-for="doc in filteredDocuments"
            :key="doc.id"
            class="card hover:shadow-xl transition-all cursor-pointer flex items-center justify-between"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center"
                :class="getDocIconClass(doc.type)"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h4
                  class="font-bold text-flinc-darkgray"
                  v-html="highlightMatch(doc.name)"
                ></h4>
                <p class="text-sm text-gray-600">{{ doc.location }}</p>
                <p class="text-xs text-gray-500">
                  Laatst gewijzigd: {{ formatDate(doc.modified) }}
                </p>
              </div>
            </div>
            <button class="btn-primary">Openen</button>
          </div>
        </div>
      </div>

      <!-- News Results -->
      <div
        v-if="
          (selectedFilter === 'all' || selectedFilter === 'news') &&
          filteredNews.length > 0
        "
      >
        <h3
          class="text-xl font-bold text-flinc-darkgray mb-4 flex items-center"
        >
          <svg
            class="w-6 h-6 mr-2 text-flinc-yellow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          Nieuws
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NewsCard
            v-for="newsItem in filteredNews"
            :key="newsItem.id"
            :news="newsItem"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="searchQuery && !hasResults" class="text-center py-12">
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">
        Geen resultaten gevonden
      </h3>
      <p class="text-gray-500">Probeer een andere zoekterm of filter</p>
    </div>

    <!-- Initial State -->
    <div v-else class="text-center py-12">
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Begin met zoeken</h3>
      <p class="text-gray-500 mb-6">
        Vind snel wat je nodig hebt binnen Buro Flinc
      </p>

      <!-- Popular Searches -->
      <div class="max-w-2xl mx-auto">
        <p class="text-sm text-gray-600 mb-3">Populaire zoekopdrachten:</p>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="popular in popularSearches"
            :key="popular"
            @click="
              searchQuery = popular;
              performSearch();
            "
            class="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-flinc-pink hover:text-white transition-all shadow-sm"
          >
            {{ popular }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useNewsStore } from "../stores/newsStore";
import NewsCard from "../components/NewsCard.vue";

interface Person {
  id: number;
  name: string;
  role: string;
  team: string;
  avatar: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  location: string;
  modified: Date;
}

export default defineComponent({
  name: "ZoekenView",
  components: {
    NewsCard,
  },
  data() {
    return {
      searchQuery: "",
      selectedFilter: "all",
      filters: [
        { value: "all", label: "Alles", icon: "🔍" },
        { value: "people", label: "Mensen", icon: "👥" },
        { value: "documents", label: "Documenten", icon: "📄" },
        { value: "news", label: "Nieuws", icon: "📰" },
      ],
      popularSearches: [
        "BOOST",
        "Vakantie",
        "Template",
        "Directie",
        "Planning",
      ],
      people: [
        {
          id: 1,
          name: "Linda de Vries",
          role: "Manager",
          team: "Management",
          avatar:
            "https://ui-avatars.com/api/?name=Linda+de+Vries&background=FF6B35&color=fff",
        },
        {
          id: 2,
          name: "Rob Hendriks",
          role: "Developer",
          team: "Digital Innovation",
          avatar:
            "https://ui-avatars.com/api/?name=Rob+Hendriks&background=004E89&color=fff",
        },
        {
          id: 3,
          name: "Emma de Jong",
          role: "Designer",
          team: "Digital Innovation",
          avatar:
            "https://ui-avatars.com/api/?name=Emma+de+Jong&background=FF6B35&color=fff",
        },
        {
          id: 4,
          name: "Mark Jansen",
          role: "Project Manager",
          team: "Project Management",
          avatar:
            "https://ui-avatars.com/api/?name=Mark+Jansen&background=1A659E&color=fff",
        },
      ] as Person[],
      documents: [
        {
          id: 1,
          name: "BOOST Programma Overzicht 2025",
          type: "pdf",
          location: "SharePoint > Leren & Ontwikkelen",
          modified: new Date(Date.now() - 86400000),
        },
        {
          id: 2,
          name: "Offerte Template",
          type: "docx",
          location: "SharePoint > Templates",
          modified: new Date(Date.now() - 172800000),
        },
        {
          id: 3,
          name: "Vakantie Aanvraag Formulier",
          type: "xlsx",
          location: "SharePoint > HR",
          modified: new Date(Date.now() - 259200000),
        },
        {
          id: 4,
          name: "Project Planning Q1 2025",
          type: "xlsx",
          location: "SharePoint > Projecten",
          modified: new Date(Date.now() - 345600000),
        },
      ] as Document[],
    };
  },
  computed: {
    ...mapState(useNewsStore, ["newsItems"]),
    filteredPeople() {
      if (!this.searchQuery) return [];
      const query = this.searchQuery.toLowerCase();
      return this.people.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.role.toLowerCase().includes(query) ||
          p.team.toLowerCase().includes(query)
      );
    },
    filteredDocuments() {
      if (!this.searchQuery) return [];
      const query = this.searchQuery.toLowerCase();
      return this.documents.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.location.toLowerCase().includes(query)
      );
    },
    filteredNews() {
      if (!this.searchQuery) return [];
      const query = this.searchQuery.toLowerCase();
      return this.newsItems.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.excerpt.toLowerCase().includes(query)
      );
    },
    hasResults() {
      return (
        this.filteredPeople.length > 0 ||
        this.filteredDocuments.length > 0 ||
        this.filteredNews.length > 0
      );
    },
  },
  methods: {
    performSearch() {
      // Search is reactive through computed properties
    },
    getResultCount(filter: string) {
      if (filter === "all") {
        return (
          this.filteredPeople.length +
          this.filteredDocuments.length +
          this.filteredNews.length
        );
      }
      if (filter === "people") return this.filteredPeople.length;
      if (filter === "documents") return this.filteredDocuments.length;
      if (filter === "news") return this.filteredNews.length;
      return 0;
    },
    getDocIconClass(type: string) {
      const classes = {
        pdf: "bg-red-500",
        docx: "bg-blue-500",
        xlsx: "bg-green-500",
        pptx: "bg-orange-500",
      };
      return classes[type as keyof typeof classes] || "bg-gray-500";
    },
    highlightMatch(text: string) {
      if (!this.searchQuery) return text;
      const regex = new RegExp(`(${this.searchQuery})`, "gi");
      return text.replace(
        regex,
        '<mark class="bg-flinc-yellow px-1 rounded">$1</mark>'
      );
    },
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
        year: "numeric",
      });
    },
  },
});
</script>
