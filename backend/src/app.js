import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mainRouter from "./route.js";
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
  console.error(err.stack);
  res.status(500).send("Internal server error");
});
app.listen(PORT, () => {
  console.log(
    "Server is established!, Go to localhost:5000 and see the magic!"
  );
  return;
});
