import { z } from "zod";

export const signUpSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: "First name is required" })
    .regex(/^[A-Za-z]+$/, { message: "First name must contain only letters" }),
  lastname: z
    .string()
    .min(3, { message: "Last name is required" })
    .regex(/^[A-Za-z]+$/, { message: "Last name must contain only letters" }),
  phone: z
    .string()
    .min(13, { message: "Phone number must be 13 characters" })
    .max(13, { message: "Phone number must be 13 characters " })
    .regex(/^\+\d{12}$/, {
      message: "Phone number must start with '+' and 13 characters",
    }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      {
        message:
          "Password must contain at least one uppercase letter, one number, and one special character",
      }
    ),
  role: z.enum(["user", "admin"]).default("user"),
});


export const signInSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email address" }),
  password: z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(20, { message: "Password must be at most 20 characters long" })
  .regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
    {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    }
  ),
});
