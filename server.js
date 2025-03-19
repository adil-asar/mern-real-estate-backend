import express from "express";
import dotenv from "dotenv";;
import cors from "cors";
import connectDatabase from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import propertyRoute from "./routes/propertyRoute.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
connectDatabase();
app.get("/", (req, res) => {
    res.send("Property Rental API is running...");
});

app.use("/api/users", userRoute);
app.use("/api/properties",propertyRoute );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
