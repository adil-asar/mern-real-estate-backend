import mongoose from "mongoose";

const CitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, 
  },
  { timestamps: true } 
);

const City = mongoose.model("City", CitySchema);

export default City;
