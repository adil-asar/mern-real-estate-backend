import Property from "../models/propertyModel.js";
import cloudinary from "cloudinary";
import { propertyValidationSchema } from "../validations/property.js";

export const CreateProperty = async (req, res) => {
  try {
    // Validate input using Zod
    const validationResult = propertyValidationSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ success: false, errors: validationResult.error.errors });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }

    // Create a new property
    const newProperty = new Property({
      ...req.body,
      images: imageUrls,
      addedBy: req.user._id, // Assuming authentication middleware
    });

    await newProperty.save();

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property: newProperty,
    });

  } catch (error) {
    console.error("❌ CreateProperty Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
