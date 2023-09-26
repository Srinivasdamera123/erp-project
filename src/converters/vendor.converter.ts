import { DocumentData } from "firebase/firestore";
import { Vendor } from "../model/vendor.model";

export async function vendorConverter(document: DocumentData): Promise<Vendor> {
  return {
    id: document.id,
    name: document.name,
    shortName: document.shortName,
    address: document.address,
    contactPerson: document.contactPerson,
    contactPersonPhone: document.contactPersonPhone,
    contactPersonEmail: document.contactPersonEmail,
    contactPersonGender: document.contactPersonGender,
    vendorGST: document.vendorGST,
  };
}
