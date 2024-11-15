const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const port = 8080;

const app = express();
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log("Server is running...");
});

const db = mysql.createConnection({
  host: "kpqmn.h.filess.io",
  user: "nodemcu_currentbuy",
  password: "1836e3ba74a5af8b5096a9f2fb0d11d145574fee",
  database: "nodemcu_currentbuy",
  port: "3307",
});
db.on("connect", () => {
  console.log("Database connected");
});
db.on("error", (err) => {
  console.log("failed to connect db " + err);
});
app.get("/", (req, res) => {
  res.json({ message: "Backend is live" });
});

app.get("/settings/status", (req, res) => {
  const sql = "SELECT state FROM settings";
  db.query(sql, (err, result) => {
    if (err)
      return res.json({ error: "failed to fetch state", message: err.message });
    res.json(result);
  });
});

app.put("/settings/update", (req, res) => {
  const state = req.body.state;
  const sql = "UPDATE settings SET state=?";
  db.query(sql, [state], (err, result) => {
    if (err)
      return res.status(400).json({
        error: "Failed to update gpio state",
        message: err.message,
      });
    res.json({ success: "Gpio state changed", state: state == 1 ? 0 : 1 });
  });
});

let resetId;
const alarmReseter = () => {
  const sql = "UPDATE settings SET state=0";
  db.query(sql, (err, result) => {
    if (err) {
      console.log("Failed to reset alarm timer");
      clearInterval(resetId);
    }
  });
};

resetId = setInterval(alarmReseter, 5000);
