<script setup lang="ts">
import type { InventoryItem } from '../types/inventory'
import type { FlashcardMode } from '../types/quiz'

defineProps<{
  gameName: string
  items: InventoryItem[]
  loadingItem: InventoryItem | null
}>()

const emit = defineEmits<{
  startQuiz: [item: InventoryItem]
  startFlashcards: [item: InventoryItem, mode: FlashcardMode]
  back: []
}>()
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <button
        @click="emit('back')"
        class="text-gold hover:text-gold-light transition-colors mb-4 inline-flex items-center gap-2"
      >
        ← Retour aux jeux
      </button>
      <h2 class="text-3xl md:text-4xl font-bold text-gold mb-2">
        {{ gameName }}
      </h2>
      <p class="text-parchment/60">
        Choisissez un contenu pour commencer
      </p>
    </div>

    <!-- Content Cards Grid -->
    <div class="grid md:grid-cols-2 gap-6">
      <div
        v-for="item in items"
        :key="item.url"
        class="bg-dungeon-medium border-2 border-gold/30 rounded-xl p-6 hover:border-gold/60 transition-all"
      >
        <!-- Loading overlay -->
        <div
          v-if="loadingItem?.url === item.url"
          class="text-center py-4"
        >
          <div class="text-4xl mb-3 animate-pulse">📥</div>
          <p class="text-parchment/70">Chargement...</p>
        </div>

        <!-- Quiz Card -->
        <template v-else-if="item.type === 'Quizz'">
          <div class="text-5xl mb-4 text-center">📝</div>
          <h3 class="text-xl font-bold text-gold mb-2 text-center">{{ item.titre }}</h3>
          <p class="text-parchment/60 text-sm mb-4 text-center">
            Questions à choix multiples avec feedback immédiat
          </p>
          <button
            @click="emit('startQuiz', item)"
            class="w-full px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
          >
            🎲 Lancer le quiz
          </button>
        </template>

        <!-- Flashcard Card -->
        <template v-else-if="item.type === 'Flash'">
          <div class="text-5xl mb-4 text-center">🃏</div>
          <h3 class="text-xl font-bold text-gold mb-2 text-center">{{ item.titre }}</h3>
          <p class="text-parchment/60 text-sm mb-4 text-center">
            Cartes recto-verso pour réviser
          </p>
          <div class="space-y-2">
            <button
              @click="emit('startFlashcards', item, 'partial')"
              class="w-full px-6 py-2 bg-dungeon-light border border-gold/50 text-gold font-semibold rounded-lg transition-all duration-300 hover:bg-gold/20"
            >
              ⚡ Mode rapide (30 cartes)
            </button>
            <button
              @click="emit('startFlashcards', item, 'full')"
              class="w-full px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
            >
              📚 Mode complet
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="text-center py-12">
      <div class="text-5xl mb-4">📭</div>
      <p class="text-parchment/60">Aucun contenu disponible pour ce jeu</p>
    </div>
  </div>
</template>
