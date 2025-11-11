<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-12">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 bg-flinc-gradient rounded-2xl flex items-center justify-center"
          >
            <Settings :size="40" class="text-white" />
          </div>
          <div>
            <h1
              class="text-5xl font-bold bg-flinc-gradient bg-clip-text text-transparent"
            >
              Admin Panel
            </h1>
            <p class="text-gray-600 text-lg mt-2">
              Beheer alle events en nieuws
            </p>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left: Create Form (Sticky) -->
        <div class="lg:col-span-1">
          <div
            class="bg-white rounded-3xl shadow-2xl p-8 sticky top-8 border border-gray-100"
          >
            <div class="flex items-center gap-3 mb-8">
              <div
                class="w-14 h-14 bg-flinc-gradient rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <Plus :size="28" />
              </div>
              <h2 class="text-2xl font-bold text-flinc-darkgray">
                Nieuw Event
              </h2>
            </div>

            <form @submit.prevent="submitEvent" class="space-y-5">
              <!-- Title -->
              <div>
                <label
                  for="title"
                  class="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3"
                >
                  Titel
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  placeholder="Bv. Team outing Q1"
                  class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-flinc-blue focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  required
                />
              </div>

              <!-- Category -->
              <div>
                <label
                  for="category"
                  class="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3"
                >
                  Categorie
                </label>
                <select
                  id="category"
                  v-model="form.category"
                  class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-flinc-blue focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  required
                >
                  <option value="">Kies...</option>
                  <option value="nieuws">📢 Nieuws</option>
                  <option value="event">🎪 Event</option>
                  <option value="success">🏆 Succes</option>
                  <option value="verjaardag">🎉 Verjaardag</option>
                </select>
              </div>

              <!-- Description -->
              <div>
                <label
                  for="content"
                  class="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3"
                >
                  Beschrijving
                </label>
                <textarea
                  id="content"
                  v-model="form.content"
                  placeholder="Beschrijf het event..."
                  rows="4"
                  class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-flinc-blue focus:border-transparent transition-all resize-none bg-gray-50 hover:bg-white"
                  required
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full px-6 py-4 bg-flinc-gradient text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
              >
                <CheckCircle v-if="!isLoading" :size="20" />
                <span v-if="isLoading">Toevoegen...</span>
                <span v-else>Toevoegen</span>
              </button>

              <!-- Messages -->
              <transition name="fade">
                <div
                  v-if="formMessage"
                  :class="[
                    'p-5 rounded-xl font-semibold flex items-start gap-3 border-l-4 text-sm',
                    formMessage.type === 'success'
                      ? 'bg-green-50 text-green-800 border-l-green-500'
                      : 'bg-red-50 text-red-800 border-l-red-500',
                  ]"
                >
                  <CheckCircle
                    v-if="formMessage.type === 'success'"
                    :size="20"
                    class="flex-shrink-0 mt-1"
                  />
                  <X v-else :size="20" class="flex-shrink-0 mt-1" />
                  <span>{{ formMessage.text }}</span>
                </div>
              </transition>
            </form>
          </div>
        </div>

        <!-- Right: Events List -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <ListChecks :size="28" class="text-blue-600" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-flinc-darkgray">Events</h2>
                <p class="text-sm text-gray-600">
                  {{ events.length }}
                  {{ events.length === 1 ? "event" : "events" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loadingEvents" class="space-y-4">
            <div
              v-for="i in 3"
              :key="i"
              class="h-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl animate-pulse"
            ></div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="events.length === 0"
            class="col-span-full text-center py-20"
          >
            <div class="flex justify-center mb-6">
              <Mail :size="80" class="text-gray-300" />
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">
              Geen events yet
            </h3>
            <p class="text-gray-600">
              Maak je eerste event aan in het formulier →
            </p>
          </div>

          <!-- Events Grid -->
          <div v-else class="space-y-4">
            <transition-group name="list">
              <div
                v-for="event in events"
                :key="event.id"
                class="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-flinc-blue hover:shadow-lg transition-all duration-300 group"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start gap-3 mb-3">
                      <h3
                        class="text-lg font-bold text-flinc-darkgray group-hover:text-flinc-blue transition-colors line-clamp-1"
                      >
                        {{ event.title }}
                      </h3>
                      <span
                        class="px-3 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap shadow-md"
                        :class="getCategoryClass(event.category)"
                      >
                        {{ getCategoryLabel(event.category) }}
                      </span>
                    </div>
                    <p class="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {{ event.content }}
                    </p>
                    <div
                      class="flex flex-wrap items-center gap-4 text-xs text-gray-500"
                    >
                      <span class="flex items-center gap-1"
                        >👤 {{ event.author_name || "Onbekend" }}</span
                      >
                      <span class="flex items-center gap-1"
                        >📅 {{ formatDate(event.created_at) }}</span
                      >
                    </div>
                  </div>

                  <div class="flex gap-2 flex-shrink-0">
                    <button
                      @click="editEvent(event)"
                      class="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 hover:shadow-lg transition-all transform hover:scale-110 active:scale-95"
                      title="Edit event"
                    >
                      <Edit :size="20" />
                    </button>
                    <button
                      @click="deleteEvent(event.id)"
                      class="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:shadow-lg transition-all transform hover:scale-110 active:scale-95"
                      title="Delete event"
                    >
                      <Trash2 :size="20" />
                    </button>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <transition name="modal">
      <div
        v-if="editingEvent"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full border border-gray-100 animate-in"
        >
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
            >
              <Edit :size="24" class="text-blue-600" />
            </div>
            <h3 class="text-2xl font-bold text-flinc-darkgray">Edit Event</h3>
          </div>

          <form @submit.prevent="updateEvent" class="space-y-5">
            <div>
              <label
                class="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3"
              >
                Titel
              </label>
              <input
                v-model="editingEvent.title"
                type="text"
                class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-flinc-blue focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3"
              >
                Categorie
              </label>
              <select
                v-model="editingEvent.category"
                class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-flinc-blue focus:border-transparent transition-all"
              >
                <option value="nieuws">📢 Nieuws</option>
                <option value="event">🎪 Event</option>
                <option value="success">🏆 Succes</option>
                <option value="verjaardag">🎉 Verjaardag</option>
              </select>
            </div>

            <div>
              <label
                class="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3"
              >
                Beschrijving
              </label>
              <textarea
                v-model="editingEvent.content"
                rows="4"
                class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-flinc-blue focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 px-4 py-3.5 bg-flinc-gradient text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle v-if="!isLoading" :size="18" />
                <span>Opslaan</span>
              </button>
              <button
                type="button"
                @click="editingEvent = null"
                class="flex-1 px-4 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <X :size="18" />
                <span>Sluiten</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "../stores/userStore";
import { newsAPI } from "../services/api";
import {
  Settings,
  Plus,
  ListChecks,
  Mail,
  Edit,
  Trash2,
  X,
  CheckCircle,
} from "lucide-vue-next";

interface Event {
  id?: number;
  title: string;
  content: string;
  category: string;
  author_name?: string;
  created_at?: string;
}

interface FormMessage {
  type: "success" | "error";
  text: string;
}

export default defineComponent({
  name: "AdminEventsView",
  components: {
    Settings,
    Plus,
    ListChecks,
    Mail,
    Edit,
    Trash2,
    X,
    CheckCircle,
  },
  data() {
    return {
      events: [] as Event[],
      form: {
        title: "",
        content: "",
        category: "",
      },
      editingEvent: null as Event | null,
      isLoading: false,
      loadingEvents: true,
      formMessage: null as FormMessage | null,
    };
  },
  computed: {
    ...mapState(useUserStore, ["isAdmin", "isLoggedIn"]),
  },
  methods: {
    async fetchEvents() {
      try {
        this.loadingEvents = true;
        const data = await newsAPI.getAll();
        this.events = data;
      } catch (error) {
        console.error("Error fetching events:", error);
        this.showMessage("Fout bij laden van events", "error");
      } finally {
        this.loadingEvents = false;
      }
    },
    async submitEvent() {
      if (!this.form.title || !this.form.content || !this.form.category) {
        this.showMessage("Vul alle verplichte velden in", "error");
        return;
      }

      try {
        this.isLoading = true;
        await newsAPI.create({
          title: this.form.title,
          content: this.form.content,
          category: this.form.category,
        });
        this.showMessage("Event succesvol toegevoegd! ✨", "success");
        this.resetForm();
        await this.fetchEvents();
      } catch (error) {
        console.error("Error creating event:", error);
        this.showMessage("Fout bij het toevoegen van event", "error");
      } finally {
        this.isLoading = false;
      }
    },
    async updateEvent() {
      if (!this.editingEvent || !this.editingEvent.id) return;

      try {
        this.isLoading = true;
        await newsAPI.update(this.editingEvent.id, {
          title: this.editingEvent.title,
          content: this.editingEvent.content,
          category: this.editingEvent.category,
        });
        this.showMessage("Event bijgewerkt!", "success");
        this.editingEvent = null;
        await this.fetchEvents();
      } catch (error) {
        console.error("Error updating event:", error);
        this.showMessage("Fout bij het bijwerken van event", "error");
      } finally {
        this.isLoading = false;
      }
    },
    async deleteEvent(id: number) {
      if (!confirm("Weet je zeker dat je dit event wilt verwijderen?")) {
        return;
      }

      try {
        this.isLoading = true;
        await newsAPI.delete(id);
        this.showMessage("Event verwijderd!", "success");
        await this.fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        this.showMessage("Fout bij het verwijderen van event", "error");
      } finally {
        this.isLoading = false;
      }
    },
    editEvent(event: Event) {
      this.editingEvent = { ...event };
    },
    resetForm() {
      this.form = {
        title: "",
        content: "",
        category: "",
      };
      this.formMessage = null;
    },
    showMessage(text: string, type: "success" | "error") {
      this.formMessage = { text, type };
      if (type === "success") {
        setTimeout(() => {
          this.formMessage = null;
        }, 3000);
      }
    },
    getCategoryClass(category: string) {
      const classes: Record<string, string> = {
        nieuws: "bg-blue-500 shadow-lg",
        success: "bg-green-500 shadow-lg",
        verjaardag: "bg-yellow-500 shadow-lg",
        event: "bg-purple-500 shadow-lg",
      };
      return classes[category] || "bg-gray-500 shadow-lg";
    },
    getCategoryLabel(category: string) {
      const labels: Record<string, string> = {
        nieuws: "📢 Nieuws",
        success: "🏆 Succes",
        verjaardag: "🎉 Verjaardag",
        event: "🎪 Event",
      };
      return labels[category] || category;
    },
    formatDate(dateString: string) {
      const date = new Date(dateString);
      return date.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
      });
    },
  },
  async mounted() {
    if (!this.isAdmin) {
      this.$router.push("/");
      return;
    }
    await this.fetchEvents();
  },
});
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.list-move {
  transition: transform 0.3s ease;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-in {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
