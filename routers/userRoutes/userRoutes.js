import express from "express";

// all user controllers (Time controllers)
import getTimeController from "../../controllers/UserControllers/TimeControllers/getTimeController.js";

// Alarm controllers
import {
  viewAllAlarms,
  addNewAlarm,
  updateAlarm,
} from "../../controllers/UserControllers/AlarmControllers/AlarmControllers.js";

const userRoutes = express.Router();

userRoutes.get("/", (req, res) => {
  res.status(200).json({ message: "Accessing users route" });
});

// Get time
userRoutes.get("/time", getTimeController);

// getting all Alarm
userRoutes.get("/alarm/view/all", viewAllAlarms);

// create New Alarm
userRoutes.post("/alarm/add", addNewAlarm);

// Update alarm
userRoutes.put("/alarm/update/:id", updateAlarm);

export default userRoutes;
