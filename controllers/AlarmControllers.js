import DBConnect from "../DB.js";

const getAlarmState = (req, res) => {
  const sql = "SELECT * FROM alarm";
  DBConnect.query(sql, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Unable to fetch alarm state", error: err.message });
    res.status(200).json({ message: "Fetched alarm state", data: result });
  });
};

const changeAlarmState = (req, res) => {
  const sqlUpdate = "UPDATE alarm SET alarm_state = ?";

  // Step 1: Update the alarm state to 1 (trigger the alarm)
  DBConnect.query(sqlUpdate, [1], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Unable to change alarm_state", error: err.message });
    }

    // Step 2: Send the initial response to indicate alarm is ringing
    res
      .status(201)
      .json({ message: "Alarm State changed to 1 (Ringing)", result: result });

    // Step 3: Set the alarm state back to 0 after 10 seconds (10,000 milliseconds)
    setTimeout(() => {
      DBConnect.query(sqlUpdate, [0], (err, result) => {
        if (err) {
          return console.error("Error resetting alarm state:", err.message);
        }
      });
    }, 10000); // 10 seconds delay before resetting the alarm state
  });
};

const resetAlarmState = () => {
  const sql = "UPDATE alarm SET alarm_state = ?";
  DBConnect.query(sql, [0], (err, result) => {
    if (err)
      return console.log("Failed to reset alarm_state. ERROR: ", err.message);
  });
};

export { getAlarmState, changeAlarmState, resetAlarmState };
