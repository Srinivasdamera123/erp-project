import { Entity } from "./entity.model";

export interface Vendor extends Entity {
  name: string;
  shortName?: string;
  address?: string;
  contactPerson?: string;
  contactPersonPhone?: string;
  contactPersonEmail?: string;
  contactPersonGender?: Gender;
  vendorGST?: string;
}

export const MALE = "Male";
export const FEMALE = "Female";
export const Genders = [MALE, FEMALE];
export type Gender = typeof Genders[number];
export const VENDOR_COLLECTION = "vendor";
