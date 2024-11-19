import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const DB = mysql2.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

DB.on("connect", () => {
  console.log("Database connected");
});

DB.on("error", (err) => {
  console.log("An error occured. ERROR: ", err.message);
});

export default DB;
