import { Material, MaterialType } from "./material.model";
import { UOM } from "./uom.model";

export interface PurchaseItem {
  description: string;
  material: Material;
  quantity: number;
  price: number;
  totalPrice: number;
  remark: string;
  uom: UOM;
  type: MaterialType;
}

export interface PurchaseItemDTO {
  description: string;
  material: string;
  quantity: number;
  price: number;
  totalPrice: number;
  remark: string;
  uom: UOM;
  type: number;
}
