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
  port: 3306,
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
    if (err) return res.json({error: "failed to fetch state", message: err.message});
    res.json(result);
  });
});

app.put("/settings/update", (req, res) => {
  const state = req.body.state;
  const sql = "UPDATE settings SET state=?";
  db.query(sql, [state], (err, result) => {
    if (err)
      return res.status.json({
        error: "Failed to update gpio state",
        message: err.message,
      });
    res.json({ success: "Gpio state changed" });
  });
});
