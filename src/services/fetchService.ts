import type { InventoryItem } from "../types/inventory";
import type { Question, Flashcard } from "../types/quiz";
import { toRawGistUrl } from "../utils/gistUrl";
import * as cacheService from "./cacheService";

// Inventory URL - configure this with your Gist URL
const INVENTORY_URL = "https://gist.githubusercontent.com/guillaumejay/684d9dc87e9e158477b0e4fc4164f422/raw/9bd622a913e951bb1e43ee59833e4462f15a4f36/FQ-Inventaire.json";

export interface FetchResult<T> {
	data: T | null;
	error: string | null;
	fromCache: boolean;
}

async function fetchJson<T>(url: string): Promise<T> {
	const rawUrl = toRawGistUrl(url);
	const response = await fetch(rawUrl);
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}
	return response.json();
}

export async function fetchInventory(forceRefresh = false): Promise<FetchResult<InventoryItem[]>> {
	// Try cache first (unless force refresh)
	if (!forceRefresh) {
		const cached = cacheService.getInventory();
		if (cached) {
			return { data: cached, error: null, fromCache: true };
		}
	}

	// Fetch from network
	try {
		const data = await fetchJson<InventoryItem[]>(INVENTORY_URL);
		if (!cacheService.isValidInventory(data)) {
			return {
				data: null,
				error: "Format d'inventaire invalide",
				fromCache: false,
			};
		}
		cacheService.setInventory(data);
		return { data, error: null, fromCache: false };
	} catch (err) {
		// Network error - try to return stale cache
		const staleCache = cacheService.getInventory();
		if (staleCache) {
			return {
				data: staleCache,
				error: `Erreur réseau, données du cache utilisées`,
				fromCache: true,
			};
		}
		return {
			data: null,
			error: err instanceof Error ? err.message : "Erreur inconnue",
			fromCache: false,
		};
	}
}

export async function fetchContent(item: InventoryItem, forceRefresh = false): Promise<FetchResult<Question[] | { flashcards: Flashcard[] }>> {
	const url = toRawGistUrl(item.url);

	// Try cache first (unless force refresh)
	if (!forceRefresh) {
		const cached = cacheService.getContent(url);
		if (cached) {
			return { data: cached, error: null, fromCache: true };
		}
	}

	// Fetch from network
	try {
		const data = await fetchJson<Question[] | { flashcards: Flashcard[] }>(url);
		cacheService.setContent(url, data);
		return { data, error: null, fromCache: false };
	} catch (err) {
		// Network error - try to return stale cache
		const staleCache = cacheService.getContent(url);
		if (staleCache) {
			return {
				data: staleCache,
				error: `Erreur réseau, données du cache utilisées`,
				fromCache: true,
			};
		}
		return {
			data: null,
			error: err instanceof Error ? err.message : "Erreur inconnue",
			fromCache: false,
		};
	}
}

export function clearCache(): void {
	cacheService.clearAll();
}

export function setInventoryUrl(url: string): void {
	// This would allow runtime configuration if needed
	// For now, we use a constant
	console.log("Inventory URL:", url);
}
