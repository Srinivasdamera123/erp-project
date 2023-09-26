import { DocumentData } from "firebase/firestore";
import { Material } from "../model/material.model";

export async function materialConverter(
  document: DocumentData
): Promise<Material> {
  return {
    id: document.id,
    name: document.name,
    uom: document.uom,
    hasMultipleTypes: document.hasMultipleTypes,
    price: +document?.price,
    types: [...document?.types],
  };
}
