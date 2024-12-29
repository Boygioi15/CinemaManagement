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
    credentials: true, // Cho phép gửi cookie và thông tin xác thực
    origin: 'http://localhost:5173', // Chỉ định domain frontend của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    preflightContinue: false, // Không chuyển tiếp yêu cầu OPTIONS
    optionsSuccessStatus: 204, // Trả về status code 204 cho yêu cầu OPTIONS
  }),
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