import { boolean, object, string } from "zod";

export const registerSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(5, "Password must be more than 5 characters")
    .max(32, "Password must be less than 32 characters"),
  name: string({ required_error: "Name is required" }).min(
    1,
    "Name is required"
  ),
});

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const titleSchema = object({
  es: string({ required_error: "Spanish title is required" })
    .min(1, "Spanish title is required")
    .max(50, "Spanish title must be less than 50 characters"),
  en: string({ required_error: "English title is required" })
    .min(1, "English title is required")
    .max(50, "English title must be less than 50 characters"),
  fr: string({ required_error: "French title is required" })
    .min(1, "French title is required")
    .max(50, "French title must be less than 50 characters"),
});

export const createSectionScheme = object({
  title: titleSchema,
  isactive: boolean().optional(),
});

export const editSectionScheme = object({
  id: string({ required_error: "Id is required" })
    .min(1, "Id is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format category"),
  title: titleSchema,
  isactive: boolean().refine((val) => val !== undefined && val !== null, {
    message: "isactive cannot be undefined or null",
  }),
}).strip();

export const createCategoryScheme = object({
  title: titleSchema,
  isactive: boolean().optional(),
  sectionid: string({ required_error: "Id is required" })
    .min(1, "Id is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format category"),
});

export const editCategoryScheme = object({
  id: string({ required_error: "Id is required" })
    .min(1, "Id is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format category"),
  title: titleSchema,
  isactive: boolean().refine((val) => val !== undefined && val !== null, {
    message: "isactive cannot be undefined or null",
  }),
  sectionid: string({ required_error: "Id is required" })
    .min(1, "Id is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format category"),
}).strip();

export const createProductScheme = object({
  title: titleSchema,
  price: string({ required_error: "Price is required" }).min(
    0,
    "Price is required"
  ),
  isactive: boolean().optional(),
  categoryid: string({ required_error: "Id is required" })
    .min(1, "Id is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format category"),
});

export const editProductScheme = object({
  id: string({ required_error: "Id is required" })
    .min(1, "Id is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format category"),
  title: titleSchema,
  price: string({ required_error: "Price is required" }).min(
    0,
    "Price is required"
  ),
  isactive: boolean().refine((val) => val !== undefined && val !== null, {
    message: "isactive cannot be undefined or null",
  }),
  categoryid: string({ required_error: "Id is required" })
    .min(1, "Id is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format category"),
});
