import { DocumentData } from "firebase/firestore";
import { getMaterial, getProject, getVendor } from "../lib/util";
import { Material } from "../model/material.model";
import { Purchase } from "../model/purchase.model";

export async function purchaseConverter(
  document: DocumentData
): Promise<Purchase> {
  const items = [];

  for (var item of document.items) {
    const material: Material = await getMaterial(item.material);
    items.push({ ...item, material, type: material.types?.[item.type] });
  }
  return {
    vendor: await getVendor(document.vendor),
    billingProject: await getProject(document.billingProject),
    deliveryProject: await getProject(document.deliveryProject),
    totalPrice: +document.totalPrice,
    subTotalPrice: +document.subTotalPrice,
    tax: +document.tax,
    date: document.date,
    invoiceAttachments: [...document.invoiceAttachments],
    id: document.id,
    DCNumber: document.DCNumber,
    invoiceNumber: document.invoiceNumber,
    invoiceDate: document.invoiceDate,
    items,
  };
}
