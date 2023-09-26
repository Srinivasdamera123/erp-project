import { Timestamp } from "firebase/firestore";
import { Entity } from "./entity.model";
import { Project } from "./project.model";

export interface Contractor extends Entity {
  name: string;
  totalAmount: number;
  remainingAmount: number;
  project: Project;
  transactions: Transaction[];
}

export interface Transaction {
  date: Timestamp;
  description: string;
  amount: number;
}

export interface ContractorDTO extends Entity {
  name: string;
  totalAmount: number;
  remainingAmount: number;
  project: string;
  transactions: [];
}
export const CONTRACTOR_COLLECTION = "contractor";
