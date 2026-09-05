import { useMemo, useState } from "react";

import type { CardData, CardTag, ElementType } from "../types";

function normalizeTagTerm(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function extractAbilityTagTerms(tags: CardData["能力タグ"]): string[] {
    const terms = new Set<string>();

    for (const tag of tags) {
        if (typeof tag === "string") {
            const normalized = tag.trim();
            if (normalized.length > 0) {
                terms.add(normalized);
            }
            continue;
        }

        for (const [key, values] of Object.entries(tag as CardTag)) {
            const normalizedKey = key.trim();
            if (normalizedKey.length > 0) {
                terms.add(normalizedKey);
            }

            for (const value of values) {
                const normalizedValue = value.trim();
                if (normalizedValue.length > 0) {
                    terms.add(normalizedValue);
                }
            }
        }
    }

    return [...terms];
}

export interface UseCardSearchResult {
    selectedElements: ElementType[];
    setSelectedElements: React.Dispatch<React.SetStateAction<ElementType[]>>;
    clearSelectedElements: () => void;
    atRange: [number, number];
    setAtRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    resetAtRange: () => void;
    availableAtRange: [number, number];
    hpRange: [number, number];
    setHpRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    resetHpRange: () => void;
    availableHpRange: [number, number];
    costRange: [number, number];
    setCostRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    resetCostRange: () => void;
    abilityQuery: string;
    setAbilityQuery: React.Dispatch<React.SetStateAction<string>>;
    clearAbilityQuery: () => void;
    abilityTagQueries: [string, string, string];
    setAbilityTagQuery: (index: number, value: string) => void;
    clearAbilityTagQueries: () => void;
    abilityTagMatchMode: "and" | "or";
    setAbilityTagMatchMode: (value: "and" | "or") => void;
    availableAbilityTagSuggestions: string[];
    resetFilters: () => void;
    hasActiveFilters: boolean;
    availableCostRange: [number, number];
    filteredCards: CardData[];
}

export function useCardSearch(cardData: CardData[]): UseCardSearchResult {
    const availableCostRange = useMemo<[number, number]>(() => {
        if (cardData.length === 0) {
            return [0, 0];
        }

        const costs = cardData.map((card) => card.コスト.魔力);
        return [Math.min(...costs), Math.max(...costs)];
    }, [cardData]);

    const availableAtRange = useMemo<[number, number]>(() => {
        if (cardData.length === 0) {
            return [0, 0];
        }

        const values = cardData.map((card) => card.AT);
        return [Math.min(...values), Math.max(...values)];
    }, [cardData]);

    const availableHpRange = useMemo<[number, number]>(() => {
        if (cardData.length === 0) {
            return [0, 0];
        }

        const values = cardData.map((card) => card.HP);
        return [Math.min(...values), Math.max(...values)];
    }, [cardData]);

    const availableAbilityTagSuggestions = useMemo(() => {
        const suggestions = new Set<string>();

        for (const card of cardData) {
            for (const term of extractAbilityTagTerms(card.能力タグ)) {
                suggestions.add(term);
            }
        }

        return [...suggestions].sort((left, right) => left.localeCompare(right, "ja"));
    }, [cardData]);

    const [selectedElements, setSelectedElements] = useState<ElementType[]>([]);
    const [atRange, setAtRange] = useState<[number, number]>(availableAtRange);
    const [hpRange, setHpRange] = useState<[number, number]>(availableHpRange);
    const [costRange, setCostRange] = useState<[number, number]>(availableCostRange);
    const [abilityQuery, setAbilityQuery] = useState("");
    const [abilityTagQueries, setAbilityTagQueries] = useState<[string, string, string]>([
        "",
        "",
        "",
    ]);
    const [abilityTagMatchMode, setAbilityTagMatchMode] = useState<"and" | "or">("and");

    const clearSelectedElements = () => {
        setSelectedElements([]);
    };

    const resetAtRange = () => {
        setAtRange(availableAtRange);
    };

    const resetHpRange = () => {
        setHpRange(availableHpRange);
    };

    const resetCostRange = () => {
        setCostRange(availableCostRange);
    };

    const clearAbilityQuery = () => {
        setAbilityQuery("");
    };

    const setAbilityTagQuery = (index: number, value: string) => {
        if (index < 0 || index > 2) {
            return;
        }

        setAbilityTagQueries((current) => {
            const next = [...current] as [string, string, string];
            next[index] = value;
            return next;
        });
    };

    const clearAbilityTagQueries = () => {
        setAbilityTagQueries(["", "", ""]);
    };

    const resetFilters = () => {
        clearSelectedElements();
        resetAtRange();
        resetHpRange();
        resetCostRange();
        clearAbilityQuery();
        clearAbilityTagQueries();
        setAbilityTagMatchMode("and");
    };

    const hasActiveFilters =
        selectedElements.length > 0 ||
        atRange[0] !== availableAtRange[0] ||
        atRange[1] !== availableAtRange[1] ||
        hpRange[0] !== availableHpRange[0] ||
        hpRange[1] !== availableHpRange[1] ||
        costRange[0] !== availableCostRange[0] ||
        costRange[1] !== availableCostRange[1] ||
        abilityQuery.trim().length > 0 ||
        abilityTagQueries.some((query) => query.trim().length > 0) ||
        abilityTagMatchMode === "or";

    const filteredCards = useMemo(() => {
        const normalizedAbilityQuery = abilityQuery.trim().toLocaleLowerCase();
        const normalizedTagQueries = abilityTagQueries
            .map(normalizeTagTerm)
            .filter((query, index, array) => query.length > 0 && array.indexOf(query) === index);

        return cardData.filter((card) => {
            const matchesElement =
                selectedElements.length === 0 || selectedElements.includes(card.属性);
            const matchesAt = card.AT >= atRange[0] && card.AT <= atRange[1];
            const matchesHp = card.HP >= hpRange[0] && card.HP <= hpRange[1];
            const matchesCost =
                card.コスト.魔力 >= costRange[0] && card.コスト.魔力 <= costRange[1];
            const matchesAbility =
                normalizedAbilityQuery.length === 0 ||
                card.能力.toLocaleLowerCase().includes(normalizedAbilityQuery);
            const abilityTagTerms = extractAbilityTagTerms(card.能力タグ).map(normalizeTagTerm);
            const matchesAbilityTags =
                normalizedTagQueries.length === 0
                    ? true
                    : abilityTagMatchMode === "or"
                        ? normalizedTagQueries.some((query) =>
                            abilityTagTerms.some((term) => term.includes(query)),
                        )
                        : normalizedTagQueries.every((query) =>
                            abilityTagTerms.some((term) => term.includes(query)),
                        );

            return (
                matchesElement &&
                matchesAt &&
                matchesHp &&
                matchesCost &&
                matchesAbility &&
                matchesAbilityTags
            );
        });
    }, [
        abilityQuery,
        abilityTagMatchMode,
        abilityTagQueries,
        atRange,
        cardData,
        costRange,
        hpRange,
        selectedElements,
    ]);

    return {
        selectedElements,
        setSelectedElements,
        clearSelectedElements,
        atRange,
        setAtRange,
        resetAtRange,
        availableAtRange,
        hpRange,
        setHpRange,
        resetHpRange,
        availableHpRange,
        costRange,
        setCostRange,
        resetCostRange,
        abilityQuery,
        setAbilityQuery,
        clearAbilityQuery,
        abilityTagQueries,
        setAbilityTagQuery,
        clearAbilityTagQueries,
        abilityTagMatchMode,
        setAbilityTagMatchMode,
        availableAbilityTagSuggestions,
        resetFilters,
        hasActiveFilters,
        availableCostRange,
        filteredCards,
    };
}
