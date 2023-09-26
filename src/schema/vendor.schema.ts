import * as yup from "yup";
import { Genders } from "../model/vendor.model";

export const vendorSchema = yup.object({
  name: yup.string().required("Name cannot be blank"),
  shortName: yup.string(),
  address: yup.string(),
  contactPerson: yup.string(),
  contactPersonPhone: yup.string(),
  contactPersonEmail: yup.string().email("Not a valid email"),
  contactPersonGender: yup
    .string()
    .nullable()
    .oneOf([...Genders, ""], "Invalid gender"),
  vendorGST: yup.string(),
});
