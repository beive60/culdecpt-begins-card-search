import { MantineProvider } from "@mantine/core";
import { render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { CardList } from "./CardList";
import type { CardData } from "../types";

const baseCard: CardData = {
    種類: "クリーチャー",
    分類: null,
    名前: "グラディエーター",
    属性: "火",
    レアリティ: "R",
    AT: 40,
    HP: 40,
    コスト: {
        魔力: 70,
        土地: { 属性: null, 数: 0 },
        カード: 0,
    },
    配置制限: [],
    アイテム制限: [],
    能力: "強打【火】【水】【地】【風】",
    能力タグ: [{ 強打: ["火"] }],
    img: null,
};

beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });

    class ResizeObserverMock {
        observe() { }
        unobserve() { }
        disconnect() { }
    }

    Object.defineProperty(window, "ResizeObserver", {
        writable: true,
        value: ResizeObserverMock,
    });
    Object.defineProperty(globalThis, "ResizeObserver", {
        writable: true,
        value: ResizeObserverMock,
    });
});

describe("CardList", () => {
    it("renders ability element markers as badges", () => {
        render(
            <MantineProvider>
                <CardList cards={[baseCard]} />
            </MantineProvider>,
        );

        const abilityCell = screen.getByText("強打").closest("td");

        expect(abilityCell).not.toBeNull();
        const scoped = within(abilityCell!);

        expect(scoped.getByText("強打")).toBeInTheDocument();
        expect(scoped.getAllByText("火")).toHaveLength(1);
        expect(scoped.getAllByText("水")).toHaveLength(1);
        expect(scoped.getAllByText("地")).toHaveLength(1);
        expect(scoped.getAllByText("風")).toHaveLength(1);
        expect(scoped.queryByText("強打【火】【水】【地】【風】")).not.toBeInTheDocument();
    });

    it("keeps condition brackets as plain text while converting element markers", () => {
        render(
            <MantineProvider>
                <CardList
                    cards={[
                        {
                            ...baseCard,
                            能力: "強打[最大HP40以上]【火】",
                        },
                    ]}
                />
            </MantineProvider>,
        );

        const abilityCell = screen.getByText(/強打\[最大HP40以上\]/).closest("td");

        expect(abilityCell).not.toBeNull();
        const scoped = within(abilityCell!);

        expect(scoped.getByText(/強打\[最大HP40以上\]/)).toBeInTheDocument();
        expect(scoped.getAllByText("火")).toHaveLength(1);
    });
});