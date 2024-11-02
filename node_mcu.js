const express = require("express");
const mysql = require("mysql2");
const port = 8080;

const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log("Server is running...");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_mcu",
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
