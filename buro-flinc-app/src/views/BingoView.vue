<template>
  <div class="bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <!-- Header -->
      <div class="mb-3 text-center">
        <div class="flex items-center justify-center gap-4 mb-6">
          <div
            class="w-16 h-16 bg-flinc-gradient rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg"
          >
            🎰
          </div>
          <div>
            <h1
              class="text-5xl font-bold bg-flinc-gradient bg-clip-text text-transparent"
            >
              Bingo
            </h1>
          </div>
        </div>
        <p class="text-gray-600 text-lg">
          Creëer je dagelijkse bingo kaart of bekijk die van anderen
        </p>
      </div>

      <!-- Landing Page -->
      <div v-if="currentView === 'landing'" class="max-w-2xl mx-auto">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Make Your Own Card -->
          <button
            @click="currentView = 'create'"
            class="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105"
          >
            <div class="flex flex-col items-center text-center space-y-4">
              <div
                class="w-20 h-20 bg-flinc-gradient rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg group-hover:scale-110 transition-transform"
              >
                ✏️
              </div>
              <div>
                <h3 class="text-2xl font-bold text-flinc-darkgray mb-2">
                  Maak je Eigen Kaart
                </h3>
                <p class="text-gray-600 text-sm leading-relaxed">
                  Creëer je eigen bingo kaart met 9 persoonlijke opties. Slechts
                  één kaart per dag!
                </p>
              </div>
            </div>
          </button>

          <!-- View Other Cards -->
          <button
            @click="currentView = 'gallery'"
            class="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105"
          >
            <div class="flex flex-col items-center text-center space-y-4">
              <div
                class="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg group-hover:scale-110 transition-transform"
              >
                👁️
              </div>
              <div>
                <h3 class="text-2xl font-bold text-flinc-darkgray mb-2">
                  Bekijk Andere Kaarten
                </h3>
                <p class="text-gray-600 text-sm leading-relaxed">
                  Ontdek alle bingo kaarten van collega’s en volg hun voortgang!
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Create Card View -->
      <div v-if="currentView === 'create'" class="max-w-2xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
          <button
            @click="currentView = 'landing'"
            class="w-14 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ←
          </button>
          <div>
            <h2 class="text-3xl font-bold text-flinc-darkgray">
              Maak je Bingo Kaart
            </h2>
            <p class="text-gray-600 mt-1">
              Vul 9 opties in voor je dagelijkse bingo kaart
            </p>
          </div>
        </div>

        <div
          v-if="myCard"
          class="mb-6 p-4 bg-green-50 rounded-xl border border-green-300"
        >
          <p class="text-sm text-green-800 font-semibold">
            ✅ Je hebt al een kaart gemaakt vandaag!
          </p>
          <p class="text-xs text-green-700 mt-1">Volgende kaart morgen.</p>
        </div>

        <form @submit.prevent="submitCard" class="space-y-6" v-if="!myCard">
          <div>
            <label
              class="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3"
            >
              Kaarttitel
            </label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Bv. Maandag Bingo"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-flinc-blue focus:border-transparent transition-all"
              required
            />
          </div>

          <!-- 9 Squares Input -->
          <div class="space-y-3">
            <label
              class="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3"
            >
              9 Opties
            </label>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="(square, i) in form.squares"
                :key="i"
                class="space-y-2"
              >
                <div class="text-xs text-gray-500 text-center font-semibold">
                  #{{ i + 1 }}
                </div>
                <input
                  v-model="form.squares[i]"
                  type="text"
                  :placeholder="`Optie ${i + 1}`"
                  class="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-flinc-blue focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-6 py-4 bg-flinc-gradient text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? "Créëren..." : "Kaart Créëren" }}
          </button>

          <div
            v-if="error"
            class="p-4 rounded-xl bg-red-50 text-red-800 border border-red-300 text-sm font-semibold"
          >
            ❌ {{ error }}
          </div>
        </form>
      </div>
    </div>

    <!-- Gallery View -->
    <div v-if="currentView === 'gallery'">
      <div class="flex items-center gap-4 mb-8 ps-3">
        <button
          @click="currentView = 'landing'"
          class="w-14 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          ←
        </button>
        <div>
          <h2 class="text-3xl font-bold text-flinc-darkgray">
            Alle Bingo Kaarten
          </h2>
          <p class="text-gray-600 mt-1">
            {{ bingoCards.length }} kaarten vandaag
          </p>
        </div>
      </div>

      <div v-if="isLoading" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="h-96 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl animate-pulse"
        ></div>
      </div>

      <div v-else-if="bingoCards.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🎯</div>
        <h3 class="text-xl font-bold text-gray-800">Geen kaarten nog</h3>
        <p class="text-gray-600">
          Wees de eerste om een bingo kaart te créëren!
        </p>
      </div>

      <div v-else class="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="card in bingoCards"
          :key="card.id"
          class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-flinc-darkgray">
                {{ card.title }}
              </h3>
              <p class="text-sm text-gray-500">door {{ card.author_name }}</p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatDate(card.created_at) }}
              </p>
            </div>
            <div class="text-2xl">🎰</div>
          </div>

          <!-- Bingo Grid -->
          <div class="grid grid-cols-3 gap-2 mb-4">
            <div
              v-for="square in card.squares"
              :key="square.id"
              @click="
                myCard?.id === card.id && toggleSquareClick(card.id, square.id)
              "
              :class="[
                'p-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer aspect-square flex flex-col justify-center',
                square.checked
                  ? 'bg-green-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                myCard?.id !== card.id && 'cursor-not-allowed',
              ]"
            >
              <div class="text-xs leading-tight">{{ square.text }}</div>
              <div v-if="square.checked" class="text-sm mt-1">✅</div>
            </div>
          </div>

          <div v-if="myCard?.id === card.id" class="text-center">
            <p class="text-xs text-green-600 font-semibold">
              ✨ Dit is jouw kaart
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useBingoStore } from "../stores/bingoStore";
import { useUserStore } from "../stores/userStore";

export default defineComponent({
  name: "BingoView",
  data() {
    return {
      currentView: "landing",
      form: {
        title: "",
        squares: Array(9).fill(""),
      },
      isLoading: false,
      error: "",
    };
  },
  computed: {
    ...mapState(useBingoStore, ["bingoCards", "myCard"]),
  },
  methods: {
    async submitCard() {
      if (!this.form.title) {
        this.error = "Vul een titel in";
        return;
      }

      if (this.form.squares.some((s: string) => !s.trim())) {
        this.error = "Vul alle 9 opties in";
        return;
      }

      try {
        this.isLoading = true;
        this.error = "";
        const bingoStore = useBingoStore();
        await bingoStore.createCard(this.form.title, this.form.squares);
        this.form = { title: "", squares: Array(9).fill("") };
      } catch (error: any) {
        this.error = error.message || "Fout bij het créëren van de kaart";
      } finally {
        this.isLoading = false;
      }
    },

    async toggleSquareClick(cardId: number, squareId: number) {
      try {
        const bingoStore = useBingoStore();
        await bingoStore.toggleSquare(cardId, squareId);
      } catch (error) {
        console.error("Error toggling square:", error);
      }
    },

    formatDate(dateString: string) {
      const date = new Date(dateString);
      return date.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  async mounted() {
    const bingoStore = useBingoStore();
    await bingoStore.fetchAllCards();
    await bingoStore.fetchMyCard();
  },
});
</script>

