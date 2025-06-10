




import City from "../models/cityModal.js";


export const createCity = async (req, res) => {
  try {
    const { name } = req.body;

    // Basic validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "City name must be at least 2 characters long" });
    }

    // Check for duplicate
    const existingCity = await City.findOne({ name: name.trim() });
    if (existingCity) {
      return res.status(400).json({ error: "City already exists" });
    }

    // Save new city
    const newCity = new City({ name: name.trim() });
    const savedCity = await newCity.save();

    res.status(201).json({
      message: "City created successfully",
      city: savedCity,
    });
  } catch (error) {
    console.error("Error creating city:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


export const getAllCities = async (req, res) => {}