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
  
  const sql = "UPDATE alarm SET alarm_state = ?";
  DBConnect.query(sql, [1], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Unable to change alarm_state", error: err.message });
    res
      .status(201)
      .json({ message: "Alarm State changed successfully", result: result });
  });
};

const resetAlarmState = () => {
  // const sql = "UPDATE alarm SET alarm_state = ?";
  // DBConnect.query(sql, [0], (err, result) => {
  //   if (err)
  //     return console.log("Failed to reset alarm_state. ERROR: ", err.message);
  // });
  null
};

export { getAlarmState, changeAlarmState, resetAlarmState };
