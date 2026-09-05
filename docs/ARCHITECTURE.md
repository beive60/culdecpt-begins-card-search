# docs/ARCHITECTURE.md

## 技術スタック

- Framework: React 18 + Vite
- Language: TypeScript
- UI Library: Mantine (@mantine/core, @mantine/hooks)
- Icons: Tabler Icons (@tabler/icons-react)

## コーディング規約

- Functional Components と React Hooks (`useState`, `useMemo`, `useCallback`) を厳格に使用する。
- 状態管理は、グローバルなライブラリ（Reduxなど）を使用せず、必要最小限のコンポーネントツリー内で完結させる。
- CSSは記述せず、Mantineの標準Props (`mt`, `p`, `bg` など) および Flex/Grid コンポーネントを用いてレイアウトを構築する。
- データ構造は常に `src/types.ts` を参照すること。
