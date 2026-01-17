<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import type { QuizState, Question, Flashcard, GameMode, FlashcardMode } from "./types/quiz";
import type { InventoryItem } from "./types/inventory";
import { useGameContent } from "./composables/useGameContent";
import QuizQuestion from "./components/QuizQuestion.vue";
import QuizResult from "./components/QuizResult.vue";
import FlashcardGame from "./components/FlashcardGame.vue";
import FlashcardResult from "./components/FlashcardResult.vue";
import GameMenu from "./components/GameMenu.vue";
import ContentMenu from "./components/ContentMenu.vue";
import { version } from "../package.json";
import "./assets/styles/global.css";

// Game content composable
const { loadingState, error, selectedGame, selectedItem, selectedContent, games, selectedGameItems, loadInventory, loadContent, selectGame, clearSelection, clearGameSelection, refreshAll } = useGameContent();

// State
const gameMode = ref<GameMode>("menu");
const quizState = ref<QuizState>("start");
const flashcardMode = ref<FlashcardMode>("full");
const loadingItem = ref<InventoryItem | null>(null);

// Quiz state
const shuffledQuestions = ref<Question[]>([]);
const currentQuestionIndex = ref(0);
const score = ref(0);

// Flashcard state
const shuffledFlashcards = ref<Flashcard[]>([]);
const flashcardKnown = ref(0);
const flashcardTotal = ref(0);

// Computed
const currentQuestion = computed(() => shuffledQuestions.value[currentQuestionIndex.value]);
const totalQuizQuestions = computed(() => shuffledQuestions.value.length);

const headerTitle = computed(() => {
	if (selectedItem.value) {
		return selectedItem.value.titre;
	}
	if (selectedGame.value) {
		return selectedGame.value;
	}
	return "Flash & Quizz";
});

// Utility
function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// Game selection handlers
function handleSelectGame(game: string) {
	selectGame(game);
	gameMode.value = "gameSelection";
}

// Direct start handlers
async function handleStartQuiz(item: InventoryItem) {
	loadingItem.value = item;
	await loadContent(item);
	loadingItem.value = null;

	if (selectedContent.value && selectedItem.value?.type === "Quizz") {
		shuffledQuestions.value = shuffleArray(selectedContent.value as Question[]);
		quizState.value = "playing";
		currentQuestionIndex.value = 0;
		score.value = 0;
		gameMode.value = "quiz";
	}
}

async function handleStartFlashcards(item: InventoryItem, mode: FlashcardMode) {
	loadingItem.value = item;
	await loadContent(item);
	loadingItem.value = null;

	if (selectedContent.value && selectedItem.value?.type === "Flash") {
		flashcardMode.value = mode;
		const shuffled = shuffleArray(selectedContent.value as Flashcard[]);
		shuffledFlashcards.value = mode === "partial" ? shuffled.slice(0, 30) : shuffled;
		flashcardKnown.value = 0;
		flashcardTotal.value = shuffledFlashcards.value.length;
		gameMode.value = "flashcard";
		quizState.value = "playing";
	}
}

// Quiz functions
function handleAnswer(isCorrect: boolean) {
	if (isCorrect) {
		score.value++;
	}

	if (currentQuestionIndex.value < shuffledQuestions.value.length - 1) {
		currentQuestionIndex.value++;
		nextTick(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});
	} else {
		quizState.value = "finished";
	}
}

function restartQuiz() {
	if (!selectedContent.value) return;
	shuffledQuestions.value = shuffleArray(selectedContent.value as Question[]);
	quizState.value = "playing";
	currentQuestionIndex.value = 0;
	score.value = 0;
}

// Flashcard functions
function handleFlashcardFinish(known: number, total: number) {
	flashcardKnown.value = known;
	flashcardTotal.value = total;
	quizState.value = "finished";
}

function restartFlashcards() {
	if (!selectedContent.value || !selectedItem.value) return;
	const shuffled = shuffleArray(selectedContent.value as Flashcard[]);
	shuffledFlashcards.value = flashcardMode.value === "partial" ? shuffled.slice(0, 30) : shuffled;
	flashcardKnown.value = 0;
	flashcardTotal.value = shuffledFlashcards.value.length;
	quizState.value = "playing";
}

// Navigation
function goToMenu() {
	gameMode.value = "menu";
	quizState.value = "start";
	clearSelection();
}

function goToGameSelection() {
	gameMode.value = "gameSelection";
	quizState.value = "start";
	clearGameSelection();
}

async function handleRefresh() {
	await refreshAll();
}

// Load inventory on mount
onMounted(() => {
	loadInventory();
});
</script>

<template>
	<div class="min-h-screen bg-dungeon-dark text-parchment">
		<!-- Header -->
		<header class="py-6 border-b border-gold/20">
			<div class="container mx-auto px-4">
				<h1 class="text-2xl md:text-3xl font-bold text-center cursor-pointer" @click="goToMenu">
					<span class="text-gold">⚔️</span>
					<span class="mx-2">{{ headerTitle }}</span>
					<span class="text-gold">⚔️</span>
				</h1>
			</div>
		</header>

		<!-- Main Content -->
		<main class="container mx-auto px-4 py-8">
			<!-- ==================== MAIN MENU (Game Selection) ==================== -->
			<GameMenu v-if="gameMode === 'menu'" :games="games" :loading-state="loadingState" :error="error" @select-game="handleSelectGame" @refresh="handleRefresh" />

			<!-- ==================== GAME SELECTION (Content Cards) ==================== -->
			<ContentMenu v-else-if="gameMode === 'gameSelection'" :game-name="selectedGame || ''" :items="selectedGameItems" :loading-item="loadingItem" @start-quiz="handleStartQuiz" @start-flashcards="handleStartFlashcards" @back="goToMenu" />

			<!-- ==================== QUIZ MODE ==================== -->
			<template v-else-if="gameMode === 'quiz'">
				<!-- Quiz Questions -->
				<QuizQuestion v-if="quizState === 'playing'" :key="currentQuestionIndex" :question="currentQuestion" :question-number="currentQuestionIndex + 1" :total-questions="totalQuizQuestions" @answer="handleAnswer" />

				<!-- Quiz Results -->
				<QuizResult v-else-if="quizState === 'finished'" :score="score" :total-questions="totalQuizQuestions" @restart="restartQuiz" @menu="goToGameSelection" />
			</template>

			<!-- ==================== FLASHCARD MODE ==================== -->
			<template v-else-if="gameMode === 'flashcard'">
				<!-- Flashcard Game -->
				<FlashcardGame v-if="quizState === 'playing'" :flashcards="shuffledFlashcards" @finish="handleFlashcardFinish" @quit="goToGameSelection" />

				<!-- Flashcard Results -->
				<FlashcardResult v-else-if="quizState === 'finished'" :known="flashcardKnown" :total="flashcardTotal" @restart="restartFlashcards" @menu="goToGameSelection" />
			</template>
		</main>

		<!-- Footer -->
		<footer class="py-4 border-t border-gold/20 mt-auto">
			<div class="container mx-auto px-4 text-center text-parchment/40 text-sm">
				Flash & Quizz - Apprentissage interactif
				<span class="mx-2">|</span>
				<a href="https://github.com/guillaumejay/FlashAndQuizz" target="_blank" rel="noopener noreferrer" class="hover:text-gold transition-colors"> GitHub </a>
				<span class="mx-2">|</span>
				<span>v{{ version }}</span>
			</div>
		</footer>
	</div>
</template>
