import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-route.js";
import authRouter from "./routes/auth-route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/set-cookie", (req, res) => {
  // Set cookie with SameSite=None attribute
  res.cookie("myCookie", "cookieValue", {
    sameSite: "none",
    secure: true, // Make sure to set secure to true if your application is served over HTTPS
    // Other cookie options such as maxAge, domain, etc.
  });
  res.send("Cookie set successfully");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.log(err));

app.listen(4000, () => {
  console.log(`server running on PORT 4000`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
