// src/types.ts

export type ElementType = "無" | "火" | "水" | "地" | "風";
export type RarityType = "N" | "S" | "R" | "E";
export type CardKind = "クリーチャー" | "アイテム" | "スペル";

export interface CardCost {
    魔力: number;
    土地: {
        属性: ElementType | null;
        数: number;
    };
    カード: number; // 0 or 1
}

export interface CardTag {
    [key: string]: string[];
}

export interface CardData {
    種類: CardKind;
    分類: string | null;
    名前: string;
    属性: ElementType | null;
    レアリティ: RarityType;
    AT: number | null;
    HP: number | null;
    コスト: CardCost;
    配置制限: string[];
    アイテム制限: string[];
    能力: string;
    能力タグ: (string | CardTag)[];
    img: string | null;
}
