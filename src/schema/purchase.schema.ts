import * as yup from "yup";
import { UOMS } from "../model/uom.model";

export const purchaseSchema = yup
  .object({
    vendor: yup.string().required("Name cannot be blank"),
    billingProject: yup.string().required("Name cannot be blank"),
    deliveryProject: yup.string().required("Name cannot be blank"),
    date: yup.date().required("Date cannot be blank"),
    tax: yup.number().moreThan(-1, "Tax must be more than 0"),
    invoicePath: yup.array().min(1, "Please upload an invoice"),
    invoiceNumber: yup.string().nullable(),
    DCNumber: yup.string().nullable(),
    invoiceDate: yup.date().nullable(),
    invoiceAttachments: yup
      .array()
      .min(1, "At least one attachment must be present"),
    items: yup
      .array()
      .min(1, "At least one item must be present")
      .of(
        yup.object({
          description: yup.string().required("Description cannot be blank"),
          material: yup.string().required("Material cannot be blank"),
          quantity: yup.number().moreThan(0, "Quantity must be more than 0"),
          price: yup.number().moreThan(0, "Price must be more than 0"),
          hasMoreTypes: yup.boolean().nullable(),
          uom: yup
            .string()
            .oneOf(UOMS, "Not a valid UOM")
            .required("UOM cannot be blank"),
          type: yup.string().when("hasMoreTypes", {
            is: true,
            then: (schema) => schema.required("Type cannot be blank"),
            otherwise: (schema) => schema.nullable(),
          }),
        })
      ),
  })
  .required();
