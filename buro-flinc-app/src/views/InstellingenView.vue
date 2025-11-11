<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-flinc-darkgray mb-4">
        ⚙️ Instellingen
      </h2>
      <p class="text-gray-600">Personaliseer je Buro Flinc ervaring</p>
    </div>

    <!-- User Profile -->
    <div class="card mb-6">
      <h3 class="text-xl font-bold text-flinc-darkgray mb-6">👤 Profiel</h3>
      <div class="flex items-center space-x-6 mb-6">
        <img
          :src="userAvatar"
          :alt="userName"
          class="w-24 h-24 rounded-full border-4 border-flinc-pink"
        />
        <div class="flex-1">
          <h4 class="text-2xl font-bold text-flinc-darkgray">{{ userName }}</h4>
          <p class="text-gray-600">{{ userRole }}</p>
          <p class="text-sm text-gray-500">{{ userTeam }}</p>
          <button
            class="mt-3 px-4 py-2 bg-flinc-gray hover:bg-gray-300 rounded-lg font-semibold text-flinc-darkgray transition-colors"
          >
            Profiel bewerken
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications Settings -->
    <div class="card mb-6">
      <h3 class="text-xl font-bold text-flinc-darkgray mb-6">
        🔔 Notificaties
      </h3>
      <div class="space-y-4">
        <div
          v-for="setting in notificationSettings"
          :key="setting.id"
          class="flex items-center justify-between p-4 rounded-lg hover:bg-flinc-gray transition-colors"
        >
          <div class="flex-1">
            <h4 class="font-semibold text-flinc-darkgray">
              {{ setting.title }}
            </h4>
            <p class="text-sm text-gray-600">{{ setting.description }}</p>
          </div>
          <button
            @click="toggleSetting(setting.id)"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-flinc-pink focus:ring-offset-2"
            :class="setting.enabled ? 'bg-flinc-pink' : 'bg-gray-200'"
          >
            <span
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="setting.enabled ? 'translate-x-5' : 'translate-x-0'"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Favorite Tiles -->
    <div class="card mb-6">
      <h3 class="text-xl font-bold text-flinc-darkgray mb-6">
        ⭐ Favoriete Tegels
      </h3>
      <p class="text-sm text-gray-600 mb-4">
        Selecteer welke snelkoppelingen je wilt zien op je startpagina
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="tile in availableTiles"
          :key="tile.id"
          @click="toggleTile(tile.id)"
          class="p-4 rounded-lg border-2 cursor-pointer transition-all"
          :class="
            tile.favorite
              ? 'border-flinc-pink bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          "
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :style="{ background: tile.gradient }"
              >
                <span class="text-white text-xl">{{ tile.icon }}</span>
              </div>
              <div>
                <h4 class="font-semibold text-flinc-darkgray">
                  {{ tile.title }}
                </h4>
                <p class="text-xs text-gray-600">{{ tile.description }}</p>
              </div>
            </div>
            <svg
              v-if="tile.favorite"
              class="w-6 h-6 text-flinc-pink"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Appearance -->
    <div class="card mb-6">
      <h3 class="text-xl font-bold text-flinc-darkgray mb-6">🎨 Weergave</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-flinc-darkgray mb-2"
            >Thema</label
          >
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="theme in themes"
              :key="theme.value"
              @click="selectedTheme = theme.value"
              class="p-4 rounded-lg border-2 transition-all text-left"
              :class="
                selectedTheme === theme.value
                  ? 'border-flinc-pink bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              "
            >
              <div class="flex items-center space-x-3">
                <div class="text-2xl">{{ theme.icon }}</div>
                <div>
                  <p class="font-semibold text-flinc-darkgray">
                    {{ theme.label }}
                  </p>
                  <p class="text-xs text-gray-600">{{ theme.description }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Language & Region -->
    <div class="card mb-6">
      <h3 class="text-xl font-bold text-flinc-darkgray mb-6">
        🌍 Taal & Regio
      </h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-flinc-darkgray mb-2"
            >Taal</label
          >
          <select
            v-model="selectedLanguage"
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-flinc-pink focus:ring-2 focus:ring-flinc-pink focus:ring-opacity-20 outline-none"
          >
            <option value="nl">Nederlands</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-flinc-darkgray mb-2"
            >Tijdzone</label
          >
          <select
            v-model="selectedTimezone"
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-flinc-pink focus:ring-2 focus:ring-flinc-pink focus:ring-opacity-20 outline-none"
          >
            <option value="Europe/Amsterdam">Amsterdam (GMT+1)</option>
            <option value="Europe/London">London (GMT+0)</option>
            <option value="America/New_York">New York (GMT-5)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- About -->
    <div
      class="card bg-gradient-to-br from-flinc-blue to-flinc-lightblue text-white"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold mb-2">Buro Flinc App</h3>
          <p class="text-sm opacity-90 mb-1">Versie 1.0.0</p>
          <p class="text-xs opacity-75">
            © 2025 Buro Flinc. Alle rechten voorbehouden.
          </p>
        </div>
        <div
          class="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center"
        >
          <span class="text-3xl font-bold">F</span>
        </div>
      </div>
      <div
        class="mt-6 pt-6 border-t border-white border-opacity-20 flex space-x-4"
      >
        <button
          class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-semibold transition-all"
        >
          Help & Support
        </button>
        <button
          class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-semibold transition-all"
        >
          Privacy Beleid
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "../stores/userStore";

interface NotificationSetting {
  id: number;
  title: string;
  description: string;
  enabled: boolean;
}

interface Tile {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  favorite: boolean;
}

interface Theme {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export default defineComponent({
  name: "InstellingenView",
  data() {
    return {
      notificationSettings: [
        {
          id: 1,
          title: "Nieuwe nieuwsberichten",
          description: "Ontvang meldingen bij nieuwe berichten",
          enabled: true,
        },
        {
          id: 2,
          title: "Directie updates",
          description: "Belangrijke mededelingen van de directie",
          enabled: true,
        },
        {
          id: 3,
          title: "Team mentions",
          description: "Wanneer je wordt genoemd in Teams",
          enabled: true,
        },
        {
          id: 4,
          title: "Quiz & quizlen",
          description: "Nieuwe quizzen en uitdagingen",
          enabled: true,
        },
        {
          id: 5,
          title: "Verjaardagen",
          description: "Herinnering voor verjaardagen van collega's",
          enabled: false,
        },
      ] as NotificationSetting[],
      availableTiles: [
        {
          id: 1,
          title: "SharePoint",
          description: "Documenten & sjablonen",
          icon: "📁",
          gradient: "linear-gradient(135deg, #004E89 0%, #1A659E 100%)",
          favorite: true,
        },
        {
          id: 2,
          title: "Teams",
          description: "Mijn teamkanalen",
          icon: "👥",
          gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          favorite: true,
        },
        {
          id: 3,
          title: "Planning",
          description: "Agenda & roosters",
          icon: "📅",
          gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          favorite: true,
        },
        {
          id: 4,
          title: "BOOST",
          description: "Leer & ontwikkel",
          icon: "🎓",
          gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          favorite: true,
        },
        {
          id: 5,
          title: "HR Portal",
          description: "Verlof & documenten",
          icon: "🏢",
          gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          favorite: false,
        },
        {
          id: 6,
          title: "CRM",
          description: "Klantbeheer",
          icon: "💼",
          gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
          favorite: false,
        },
      ] as Tile[],
      themes: [
        {
          value: "light",
          label: "Licht",
          description: "Standaard lichte interface",
          icon: "☀️",
        },
        {
          value: "dark",
          label: "Donker",
          description: "Donkere interface (komt binnenkort)",
          icon: "🌙",
        },
      ] as Theme[],
      selectedTheme: "light",
      selectedLanguage: "nl",
      selectedTimezone: "Europe/Amsterdam",
    };
  },
  computed: {
    ...mapState(useUserStore, [
      "userName",
      "userRole",
      "userTeam",
      "userAvatar",
    ]),
  },
  methods: {
    toggleSetting(id: number) {
      const setting = this.notificationSettings.find((s) => s.id === id);
      if (setting) {
        setting.enabled = !setting.enabled;
      }
    },
    toggleTile(id: number) {
      const tile = this.availableTiles.find((t) => t.id === id);
      if (tile) {
        tile.favorite = !tile.favorite;
      }
    },
  },
});
</script>

