<template>
  <div class="bg-white flex justify-center px-4 sm:px-6 lg:px-8 padding-top-10">
    <div class="w-full max-w-md space-y-8">
      <!-- Logo Section -->
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-flinc-gradient rounded-lg mb-4"
        >
          <span class="text-white font-bold text-3xl">F</span>
        </div>
        <h1
          class="text-3xl font-bold bg-flinc-gradient bg-clip-text text-transparent mb-2"
        >
          Buro Flinc
        </h1>
        <p class="text-gray-600">Jouw digitale werkplek</p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- Username Input -->
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-flinc-darkgray mb-2"
          >
            Gebruikersnaam
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="jouw gebruikersnaam"
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-flinc-pink focus:ring-2 focus:ring-flinc-pink focus:ring-opacity-20 outline-none transition-all"
          />
          <p class="text-xs text-gray-500 mt-1">Demo: admin / moderator</p>
        </div>

        <!-- Password Input -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-flinc-darkgray mb-2"
          >
            Wachtwoord
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-flinc-pink focus:ring-2 focus:ring-flinc-pink focus:ring-opacity-20 outline-none transition-all"
          />
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Inloggen</span>
          <span v-else>Inloggen...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { authAPI } from "@/services/api";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      isLoading: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      this.successMessage = "";
      this.isLoading = true;

      try {
        // Validate inputs
        if (!this.username || !this.password) {
          this.errorMessage = "Vul aub je gebruikersnaam en wachtwoord in.";
          this.isLoading = false;
          return;
        }

        // Call API to login
        const response = await authAPI.login(this.username, this.password);

        // Store the token
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userId", response.user.id);
        console.log("Setting userId:", response.user);
        localStorage.setItem("username", response.user.username);
        localStorage.setItem("isAdmin", response.user.isAdmin);

        // Update user store
        const userStore = useUserStore();
        userStore.setUser({
          id: response.user.id,
          username: response.user.username,
          isAdmin: response.user.isAdmin,
        });

        this.successMessage = `Welkom ${response.user.username}! Je wordt doorgestuurd...`;

        // Redirect to home after a brief delay
        setTimeout(() => {
          this.$router.push("/");
        }, 1000);
      } catch (error: any) {
        console.error("Login error:", error);
        this.errorMessage =
          error.message || "Er is een fout opgetreden. Probeer het opnieuw.";
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    // Check if already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      this.$router.push("/");
    }
  },
});
</script>

<style scoped>
input[type="checkbox"] {
  accent-color: #e91e63;
}
.padding-top-10 {
  padding-top: 5rem;
}
</style>

