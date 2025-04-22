
import { z } from "zod";

export const contactValidationSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    phone: z
    .string()
    .min(13, { message: "Phone number must be 13 characters" })
    .max(13, { message: "Phone number must be 13 characters " })
    .regex(/^\+\d{12}$/, {
      message: "Phone number must start with '+' and 13 characters",
    }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  message: z.string(),
});