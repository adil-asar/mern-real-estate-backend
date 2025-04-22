import express from "express";
import dotenv from "dotenv";;
import cors from "cors";
import connectDatabase from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import propertyRoute from "./routes/propertyRoute.js";
import subscriberRoute from "./routes/subscribeRoute.js";
import contactRoute from "./routes/contactRoute.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })
);
app.use(cors());
connectDatabase();
app.get("/", (req, res) => {
    res.send("Property Rental API is running...");
});

app.use("/api/users", userRoute);
app.use("/properties",propertyRoute );
app.use("/subscribers", subscriberRoute);
app.use("/contacts", contactRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
