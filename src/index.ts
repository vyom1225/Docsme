import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import AuthRouter from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Default to port 3000 if not specified

// Set up middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRouter);

app.get("/", (request, response) => {
    response.status(200).json({
        Message: "Server is Running"
    });
});

// Connect to database and then start server
(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
})();