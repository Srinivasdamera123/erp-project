import { Timestamp } from "firebase/firestore";
import { Entity } from "./entity.model";
import { Project } from "./project.model";
import { PurchaseItem, PurchaseItemDTO } from "./purchaseitem.model";
import { Vendor } from "./vendor.model";

export interface Purchase extends Entity {
  billingProject: Project;
  deliveryProject: Project;
  vendor: Vendor;
  totalPrice: number;
  tax: number;
  subTotalPrice: number;
  items: PurchaseItem[];
  date: Timestamp;
  invoiceAttachments: Attachment[];
  invoiceNumber?: string;
  DCNumber?: string;
  invoiceDate?: Timestamp;
}
export const PURCHASE_COLLECTION = "purchase";
export interface PurchaseDTO extends Entity {
  billingProject: string;
  deliveryProject: string;
  vendor: string;
  totalPrice: number;
  tax: number;
  subTotalPrice: number;
  items: PurchaseItemDTO[];
  date: Timestamp;
  invoiceAttachments: Attachment[];
  invoiceNumber?: string;
  DCNumber?: string;
  invoiceDate?: Timestamp;
}

export interface Attachment {
  path: string;
  fileName: string;
}
