import * as yup from "yup";
import { UOMS } from "../model/uom.model";

export const materialSchema = yup
  .object({
    name: yup.string().required("Name cannot be blank"),
    uom: yup.string().oneOf(UOMS).required("UOM cannot be blank"),
    hasMultipleTypes: yup.boolean(),
    price: yup.number().when("hasMultipleTypes", {
      is: false,
      then: (schema) =>
        schema
          .required("Price cannot be blank")
          .moreThan(0, "Price cannot be less than 0"),
    }),
    types: yup.array().when("hasMultipleTypes", {
      is: true,
      then: (schema) =>
        schema.min(1, "At least one type must be present").of(
          yup.object({
            name: yup.string().required("Name cannot be blank"),
            price: yup
              .number()
              .moreThan(0, "Price must be more than zero")
              .required("Price cannot be blank"),
          })
        ),
    }),
  })
  .required();
