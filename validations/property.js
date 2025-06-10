import { z } from "zod";

export const propertyValidationSchema = z.object({
  name: z.string().min(3, "Property name must be at least 3 characters long"),
  beds: z.number().min(0, "Beds must be a non-negative number"),
  baths: z.number().min(0, "Baths must be a non-negative number"),
  price: z.number().min(0, "Price must be a non-negative number"),
  size: z.number().min(0, "Size must be a non-negative number"),
  city: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid city ID"),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  features: z.array(z.string()).optional(),
  description: z.string().min(10, "Description must be at least 10 characters long"),

  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),

  category: z.enum(["sale", "rent"], {
    required_error: "Category is required",
    invalid_type_error: "Category must be either 'sale' or 'rent'",
  }),
});
