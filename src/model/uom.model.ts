export const TONNE: string = "Tonnes";
export const KG = "Kgs";
export const PIECE = "Pieces/nos";
export const ROD = "Rods/nos";
export const ROLL = "Rolls/nos";
export const BOX = "Boxes/nos";
export const LITER = "Liters";
export const HOURS = "Hours";
export const DAYS = "Days";
export const METRIC_TONNES = "M.Tonnes";

export const UOMS: ReadonlyArray<string> = [
  TONNE,
  KG,
  PIECE,
  ROD,
  ROLL,
  BOX,
  LITER,
  HOURS,
  DAYS,
  METRIC_TONNES,
];

export type UOM = typeof UOMS[number];
