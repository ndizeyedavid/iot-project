import express from "express";
import cors from "cors";
import DBConnect from "./DB.js";
// Api Routers

import AlarmRouter from "./routers/AlarmRouter.js";

const port = 8900;

const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log("Server is running");
});

app.use("/api", AlarmRouter);

// alarm timer reset

function resetAlarm() {
  const sql = "UPDATE alarm set alarm_state = 0";
  DBConnect.query(sql, (err, result) => {
    if (err) return console.log("Can't reset timer");
  });
}

setInterval(resetAlarm, 10000);
