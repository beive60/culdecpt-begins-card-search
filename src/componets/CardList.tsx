import { Badge, Image, Paper, ScrollArea, Table, Text } from "@mantine/core";

import type { CardData } from "../types";

interface CardListProps {
    cards: CardData[];
}

const rarityColorMap = {
    N: "gray",
    S: "blue",
    R: "orange",
    E: "grape",
} as const;

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
            <Table.Td>{card.名前}</Table.Td>
            <Table.Td>
                <Badge variant="light">{card.属性}</Badge>
            </Table.Td>
            <Table.Td>
                <Badge color={rarityColorMap[card.レアリティ]} variant="filled">
                    {card.レアリティ}
                </Badge>
            </Table.Td>
            <Table.Td>
                {card.AT} / {card.HP}
            </Table.Td>
            <Table.Td>{card.コスト.魔力}</Table.Td>
            <Table.Td style={{ whiteSpace: "pre-wrap" }}>{card.能力}</Table.Td>
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
                        <Table.Th>レアリティ</Table.Th>
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
