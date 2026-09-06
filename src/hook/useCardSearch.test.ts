import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useCardSearch } from "./useCardSearch";
import type { CardData } from "../types";

const cards: CardData[] = [
    {
        種類: "クリーチャー",
        分類: null,
        名前: "アーチビショップ",
        属性: "無",
        レアリティ: "R",
        AT: 30,
        HP: 30,
        コスト: {
            魔力: 50,
            土地: { 属性: null, 数: 0 },
            カード: 0,
        },
        配置制限: [],
        アイテム制限: [],
        能力: "領地能力：対象のクリーチャーに付いた効果を消す",
        能力タグ: ["領地能力"],
        img: "archbishop.jpg",
    },
    {
        種類: "クリーチャー",
        分類: null,
        名前: "サラマンダー",
        属性: "火",
        レアリティ: "S",
        AT: 40,
        HP: 40,
        コスト: {
            魔力: 70,
            土地: { 属性: "火", 数: 1 },
            カード: 0,
        },
        配置制限: [],
        アイテム制限: [],
        能力: "戦闘中、先制を得る",
        能力タグ: ["戦闘中", { 強打: ["無"] }],
        img: "salamander.jpg",
    },
    {
        種類: "クリーチャー",
        分類: null,
        名前: "マーフォーク",
        属性: "水",
        レアリティ: "N",
        AT: 20,
        HP: 30,
        コスト: {
            魔力: 20,
            土地: { 属性: "水", 数: 1 },
            カード: 0,
        },
        配置制限: [],
        アイテム制限: [],
        能力: "攻撃成功時、相手に10ダメージ",
        能力タグ: ["攻撃成功時", { 攻撃無効: ["基本AT40以上"] }],
        img: "merfolk.jpg",
    },
    {
        種類: "アイテム",
        分類: "武器",
        名前: "ロングソード",
        属性: null,
        レアリティ: "N",
        AT: null,
        HP: null,
        コスト: {
            魔力: 10,
            土地: { 属性: null, 数: 0 },
            カード: 0,
        },
        配置制限: [],
        アイテム制限: [],
        能力: "AT+30",
        能力タグ: [],
        img: "longsword.jpg",
    },
];

