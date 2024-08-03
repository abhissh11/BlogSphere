import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-route.js";
import authRouter from "./routes/auth-route.js";
import postRouter from "./routes/post-route.js";
import commentRouter from "./routes/comment-route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.log(err));

const __dirname = path.resolve();

const app = express();
const allowedOrigins = [
  "https://blogsphere-h6tw.onrender.com",
  "https://blog-sphere-nu.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(4000, () => {
  console.log(`server running`);
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
