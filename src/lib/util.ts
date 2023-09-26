import {
  UpdateData,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { contractorConverter } from "../converters/contractor.converter";
import { employeeConverter } from "../converters/employee.converter";
import { materialConverter } from "../converters/material.converter";
import { projectConverter } from "../converters/project.converter";
import { purchaseConverter } from "../converters/purchase.converter";
import { vendorConverter } from "../converters/vendor.converter";
import { CONTRACTOR_COLLECTION, Contractor } from "../model/contractor.model";
import { EMPLOYEE_COLLECTION, Employee } from "../model/employee.model";
import { Entity } from "../model/entity.model";
import { MATERIAL_COLLECTION, Material } from "../model/material.model";
import { PROJECT_COLLECTION, Project } from "../model/project.model";
import { PURCHASE_COLLECTION, Purchase } from "../model/purchase.model";
import { VENDOR_COLLECTION, Vendor } from "../model/vendor.model";
import { erpFirestore } from "./firebase";

export async function saveEnitity<T extends Entity>(
  path: string,
  data: Omit<T, "id">
) {
  const docRef = doc(collection(erpFirestore, path));
  await setDoc(docRef, {
    id: docRef.id,
    ...data,
  });
  return docRef.id;
}

export async function updateEnitity<T extends Entity>(
  path: string,
  data: Partial<T>,
  id: string
) {
  await setDoc(doc(erpFirestore, path, id), data, { merge: true });
  return id;
}
export const patchEnitity = async <T extends Entity>(
  path: string,
  data: UpdateData<T>,
  id: string
) => {
  await updateDoc(doc(erpFirestore, path, id), data);
  return id;
};

export async function getMaterial(id: string): Promise<Material> {
  return getDoc(doc(erpFirestore, MATERIAL_COLLECTION, id))
    .then((res) => res.data())
    .then((doc) => materialConverter(doc || {}));
}

export async function getContractor(id: string): Promise<Contractor> {
  return getDoc(doc(erpFirestore, CONTRACTOR_COLLECTION, id))
    .then((res) => res.data())
    .then((doc) => contractorConverter(doc || {}));
}
export async function getVendor(id: string): Promise<Vendor> {
  return getDoc(doc(erpFirestore, VENDOR_COLLECTION, id))
    .then((res) => res.data())
    .then((doc) => vendorConverter(doc || {}));
}

export async function getProject(id: string): Promise<Project> {
  return getDoc(doc(erpFirestore, PROJECT_COLLECTION, id))
    .then((res) => res.data())
    .then((doc) => projectConverter(doc || {}));
}
export async function getPurchase(id: string): Promise<Purchase> {
  return getDoc(doc(erpFirestore, PURCHASE_COLLECTION, id))
    .then((res) => res.data())
    .then((doc) => purchaseConverter(doc || {}));
}

export async function getEmployee(id: string): Promise<Employee> {
  return getDoc(doc(erpFirestore, EMPLOYEE_COLLECTION, id))
    .then((res) => res.data())
    .then((doc) => employeeConverter(doc || {}));
}

export const CREATE_MODE = "create";
export const EDIT_MODE = "edit";

export type MODE = typeof CREATE_MODE | typeof EDIT_MODE;
