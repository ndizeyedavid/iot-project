import express from "express";
import {
  getAlarmState,
  changeAlarmState,
  resetAlarmState,
} from "../controllers/AlarmControllers.js";

const AlarmRouter = express.Router();

AlarmRouter.get("/", (req, res) => {
  res.status(200).json({ message: "IoT_alarm API is Live...." });
});
// fetching the current state of the alarm
AlarmRouter.get("/state", getAlarmState);

// set The alarm state on
AlarmRouter.post("/state/change", changeAlarmState);

setInterval(resetAlarmState, 10000);

export default AlarmRouter;
