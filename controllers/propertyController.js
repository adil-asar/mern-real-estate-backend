import Property from "../models/propertyModel.js";
import { propertyValidationSchema } from "../validations/property.js";

export const CreateProperty = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not found in request" });
    }

    const uploadedImages = req.files.map((file) => file.path);

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
          : req.body.features.split(",").map((f) => f.trim())
        : [],
      images: uploadedImages,
      addedBy: userId,
    };
    const parsed = propertyValidationSchema.safeParse(propertyData);

    if (!parsed.success) {
      jjhjjj;
      console.error(" Validation failed:", parsed.error.flatten());
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

    console.log("✅ Property saved:", savedProperty._id);
    res.status(201).json({
      message: "Property created successfully",
      property: savedProperty,
    });
  } catch (error) {
    console.error("🔥 Error in CreateProperty:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const GetAllProperties = async (req, res) => {
  const role = req.user.role;
  console.log("role", role);
  if (role !== "admin") {
    return res.status(401).json({ error: "You are not authorized" });
  }

  try {
    console.log("📦 GetAllProperties called");

    const properties = await Property.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "addedBy",
          foreignField: "_id",
          as: "Owner",
        },
      },
      {
        $unwind: "$Owner",
      },
      {
        $project: {
          name: 1,
          beds: 1,
          baths: 1,
          price: 1,
          size: 1,
          city: 1,
          address: 1,
          description: 1,
          features: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
          Owner: {
            _id: 1,
            firstname: 1,
            lastname: 1,
            email: 1,
            phone: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("❌ Error in GetAllProperties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};
