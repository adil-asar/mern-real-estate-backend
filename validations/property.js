import { z } from "zod";


const propertyValidationSchema = z.object({
    name: z.string().min(3, "Property name must be at least 3 characters long"),
    beds: z.number("Beds must be a number"),
    baths: z.number("Baths must be a number"),
    price: z.number("Price must be a number"),
    size: z.number("Size must be a number"), // Square feet
    city: z.string().min(2, "City name must be at least 2 characters long"),
    address: z.string().min(5, "Address must be at least 5 characters long"),
    features: z.array(z.string()).optional(), // Array of strings (optional)
    description: z.string().optional(), // Optional description
    images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"), // Required array of image URLs
  });
