<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-flinc-darkgray mb-4">
        🎮 Spel & Quiz
      </h2>
      <p class="text-gray-600">Test je kennis en verdien punten!</p>
    </div>

    <!-- Quiz Section -->
    <div v-if="!quizCompleted" class="card mb-8">
      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span
            >Vraag {{ currentQuestionIndex + 1 }} van {{ totalQuestions }}</span
          >
          <span>Score: {{ userScore }} punten</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="bg-gradient-to-r from-flinc-pink to-flinc-yellow h-3 rounded-full transition-all duration-300"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Question -->
      <div v-if="currentQuestion" class="space-y-6">
        <h3 class="text-2xl font-bold text-flinc-darkgray">
          {{ currentQuestion.question }}
        </h3>

        <!-- Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="answerQuestion(index)"
            class="p-6 rounded-xl border-2 border-gray-200 hover:border-flinc-pink hover:bg-pink-50 transition-all duration-200 text-left font-semibold text-flinc-darkgray hover:scale-105"
          >
            <span
              class="inline-block w-8 h-8 bg-flinc-pink text-white rounded-full mr-3 text-center leading-8"
            >
              {{ String.fromCharCode(65 + index) }}
            </span>
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quiz Results -->
    <div v-else class="card mb-8 text-center">
      <div class="mb-6">
        <div
          class="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-flinc-pink to-flinc-yellow rounded-full flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h3 class="text-3xl font-bold text-flinc-darkgray mb-2">
          Quiz Voltooid!
        </h3>
        <p class="text-xl text-gray-600 mb-4">
          Je score: {{ userScore }} / 100 punten
        </p>
        <p class="text-gray-600">{{ getScoreMessage }}</p>
      </div>

      <!-- Answer Review -->
      <div class="mb-6 space-y-4 text-left">
        <h4 class="font-bold text-flinc-darkgray">📝 Antwoorden:</h4>
        <div
          v-for="(question, index) in currentQuiz"
          :key="question.id"
          class="p-4 rounded-lg"
          :class="
            userAnswers[index] === question.correctAnswer
              ? 'bg-green-50 border-2 border-green-200'
              : 'bg-red-50 border-2 border-red-200'
          "
        >
          <div class="flex items-start space-x-2">
            <svg
              v-if="userAnswers[index] === question.correctAnswer"
              class="w-6 h-6 text-green-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="flex-1">
              <p class="font-semibold text-flinc-darkgray mb-1">
                {{ question.question }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Correct antwoord:</span>
                {{ question.options[question.correctAnswer] }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ question.explanation }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button @click="resetQuiz" class="btn-primary">Opnieuw Spelen</button>
    </div>

    <!-- Leaderboard -->
    <div class="card">
      <h3 class="text-2xl font-bold text-flinc-darkgray mb-6 flex items-center">
        <svg
          class="w-8 h-8 mr-2 text-flinc-yellow"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        Leaderboard
      </h3>

      <div class="space-y-3">
        <div
          v-for="(entry, index) in leaderboard"
          :key="index"
          class="flex items-center space-x-4 p-4 rounded-xl transition-all hover:bg-flinc-gray"
          :class="
            index < 3 ? 'bg-gradient-to-r from-orange-50 to-yellow-50' : ''
          "
        >
          <div
            class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
            :class="getRankClass(index)"
          >
            {{ index + 1 }}
          </div>
          <img
            :src="entry.avatar"
            :alt="entry.name"
            class="w-12 h-12 rounded-full"
          />
          <div class="flex-1">
            <p class="font-bold text-flinc-darkgray">{{ entry.name }}</p>
            <p class="text-sm text-gray-600">{{ entry.team }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-flinc-pink">
              {{ entry.score }}
            </p>
            <p class="text-xs text-gray-500">punten</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "pinia";
import { useQuizStore } from "../stores/quizStore";

export default defineComponent({
  name: "SpelView",
  computed: {
    ...mapState(useQuizStore, [
      "currentQuiz",
      "leaderboard",
      "userScore",
      "currentQuestionIndex",
      "quizCompleted",
      "userAnswers",
      "currentQuestion",
      "totalQuestions",
      "progress",
    ]),
    getScoreMessage() {
      if (this.userScore >= 80)
        return "🎉 Uitstekend! Je kent Buro Flinc door en door!";
      if (this.userScore >= 60)
        return "👍 Goed gedaan! Je weet veel over Buro Flinc!";
      if (this.userScore >= 40)
        return "💪 Niet slecht! Er is nog wat te leren.";
      return "📚 Blijf oefenen! Je komt er wel!";
    },
  },
  methods: {
    ...mapActions(useQuizStore, ["answerQuestion", "resetQuiz"]),
    getRankClass(index: number) {
      if (index === 0)
        return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white";
      if (index === 1)
        return "bg-gradient-to-br from-gray-300 to-gray-400 text-white";
      if (index === 2)
        return "bg-gradient-to-br from-orange-400 to-orange-600 text-white";
      return "bg-gray-100 text-gray-600";
    },
  },
});
</script>

