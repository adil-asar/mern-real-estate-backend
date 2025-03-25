import Property from "../models/propertyModel.js";
import { propertyValidationSchema } from "../validations/property.js"; 

export const CreateProperty = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }


    const uploadedImages = req.files.map(file => file.path); 

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
        : req.body.features.split(",").map(f => f.trim())
      : [],
      images: uploadedImages,
      addedBy: userId,
    };
    const parsed = propertyValidationSchema.safeParse(propertyData);

    if (!parsed.success) {
      console.error(" Validation failed:", parsed.error.flatten());
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

    console.log("✅ Property saved:", savedProperty._id);
    res.status(201).json({ message: "Property created successfully", property: savedProperty });
  } catch (error) {
    console.error("🔥 Error in CreateProperty:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
