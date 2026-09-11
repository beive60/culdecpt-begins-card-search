import { AppShell, Container, Group, Paper, Stack, Text, Title } from "@mantine/core";

import { CardList } from "./componets/CardList";
import { Footer } from "./componets/Footer";
import { SearchForm } from "./componets/SearchForm";
import cardData from "./data/cards_database.json";
import { useCardSearch } from "./hook/useCardSearch";
import type { CardData } from "./types";

const cards = cardData as CardData[];

export default function App() {
    const {
        selectedElements,
        setSelectedElements,
        clearSelectedElements,
        isCreatureFilterEnabled,
        setIsCreatureFilterEnabled,
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
    } = useCardSearch(cards);

    return (
        <AppShell padding="md" header={{ height: 72 }} footer={{ height: "auto" }}>
            <AppShell.Header>
                <Group h="100%" px="lg" justify="space-between">
                    <Title order={2}>Culdcept Begins Card Search</Title>
                    <Text c="dimmed" size="sm">
                        {filteredCards.length} / {cards.length} cards
                    </Text>
                </Group>
            </AppShell.Header>

            <AppShell.Main>
                <Container size="xl">
                    <Stack gap="xl">
                        <Paper withBorder radius="md" p="lg">
                            <SearchForm
                                selectedElements={selectedElements}
                                onSelectedElementsChange={setSelectedElements}
                                onSelectedElementsClear={clearSelectedElements}
                                isCreatureFilterEnabled={isCreatureFilterEnabled}
                                onCreatureFilterEnabledChange={setIsCreatureFilterEnabled}
                                atRange={atRange}
                                onAtRangeChange={setAtRange}
                                onAtRangeReset={resetAtRange}
                                availableAtRange={availableAtRange}
                                hpRange={hpRange}
                                onHpRangeChange={setHpRange}
                                onHpRangeReset={resetHpRange}
                                availableHpRange={availableHpRange}
                                costRange={costRange}
                                onCostRangeChange={setCostRange}
                                onCostRangeReset={resetCostRange}
                                availableCostRange={availableCostRange}
                                abilityQuery={abilityQuery}
                                onAbilityQueryChange={setAbilityQuery}
                                onAbilityQueryClear={clearAbilityQuery}
                                abilityTagQueries={abilityTagQueries}
                                onAbilityTagQueryChange={setAbilityTagQuery}
                                onAbilityTagQueriesClear={clearAbilityTagQueries}
                                abilityTagMatchMode={abilityTagMatchMode}
                                onAbilityTagMatchModeChange={setAbilityTagMatchMode}
                                availableAbilityTagSuggestions={availableAbilityTagSuggestions}
                                onResetFilters={resetFilters}
                                hasActiveFilters={hasActiveFilters}
                            />
                        </Paper>

                        <CardList cards={filteredCards} />
                    </Stack>
                </Container>
            </AppShell.Main>

            <AppShell.Footer withBorder>
                <Footer />
            </AppShell.Footer>
        </AppShell>
    );
}
