import {
    ActionIcon,
    Autocomplete,
    Button,
    Checkbox,
    Group,
    MultiSelect,
    RangeSlider,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { IconRestore, IconSearch, IconX } from "@tabler/icons-react";

import type { ElementType } from "../types";

const elementOptions: { value: ElementType; label: string }[] = [
    { value: "無", label: "無" },
    { value: "火", label: "火" },
    { value: "水", label: "水" },
    { value: "地", label: "地" },
    { value: "風", label: "風" },
];

interface SearchFormProps {
    selectedElements: ElementType[];
    onSelectedElementsChange: (value: ElementType[]) => void;
    onSelectedElementsClear: () => void;
    atRange: [number, number];
    onAtRangeChange: (value: [number, number]) => void;
    onAtRangeReset: () => void;
    availableAtRange: [number, number];
    hpRange: [number, number];
    onHpRangeChange: (value: [number, number]) => void;
    onHpRangeReset: () => void;
    availableHpRange: [number, number];
    costRange: [number, number];
    onCostRangeChange: (value: [number, number]) => void;
    onCostRangeReset: () => void;
    availableCostRange: [number, number];
    abilityQuery: string;
    onAbilityQueryChange: (value: string) => void;
    onAbilityQueryClear: () => void;
    abilityTagQueries: [string, string, string];
    onAbilityTagQueryChange: (index: number, value: string) => void;
    onAbilityTagQueriesClear: () => void;
    abilityTagMatchMode: "and" | "or";
    onAbilityTagMatchModeChange: (value: "and" | "or") => void;
    availableAbilityTagSuggestions: string[];
    onResetFilters: () => void;
    hasActiveFilters: boolean;
}

export function SearchForm({
    selectedElements,
    onSelectedElementsChange,
    onSelectedElementsClear,
    atRange,
    onAtRangeChange,
    onAtRangeReset,
    availableAtRange,
    hpRange,
    onHpRangeChange,
    onHpRangeReset,
    availableHpRange,
    costRange,
    onCostRangeChange,
    onCostRangeReset,
    availableCostRange,
    abilityQuery,
    onAbilityQueryChange,
    onAbilityQueryClear,
    abilityTagQueries,
    onAbilityTagQueryChange,
    onAbilityTagQueriesClear,
    abilityTagMatchMode,
    onAbilityTagMatchModeChange,
    availableAbilityTagSuggestions,
    onResetFilters,
    hasActiveFilters,
}: SearchFormProps) {
    const isElementFilterActive = selectedElements.length > 0;
    const isAtFilterActive =
        atRange[0] !== availableAtRange[0] || atRange[1] !== availableAtRange[1];
    const isHpFilterActive =
        hpRange[0] !== availableHpRange[0] || hpRange[1] !== availableHpRange[1];
    const isCostFilterActive =
        costRange[0] !== availableCostRange[0] || costRange[1] !== availableCostRange[1];
    const isAbilityFilterActive = abilityQuery.trim().length > 0;
    const isAbilityTagFilterActive =
        abilityTagQueries.some((query) => query.trim().length > 0) ||
        abilityTagMatchMode === "or";

    return (
        <Stack gap="lg">
            <Stack gap="xs">
                <Group justify="space-between" align="end">
                    <Text fw={500} size="sm">
                        属性
                    </Text>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={onSelectedElementsClear}
                        disabled={!isElementFilterActive}
                        aria-label="属性条件をクリア"
                    >
                        <IconX size={16} />
                    </ActionIcon>
                </Group>
                <MultiSelect
                    placeholder="属性を選択"
                    data={elementOptions}
                    value={selectedElements}
                    onChange={(value) => onSelectedElementsChange(value as ElementType[])}
                    clearable
                    searchable
                />
            </Stack>

            <Stack gap="xs">
                <Group justify="space-between" align="end">
                    <Text fw={500} size="sm">
                        AT範囲
                    </Text>
                    <Group gap="xs">
                        <Text c="dimmed" size="sm">
                            {atRange[0]} - {atRange[1]}
                        </Text>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={onAtRangeReset}
                            disabled={!isAtFilterActive}
                            aria-label="AT条件をリセット"
                        >
                            <IconRestore size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
                <RangeSlider
                    min={availableAtRange[0]}
                    max={availableAtRange[1]}
                    value={atRange}
                    onChange={(value) => onAtRangeChange(value as [number, number])}
                    minRange={0}
                    step={10}
                    label={(value) => `${value}`}
                />
            </Stack>

            <Stack gap="xs">
                <Group justify="space-between" align="end">
                    <Text fw={500} size="sm">
                        HP範囲
                    </Text>
                    <Group gap="xs">
                        <Text c="dimmed" size="sm">
                            {hpRange[0]} - {hpRange[1]}
                        </Text>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={onHpRangeReset}
                            disabled={!isHpFilterActive}
                            aria-label="HP条件をリセット"
                        >
                            <IconRestore size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
                <RangeSlider
                    min={availableHpRange[0]}
                    max={availableHpRange[1]}
                    value={hpRange}
                    onChange={(value) => onHpRangeChange(value as [number, number])}
                    minRange={0}
                    step={10}
                    label={(value) => `${value}`}
                />
            </Stack>

            <Stack gap="xs">
                <Group justify="space-between" align="end">
                    <Text fw={500} size="sm">
                        コスト範囲
                    </Text>
                    <Group gap="xs">
                        <Text c="dimmed" size="sm">
                            {costRange[0]} - {costRange[1]}
                        </Text>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={onCostRangeReset}
                            disabled={!isCostFilterActive}
                            aria-label="コスト条件をリセット"
                        >
                            <IconRestore size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
                <RangeSlider
                    min={availableCostRange[0]}
                    max={availableCostRange[1]}
                    value={costRange}
                    onChange={(value) => onCostRangeChange(value as [number, number])}
                    minRange={0}
                    step={10}
                    label={(value) => `${value}`}
                />
            </Stack>

            <Stack gap="xs">
                <Group justify="space-between" align="end">
                    <Text fw={500} size="sm">
                        能力テキスト
                    </Text>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={onAbilityQueryClear}
                        disabled={!isAbilityFilterActive}
                        aria-label="能力テキスト条件をクリア"
                    >
                        <IconX size={16} />
                    </ActionIcon>
                </Group>
                <TextInput
                    placeholder="能力文を部分一致で検索"
                    value={abilityQuery}
                    onChange={(event) => onAbilityQueryChange(event.currentTarget.value)}
                    leftSection={<IconSearch size={16} stroke={1.8} />}
                />
            </Stack>

            <Stack gap="xs">
                <Group justify="space-between" align="end">
                    <Text fw={500} size="sm">
                        能力タグ
                    </Text>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={onAbilityTagQueriesClear}
                        disabled={!isAbilityTagFilterActive}
                        aria-label="能力タグ条件をクリア"
                    >
                        <IconX size={16} />
                    </ActionIcon>
                </Group>
                <Autocomplete
                    placeholder="能力タグ条件 1"
                    value={abilityTagQueries[0]}
                    data={availableAbilityTagSuggestions}
                    onChange={(event) =>
                        onAbilityTagQueryChange(0, event)
                    }
                />
                <Autocomplete
                    placeholder="能力タグ条件 2"
                    value={abilityTagQueries[1]}
                    data={availableAbilityTagSuggestions}
                    onChange={(event) =>
                        onAbilityTagQueryChange(1, event)
                    }
                />
                <Autocomplete
                    placeholder="能力タグ条件 3"
                    value={abilityTagQueries[2]}
                    data={availableAbilityTagSuggestions}
                    onChange={(event) =>
                        onAbilityTagQueryChange(2, event)
                    }
                />
                <Checkbox
                    label="OR検索を有効化する"
                    checked={abilityTagMatchMode === "or"}
                    onChange={(event) =>
                        onAbilityTagMatchModeChange(event.currentTarget.checked ? "or" : "and")
                    }
                />
                <Text c="dimmed" size="xs">
                    空白の条件は検索に含めません。
                </Text>
            </Stack>

            <Group justify="flex-end">
                <Button
                    variant="light"
                    leftSection={<IconRestore size={16} />}
                    onClick={onResetFilters}
                    disabled={!hasActiveFilters}
                >
                    すべてリセット
                </Button>
            </Group>
        </Stack>
    );
}
