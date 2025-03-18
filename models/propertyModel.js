import mongoose from "mongoose";


const PropertySchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      beds: { type: Number, required: true },
      baths: { type: Number, required: true },
      price: { type: Number, required: true },
      size: { type: Number, required: true }, 
      city: { type: String, required: true },
      address: { type: String, required: true },
      features: { type: [String], default: [] }, 
      description: { type: String, required: true }, 
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
      images: { type: [String], default: [] }, // Array of image URLs
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
  );

  const Property = mongoose.model("Property", PropertySchema);

  export default Property; 

