import mongoose from "mongoose";


const uri = "mongodb://localhost:27017/real-estate";
const connectDatabase = async() => {
try {
    const db = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${db.connection.host}`);
} catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
}
};

export default connectDatabase