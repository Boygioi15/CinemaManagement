import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mainRouter from "./route.js";
import cookieParser from "cookie-parser";
import databaseInstance from "./database/database.init.js";
//enviroment variables section
dotenv.config();
const PORT = process.env.PORT || 4000;
//generate app
const app = express();
console.log(process.env.PORT);

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(mainRouter);

//special function to catch unhandled error.
app.use((err, req, res, next) => {
  console.log("HELLO");
  console.log("🚀 ~ app.use ~ err:", err);
  res.status(err.status || 500).json({
    msg: err.message || "Internal Server Error",
    success: false,
  });
});
app.listen(PORT, () => {
  console.log(
    "Server is established!, Go to localhost:5000 and see the magic!"
  );
  return;
});
