<template>
  <div
    class="bg-white flex justify-center px-4 sm:px-6 lg:px-8 h-[90vh] padding-top-10"
  >
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
        <!-- Email Input -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-flinc-darkgray mb-2"
          >
            E-mailadres
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="jouw.email@buro-flinc.nl"
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-flinc-pink focus:ring-2 focus:ring-flinc-pink focus:ring-opacity-20 outline-none transition-all"
          />
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

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full btn-primary py-3 font-semibold"
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

export default defineComponent({
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      this.isLoading = true;

      try {
        // Simulate login delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Validate inputs
        if (!this.email || !this.password) {
          this.errorMessage = "Vul aub je e-mailadres en wachtwoord in.";
          return;
        }

        // TODO: Add actual authentication logic here
        console.log("Login attempt:", {
          email: this.email,
          password: this.password,
          rememberMe: this.rememberMe,
        });

        // For now, redirect to home
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = "Er is een fout opgetreden. Probeer het opnieuw.";
      } finally {
        this.isLoading = false;
      }
    },
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

