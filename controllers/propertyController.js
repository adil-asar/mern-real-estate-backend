import Property from "../models/propertyModel.js";
import { propertyValidationSchema } from "../validations/property.js";
import City from "../models/cityModal.js"; 

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
      city: req.body.city, // Should be city ObjectId string
      address: req.body.address,
      description: req.body.description || "",
      features: req.body.features
        ? Array.isArray(req.body.features)
          ? req.body.features
          : req.body.features.split(",").map((f) => f.trim())
        : [],
      images: uploadedImages,
      addedBy: userId,
      category: req.body.category, // New field
    };

    // Validate input data using Zod
    const parsed = propertyValidationSchema.safeParse(propertyData);
    if (!parsed.success) {
      console.error("Validation failed:", parsed.error.flatten());
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    // Ensure the city exists in the City collection
    const cityExists = await City.findById(propertyData.city);
    if (!cityExists) {
      return res.status(400).json({ error: "Invalid city ID: city not found" });
    }

    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

    res.status(200).json({
      message: "Property created successfully",
      property: savedProperty,
    });
  } catch (error) {
    console.error("Error in CreateProperty:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const GetAllProperties = async (req, res) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(401).json({ error: "You are not authorized" });
  }

  const {
    page: pageQuery,
    beds,
    baths,
    price,
    size,
    city,
    features,
  } = req.query;

  const conditions = [];
  if (beds) conditions.push({ beds: parseInt(beds) });
  if (baths) conditions.push({ baths: parseInt(baths) });
  if (price) conditions.push({ price: parseInt(price) });
  if (size) conditions.push({ size: parseInt(size) });
  if (city) conditions.push({ city });
  if (features) {
    const featureArray = Array.isArray(features)
      ? features
      : features.split(",");
    conditions.push({ features: { $all: featureArray } });
  }

  const matchStage = conditions.length > 0 ? { $or: conditions } : {};
  const isFilterApplied = conditions.length > 0;

  const page = parseFloat(pageQuery) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  try {
    const pipeline = [{ $match: matchStage }, { $sort: { createdAt: -1 } }];

    if (!isFilterApplied) {
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "addedBy",
          foreignField: "_id",
          as: "Owner",
        },
      },
      { $unwind: "$Owner" },
       {
    $lookup: {
      from: "cities",
      localField: "city",
      foreignField: "_id",
      as: "city",
    },
  },
  { $unwind: "$city" },
      {
        $project: {
          name: 1,
          beds: 1,
          baths: 1,
          price: 1,
          size: 1,
          city: { name: 1 },
          address: 1,
          description: 1,
          features: 1,
          category: 1,
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
      }
    );

    const properties = await Property.aggregate(pipeline);
    const totalItems = await Property.countDocuments(matchStage);

    res.status(200).json({
      totalItems,
      currentPage: isFilterApplied ? 1 : page,
      totalPages: isFilterApplied ? 1 : Math.ceil(totalItems / limit),
      properties,
    });
  } catch (error) {
    console.error("Error in GetAllProperties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

export const deleteProperty = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  if (role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const deleteProperties = await Property.findByIdAndDelete(id);
    if (!deleteProperties) {
      return res.status(404).json({ error: "Property not found" });
    }
    return res.status(200).json({
      message: "Property deleted successfully.",
      deletedItem: deleteProperties,
    });
  } catch (error) {
    console.error("Error in deleting properties", error),
      res.status(500).json({ error: "Failed to delete property" });
  }
};
