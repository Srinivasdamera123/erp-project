import { DocumentData } from "firebase/firestore";
import { getProject } from "../lib/util";
import { Contractor } from "../model/contractor.model";

export async function contractorConverter(
  document: DocumentData
): Promise<Contractor> {
  return {
    id: document.id,
    name: document.name,
    project: await getProject(document.project),
    totalAmount: document.totalAmount,
    remainingAmount: document.remainingAmount,
    transactions: [...document.transactions],
  };
}
