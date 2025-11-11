<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-flinc-darkgray mb-4">
        💬 Chat & Community
      </h2>
      <p class="text-gray-600">Praat met je collega's en teams</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Contacts/Channels List -->
      <div class="lg:col-span-1">
        <div class="card">
          <div class="mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Zoek persoon of kanaal..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-flinc-pink focus:ring-2 focus:ring-flinc-pink focus:ring-opacity-20 outline-none"
            />
          </div>

          <div class="space-y-1">
            <button
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="selectedContact = contact"
              class="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left"
              :class="
                selectedContact?.id === contact.id
                  ? 'bg-flinc-pink text-white'
                  : 'hover:bg-flinc-gray'
              "
            >
              <div class="relative">
                <img
                  :src="contact.avatar"
                  :alt="contact.name"
                  class="w-10 h-10 rounded-full"
                />
                <span
                  v-if="contact.online"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                ></span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold truncate">{{ contact.name }}</p>
                <p
                  class="text-xs truncate"
                  :class="
                    selectedContact?.id === contact.id
                      ? 'text-white opacity-90'
                      : 'text-gray-500'
                  "
                >
                  {{ contact.lastMessage }}
                </p>
              </div>
              <span
                v-if="contact.unread > 0"
                class="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-flinc-pink rounded-full"
              >
                {{ contact.unread }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Chat Window -->
      <div class="lg:col-span-2">
        <div v-if="selectedContact" class="card h-[600px] flex flex-col">
          <!-- Chat Header -->
          <div
            class="flex items-center justify-between pb-4 border-b border-gray-200"
          >
            <div class="flex items-center space-x-3">
              <img
                :src="selectedContact.avatar"
                :alt="selectedContact.name"
                class="w-12 h-12 rounded-full"
              />
              <div>
                <h3 class="font-bold text-flinc-darkgray">
                  {{ selectedContact.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ selectedContact.role }}</p>
              </div>
            </div>
            <button
              class="p-2 hover:bg-flinc-gray rounded-lg transition-colors"
            >
              <svg
                class="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto py-4 space-y-4">
            <div
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="message.sender === 'me' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl"
                :class="
                  message.sender === 'me'
                    ? 'bg-flinc-pink text-white rounded-br-none'
                    : 'bg-gray-100 text-flinc-darkgray rounded-bl-none'
                "
              >
                <p>{{ message.text }}</p>
                <p
                  class="text-xs mt-1"
                  :class="
                    message.sender === 'me'
                      ? 'text-white opacity-75'
                      : 'text-gray-500'
                  "
                >
                  {{ message.time }}
                </p>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="pt-4 border-t border-gray-200">
            <div class="flex items-center space-x-2">
              <button
                class="p-2 hover:bg-flinc-gray rounded-lg transition-colors"
              >
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <input
                v-model="messageInput"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Type een bericht..."
                class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-flinc-pink focus:ring-2 focus:ring-flinc-pink focus:ring-opacity-20 outline-none"
              />
              <button @click="sendMessage" class="btn-primary">
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="card h-[600px] flex items-center justify-center">
          <div class="text-center text-gray-500">
            <svg
              class="w-24 h-24 mx-auto mb-4 text-gray-300"
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
            <h3 class="text-xl font-semibold mb-2">Selecteer een gesprek</h3>
            <p>Kies een collega of kanaal om te beginnen met chatten</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Polls Section -->
    <div class="mt-8">
      <h3 class="text-2xl font-bold text-flinc-darkgray mb-4">
        📊 Polls & Vragen
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="poll in polls" :key="poll.id" class="card">
          <h4 class="font-bold text-flinc-darkgray mb-3">
            {{ poll.question }}
          </h4>
          <div class="space-y-2">
            <button
              v-for="option in poll.options"
              :key="option.id"
              @click="votePoll(poll.id, option.id)"
              class="w-full text-left px-4 py-3 rounded-lg border-2 transition-all"
              :class="
                option.voted
                  ? 'border-flinc-pink bg-pink-50'
                  : 'border-gray-200 hover:border-flinc-pink hover:bg-pink-50'
              "
            >
              <div class="flex justify-between items-center mb-1">
                <span class="font-medium">{{ option.text }}</span>
                <span class="text-sm text-gray-600">{{ option.votes }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-flinc-pink h-2 rounded-full transition-all duration-300"
                  :style="{ width: option.votes + '%' }"
                ></div>
              </div>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-3">
            {{ poll.totalVotes }} stemmen
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Contact {
  id: number;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  sender: "me" | "other";
  text: string;
  time: string;
}

interface Poll {
  id: number;
  question: string;
  options: Array<{
    id: number;
    text: string;
    votes: number;
    voted: boolean;
  }>;
  totalVotes: number;
}

export default defineComponent({
  name: "ChatView",
  data() {
    return {
      searchQuery: "",
      selectedContact: null as Contact | null,
      messageInput: "",
      contacts: [
        {
          id: 1,
          name: "Linda de Vries",
          role: "Manager",
          avatar:
            "https://ui-avatars.com/api/?name=Linda+de+Vries&background=FF6B35&color=fff",
          lastMessage: "Zullen we dit morgen bespreken?",
          unread: 2,
          online: true,
        },
        {
          id: 2,
          name: "Digital Innovation Team",
          role: "Team Channel",
          avatar:
            "https://ui-avatars.com/api/?name=Digital+Innovation&background=004E89&color=fff",
          lastMessage: "Mark: Nieuwe update beschikbaar",
          unread: 5,
          online: true,
        },
        {
          id: 3,
          name: "Rob Hendriks",
          role: "Developer",
          avatar:
            "https://ui-avatars.com/api/?name=Rob+Hendriks&background=1A659E&color=fff",
          lastMessage: "Bedankt voor de hulp!",
          unread: 0,
          online: false,
        },
      ] as Contact[],
      messages: [] as Message[],
      polls: [
        {
          id: 1,
          question: "Waar zullen we het volgende teamuitje houden?",
          options: [
            { id: 1, text: "Escape room Utrecht", votes: 45, voted: false },
            { id: 2, text: "High tea Amsterdam", votes: 30, voted: false },
            { id: 3, text: "Outdoor Veluwe", votes: 25, voted: false },
          ],
          totalVotes: 28,
        },
        {
          id: 2,
          question: "Wat vind je van het nieuwe kantoorbeleid?",
          options: [
            { id: 1, text: "Zeer tevreden", votes: 60, voted: false },
            { id: 2, text: "Tevreden", votes: 30, voted: false },
            { id: 3, text: "Kan beter", votes: 10, voted: false },
          ],
          totalVotes: 42,
        },
      ] as Poll[],
    };
  },
  computed: {
    filteredContacts() {
      if (!this.searchQuery) return this.contacts;
      return this.contacts.filter((c) =>
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    sendMessage() {
      if (this.messageInput.trim() && this.selectedContact) {
        this.messages.push({
          id: this.messages.length + 1,
          sender: "me",
          text: this.messageInput.trim(),
          time: new Date().toLocaleTimeString("nl-NL", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        this.messageInput = "";
      }
    },
    votePoll(pollId: number, optionId: number) {
      const poll = this.polls.find((p) => p.id === pollId);
      if (poll) {
        const option = poll.options.find((o) => o.id === optionId);
        if (option && !option.voted) {
          option.voted = true;
          poll.totalVotes++;
        }
      }
    },
  },
  watch: {
    selectedContact(newContact) {
      if (newContact) {
        // Simulate loading messages
        this.messages = [
          {
            id: 1,
            sender: "other",
            text: "Hoi! Hoe gaat het?",
            time: "10:30",
          },
          {
            id: 2,
            sender: "me",
            text: "Goed hoor! Met jou?",
            time: "10:32",
          },
          {
            id: 3,
            sender: "other",
            text: newContact.lastMessage,
            time: "10:35",
          },
        ];
        // Mark as read
        newContact.unread = 0;
      }
    },
  },
});
</script>

