import { Badge, Group, Image, Paper, ScrollArea, Stack, Table, Text } from "@mantine/core";
import type { CardData, CardKind, ElementType } from "../types";

interface CardListProps {
    cards: CardData[];
}

const rarityColorMap = {
    N: "gray",
    S: "blue",
    R: "orange",
    E: "grape",
} as const;

const elementColorMap: Record<ElementType, string> = {
    無: "#5c6670",
    火: "#c35b2c",
    水: "#3ea7c2",
    地: "#369f22",
    風: "#b18510",
};

const kindColorMap: Record<CardKind, string> = {
    クリーチャー: "#495057",
    アイテム: "#8f5b2e",
    スペル: "#4263eb",
};

const classificationColorMap: Record<Exclude<CardKind, "クリーチャー">, string> = {
    アイテム: "#a86a35",
    スペル: "#4c6ef5",
};

const abilityElementTokenPattern = /【([無火水地風])】/g;

function renderAbilityText(abilityText: string) {
    return abilityText.split("\n").map((line, lineIndex) => {
        const tokens: Array<{ type: "text"; value: string } | { type: "element"; value: ElementType }> = [];
        let lastIndex = 0;

        for (const match of line.matchAll(abilityElementTokenPattern)) {
            const matchIndex = match.index ?? 0;

            if (matchIndex > lastIndex) {
                tokens.push({
                    type: "text",
                    value: line.slice(lastIndex, matchIndex),
                });
            }

            tokens.push({
                type: "element",
                value: match[1] as ElementType,
            });
            lastIndex = matchIndex + match[0].length;
        }

        if (lastIndex < line.length) {
            tokens.push({
                type: "text",
                value: line.slice(lastIndex),
            });
        }

        if (tokens.length === 0) {
            return <Text key={`ability-line-${lineIndex}`}>&nbsp;</Text>;
        }

        return (
            <Group key={`ability-line-${lineIndex}`} gap={4} wrap="wrap">
                {tokens.map((token, tokenIndex) =>
                    token.type === "text" ? (
                        <Text component="span" key={`text-${lineIndex}-${tokenIndex}`} inherit>
                            {token.value}
                        </Text>
                    ) : (
                        <Badge
                            key={`element-${lineIndex}-${tokenIndex}`}
                            color={elementColorMap[token.value]}
                            c="white"
                            variant="filled"
                            size="sm"
                        >
                            {token.value}
                        </Badge>
                    ),
                )}
            </Group>
        );
    });
}

export function CardList({ cards }: CardListProps) {
    if (cards.length === 0) {
        return (
            <Paper withBorder p="xl" radius="md">
                <Text c="dimmed" ta="center">
                    条件に一致するカードがありません。
                </Text>
            </Paper>
        );
    }

    const rows = cards.map((card) => (
        <Table.Tr key={card.名前}>
            <Table.Td>
                {card.img ? (
                    <Image
                        src={`/${card.img}`}
                        alt={card.名前}
                        h={96}
                        w={68}
                        fit="cover"
                        radius="sm"
                    />
                ) : (
                    <Paper withBorder radius="sm" w={68} h={96} p="xs">
                        <Text c="dimmed" size="xs" ta="center">
                            NO IMAGE
                        </Text>
                    </Paper>
                )}
            </Table.Td>
            <Table.Td>
                <Stack gap={4}>
                    <Group gap={6}>
                        <Badge color={rarityColorMap[card.レアリティ]} variant="filled">
                            {card.レアリティ}
                        </Badge>
                        <Badge color={kindColorMap[card.種類]} variant="filled">
                            {card.種類}
                        </Badge>
                    </Group>
                    <Text fw={500}>{card.名前}</Text>
                </Stack>
            </Table.Td>
            <Table.Td>
                {card.種類 === "クリーチャー" && card.属性 !== null ? (
                    <Badge color={elementColorMap[card.属性]} c="white" variant="filled">
                        {card.属性}
                    </Badge>
                ) : card.種類 === "アイテム" || card.種類 === "スペル" ? (
                    <Badge color={classificationColorMap[card.種類]} c="white" variant="filled">
                        {card.分類}
                    </Badge>
                ) : (
                    <Text c="dimmed" size="sm">
                        -
                    </Text>
                )}
            </Table.Td>
            <Table.Td>
                {card.AT ?? "-"} / {card.HP ?? "-"}
            </Table.Td>
            <Table.Td>{card.コスト.魔力}</Table.Td>
            <Table.Td>
                <Stack gap={4}>{renderAbilityText(card.能力)}</Stack>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <ScrollArea>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>画像</Table.Th>
                        <Table.Th>名前</Table.Th>
                        <Table.Th>属性</Table.Th>
                        <Table.Th>AT / HP</Table.Th>
                        <Table.Th>コスト</Table.Th>
                        <Table.Th>能力テキスト</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    );
}