describe("useCardSearch", () => {
    it("returns all cards and the derived cost range by default", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        expect(result.current.availableCostRange).toEqual([10, 70]);
        expect(result.current.costRange).toEqual([10, 70]);
        expect(result.current.filteredCards).toHaveLength(4);
    });

    it("limits search to creature cards when creature filtering is enabled", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setIsCreatureFilterEnabled(true);
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "アーチビショップ",
            "サラマンダー",
            "マーフォーク",
        ]);
    });

    it("filters by selected elements only when creature filtering is enabled", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setSelectedElements(["火"]);
        });

        expect(result.current.filteredCards).toHaveLength(4);

        act(() => {
            result.current.setIsCreatureFilterEnabled(true);
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "サラマンダー",
        ]);
    });

    it("filters by cost range", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setCostRange([30, 60]);
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "アーチビショップ",
        ]);
    });

    it("filters by AT range", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setIsCreatureFilterEnabled(true);
            result.current.setAtRange([35, 45]);
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "サラマンダー",
        ]);
    });

    it("filters by HP range", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setIsCreatureFilterEnabled(true);
            result.current.setHpRange([35, 45]);
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "サラマンダー",
        ]);
    });

    it("filters by ability text with trimmed case-insensitive matching", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setAbilityQuery("  先制 ");
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "サラマンダー",
        ]);
    });

    it("combines filters", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setSelectedElements(["水", "火"]);
            result.current.setIsCreatureFilterEnabled(true);
            result.current.setAtRange([10, 40]);
            result.current.setCostRange([10, 30]);
            result.current.setAbilityQuery("ダメージ");
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "マーフォーク",
        ]);
    });

    it("filters by ability tag queries with and matching by default", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setAbilityTagQuery(0, "攻撃無効");
            result.current.setAbilityTagQuery(1, "AT40");
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "マーフォーク",
        ]);
    });

    it("filters by ability tag queries with or matching", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setAbilityTagQuery(0, "領地");
            result.current.setAbilityTagQuery(1, "戦闘中");
            result.current.setAbilityTagMatchMode("or");
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "アーチビショップ",
            "サラマンダー",
        ]);
    });

    it("ignores blank ability tag boxes during and matching", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setAbilityTagQuery(0, "戦闘中");
            result.current.setAbilityTagQuery(1, "   ");
            result.current.setAbilityTagQuery(2, "");
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "サラマンダー",
        ]);
    });

    it("ignores blank ability tag boxes during or matching", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setAbilityTagQuery(0, "領地");
            result.current.setAbilityTagQuery(1, "   ");
            result.current.setAbilityTagQuery(2, "");
            result.current.setAbilityTagMatchMode("or");
        });

        expect(result.current.filteredCards.map((card) => card.名前)).toEqual([
            "アーチビショップ",
        ]);
    });

    it("clears each filter independently", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setSelectedElements(["火"]);
            result.current.setIsCreatureFilterEnabled(true);
            result.current.setAtRange([35, 45]);
            result.current.setHpRange([35, 45]);
            result.current.setCostRange([30, 60]);
            result.current.setAbilityQuery("先制");
            result.current.setAbilityTagQuery(0, "強打");
            result.current.setAbilityTagMatchMode("or");
        });

        expect(result.current.hasActiveFilters).toBe(true);

        act(() => {
            result.current.clearSelectedElements();
        });

        expect(result.current.selectedElements).toEqual([]);
        expect(result.current.isCreatureFilterEnabled).toBe(true);
        expect(result.current.atRange).toEqual([35, 45]);
        expect(result.current.hpRange).toEqual([35, 45]);
        expect(result.current.costRange).toEqual([30, 60]);
        expect(result.current.abilityQuery).toBe("先制");
        expect(result.current.abilityTagQueries).toEqual(["強打", "", ""]);

        act(() => {
            result.current.resetAtRange();
            result.current.resetHpRange();
            result.current.resetCostRange();
        });

        expect(result.current.atRange).toEqual([20, 40]);
        expect(result.current.hpRange).toEqual([30, 40]);
        expect(result.current.costRange).toEqual([10, 70]);
        expect(result.current.abilityQuery).toBe("先制");

        act(() => {
            result.current.clearAbilityQuery();
            result.current.clearAbilityTagQueries();
            result.current.setAbilityTagMatchMode("and");
            result.current.setIsCreatureFilterEnabled(false);
        });

        expect(result.current.abilityQuery).toBe("");
        expect(result.current.abilityTagQueries).toEqual(["", "", ""]);
        expect(result.current.hasActiveFilters).toBe(false);
    });

    it("resets all filters to their defaults", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setSelectedElements(["火"]);
            result.current.setIsCreatureFilterEnabled(true);
            result.current.setAtRange([35, 45]);
            result.current.setHpRange([35, 45]);
            result.current.setCostRange([30, 60]);
            result.current.setAbilityQuery("先制");
            result.current.setAbilityTagQuery(0, "強打");
            result.current.setAbilityTagMatchMode("or");
        });

        act(() => {
            result.current.resetFilters();
        });

        expect(result.current.selectedElements).toEqual([]);
        expect(result.current.isCreatureFilterEnabled).toBe(false);
        expect(result.current.atRange).toEqual([20, 40]);
        expect(result.current.hpRange).toEqual([30, 40]);
        expect(result.current.costRange).toEqual([10, 70]);
        expect(result.current.abilityQuery).toBe("");
        expect(result.current.abilityTagQueries).toEqual(["", "", ""]);
        expect(result.current.abilityTagMatchMode).toBe("and");
        expect(result.current.filteredCards).toHaveLength(4);
        expect(result.current.hasActiveFilters).toBe(false);
    });

    it("keeps three ability tag text boxes and preserves blanks for display", () => {
        const { result } = renderHook(() => useCardSearch(cards));

        act(() => {
            result.current.setAbilityTagQuery(0, " 強打 ");
            result.current.setAbilityTagQuery(1, "   ");
            result.current.setAbilityTagQuery(2, "戦闘中");
        });

        expect(result.current.abilityTagQueries).toEqual([" 強打 ", "   ", "戦闘中"]);
    });
});