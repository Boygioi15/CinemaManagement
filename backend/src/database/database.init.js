import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(process.env.MONGODB_URI, {
        maxPoolSize: 50,
      })
      .then((_) => console.log("Connect to database successfully"))
      .catch((err) =>
        console.log("Error while connecting to database. Error:" + err)
      );
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const databaseInstance = Database.getInstance();
export default databaseInstance;
