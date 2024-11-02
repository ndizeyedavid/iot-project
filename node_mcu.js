const express = require("express");
const mysql = require("mysql2");
const port = 8080;

const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log("Server is running...");
});

const db = mysql.createConnection({
  host: "kpqmn.h.filess.io",
  user: "nodemcu_currentbuy",
  password: "1836e3ba74a5af8b5096a9f2fb0d11d145574fee",
  database: "nodemcu_currentbuy",
  port: 3307
});
db.on("connect", () => {
  console.log("Database connected");
});
db.on("error", (err) => {
  console.log("failed to connect db");
});
app.get("/", (req, res) => {
  res.json({ message: "Backend is live" });
});

app.get("/settings/status", (req, res) => {
  const sql = "SELECT state FROM settings";
  db.query(sql, (err, result) => {
    res.json(result);
  });
});
