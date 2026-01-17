<script setup lang="ts">
import { ref, computed } from "vue";
import type { Flashcard } from "../types/quiz";

const props = defineProps<{
	flashcards: Flashcard[];
}>();

const emit = defineEmits<{
	finish: [known: number, total: number];
	quit: [];
}>();

const currentIndex = ref(0);
const isFlipped = ref(false);
const knownCount = ref(0);

const currentCard = computed(() => props.flashcards[currentIndex.value]);
const totalCards = computed(() => props.flashcards.length);
const progress = computed(() => ((currentIndex.value + 1) / totalCards.value) * 100);

function flipCard() {
	isFlipped.value = !isFlipped.value;
}

function markAsKnown() {
	knownCount.value++;
	nextCard();
}

function markAsUnknown() {
	nextCard();
}

const isTransitioning = ref(false);

function nextCard() {
	isTransitioning.value = true;
	isFlipped.value = false;

	// Attendre la fin de l'animation de flip avant de changer de carte
	setTimeout(() => {
		if (currentIndex.value < props.flashcards.length - 1) {
			currentIndex.value++;
		} else {
			emit("finish", knownCount.value, totalCards.value);
		}
		isTransitioning.value = false;
	}, 300);
}
</script>

<template>
	<div class="w-full max-w-3xl mx-auto">
		<!-- Progress -->
		<div class="mb-6 text-center">
			<span class="text-gold font-semibold">Carte {{ currentIndex + 1 }} / {{ totalCards }}</span>
			<div class="mt-2 h-2 bg-dungeon-medium rounded-full overflow-hidden">
				<div class="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500" :style="{ width: `${progress}%` }"></div>
			</div>
			<div class="mt-2 text-sm text-parchment/60">
				Connues : <span class="text-emerald font-semibold">{{ knownCount }}</span>
			</div>
		</div>

		<!-- Flashcard -->
		<div class="perspective-1000 mb-6 cursor-pointer" @click="flipCard">
			<div class="relative w-full min-h-[300px] transition-transform duration-500 transform-style-preserve-3d" :class="{ 'rotate-y-180': isFlipped }">
				<!-- Front -->
				<div class="absolute inset-0 backface-hidden bg-dungeon-medium border-2 border-gold/30 rounded-xl p-8 shadow-xl flex flex-col justify-center">
					<div class="text-center mb-4">
						<span class="text-gold/60 text-sm uppercase tracking-wider">Question</span>
					</div>
					<p class="text-xl md:text-2xl text-parchment font-semibold leading-relaxed text-center" v-html="currentCard.f"></p>
					<div class="text-center mt-6">
						<span class="text-gold/50 text-sm">Cliquez pour retourner</span>
					</div>
				</div>

				<!-- Back -->
				<div class="absolute inset-0 backface-hidden rotate-y-180 bg-dungeon-light border-2 border-gold/50 rounded-xl p-8 shadow-xl flex flex-col justify-center">
					<div class="text-center mb-4">
						<span class="text-gold text-sm uppercase tracking-wider">Réponse</span>
					</div>
					<p class="text-lg md:text-xl text-parchment leading-relaxed text-center" v-html="currentCard.b"></p>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div v-if="isFlipped && !isTransitioning" class="flex justify-center gap-4">
			<button @click="markAsUnknown" class="px-6 py-3 bg-blood/20 border-2 border-blood text-red-300 font-bold rounded-lg transition-all duration-300 hover:bg-blood/40">✗ Je ne savais pas</button>
			<button @click="markAsKnown" class="px-6 py-3 bg-emerald/20 border-2 border-emerald text-emerald font-bold rounded-lg transition-all duration-300 hover:bg-emerald/40">✓ Je savais</button>
		</div>

		<!-- Quit button -->
		<div class="mt-8 text-center">
			<button @click="$emit('quit')" class="text-parchment/40 hover:text-parchment/70 text-sm underline underline-offset-4 transition-colors">Quitter les flashcards</button>
		</div>
	</div>
</template>

<style scoped>
.perspective-1000 {
	perspective: 1000px;
}

.transform-style-preserve-3d {
	transform-style: preserve-3d;
}

.backface-hidden {
	backface-visibility: hidden;
}

.rotate-y-180 {
	transform: rotateY(180deg);
}
</style>
