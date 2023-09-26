import { Entity } from "./entity.model";
import { UOM } from "./uom.model";

export interface Material extends Entity {
  name: string;
  uom: UOM;
  price: number;
  hasMultipleTypes: boolean;
  types?: MaterialType[];
}

export interface MaterialType {
  name: string;
  price: number;
}

export const MATERIAL_COLLECTION = "material";
