// src/types.ts

export type ElementType = "無" | "火" | "水" | "地" | "風";
export type RarityType = "N" | "S" | "R" | "E";

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
    名前: string;
    属性: ElementType;
    レアリティ: RarityType;
    AT: number;
    HP: number;
    コスト: CardCost;
    配置制限: string[];
    アイテム制限: string[];
    能力: string;
    能力タグ: (string | CardTag)[];
    img: string | null;
}
