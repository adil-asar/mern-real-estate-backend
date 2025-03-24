import Property from "../models/propertyModel.js";
import { propertyValidationSchema } from "../validations/property.js"; 
import { z } from "zod";

export const CreateProperty = async (req, res) => {
  try {
    console.log("➡️ CreateProperty called");
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }

    
    // Debug uploaded files
    console.log("🖼️ Uploaded files:", req.files);
    console.log("🖼️ Uploaded files:", JSON.stringify(req.files, null, 2));


    // Extract images uploaded by multer
    const uploadedImages = req.files.map(file => file.path); // Cloudinary returns .path as URL

    // Combine form data with uploaded image URLs
    const propertyData = {
      name: req.body.name,
      beds: Number(req.body.beds),
      baths: Number(req.body.baths),
      price: Number(req.body.price),
      size: Number(req.body.size),
      city: req.body.city,
      address: req.body.address,
      description: req.body.description || "",
      features: req.body.features
        ? Array.isArray(req.body.features)
          ? req.body.features
          : [req.body.features]
        : [],
      images: uploadedImages,
      addedBy: userId,
    };

    console.log("📦 Final property data before validation:", propertyData);

    // Validate using Zod
    const parsed = propertyValidationSchema.safeParse(propertyData);

    if (!parsed.success) {
      console.error(" Validation failed:", parsed.error.flatten());
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    // Create and save property
    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

    console.log("✅ Property saved:", savedProperty._id);
    res.status(201).json({ message: "Property created successfully", property: savedProperty });
  } catch (error) {
    console.error("🔥 Error in CreateProperty:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
