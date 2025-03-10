import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { signUpSchema } from "../validations/user.js";

export const Signup = async (req, res) => {
  try {
    // Use safeParse() to validate the request body
    const result = signUpSchema.safeParse(req.body);
    if (!result.success) {
      // Transform errors into an object keyed by field names
      const errors = result.error.errors.reduce((acc, err) => {
        const field = err.path[0];
        if (!acc[field]) {
          acc[field] = err.message;
        } else {
          acc[field] += `, ${err.message}`;
        }
        return acc;
      }, {});
      return res.status(400).json({ errors });
    }

    // Destructure validated data
    const { firstname, lastname, phone, email, password, role } = result.data;

    // Check if user with the same email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      firstname,
      lastname,
      phone,
      email,
      password: hashedPassword,
      role,
    });

    // Prepare a response object without the password
    const userResponse = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const Signin = async (req, res) => {
    res.send("Signin api is available");

}


