export type WoodColor = 'gris' | 'acajou' | 'chene' | 'marron';
export type WoodFinish = 'brossée' | 'structurée' | 'poncée';
export type DeckShape = 'rectangulaire' | 'L' | 'U';
export type EdgeType = 'cornières' | 'plinthes';

export interface DeckDimensions {
  width: number;
  height: number;
  // For L and U shapes
  extensionWidth?: number;
  extensionHeight?: number;
  extensionDirection?: 'top' | 'bottom' | 'left' | 'right';
}

export interface EdgeSelection {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export interface DeckConfig {
  shape: DeckShape;
  dimensions: DeckDimensions;
  color: WoodColor;
  finish: WoodFinish;
  edgeType: EdgeType;
  includeEdges: boolean;
  edgeSelection?: EdgeSelection;
}

export interface MaterialCalculation {
  area: number;
  lames: number; // meters
  lambourdes: number; // meters
  clips: number; // units
  edges: number; // meters (cornières or plinthes)
  perimeter: number; // meters
}

export interface PriceCalculation {
  lames: number;
  lambourdes: number;
  clips: number;
  edges: number;
  total: number;
}

export const MATERIAL_CONSUMPTION = {
  LAMES_PER_M2: 6.89,
  LAMBOURDES_PER_M2: 3,
  CLIPS_PER_M2: 18,
} as const;

export const PRICES = {
  LAMES_PER_M2: 7800,
  LAMBOURDES_PER_M: 500,
  CLIPS_PER_UNIT: 60,
  CORNIERES_PER_M: 500,
  PLINTHES_PER_M: 300,
} as const;