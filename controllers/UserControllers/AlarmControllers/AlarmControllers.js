import DB from "../../../DB.js";

const viewAllAlarms = (req, res) => {
  const sql = "SELECT * FROM alarms";
  DB.query(sql, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Failed to fetch alarms", error: err.message });
    res.status(200).json({ message: "Fetched all alarms", result: result });
  });
};

const addNewAlarm = (req, res) => {
  const { title, time, mon, tue, wed, thur, fri, sat, sun } = req.body;

  const sql =
    "INSERT INTO alarms(alarm_title, alarm_time, mon, tue, wed, thur, fri, sat, sun) VALUES(? , ? , ? , ? , ? , ? , ? , ? , ?)";
  DB.query(
    sql,
    [title, time, mon, tue, wed, thur, fri, sat, sun],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Failed to create new alarm", error: err.message });

      res.status(201).json({ message: "New alarm set", result: result });
    }
  );
};

const updateAlarm = (req, res) => {
  const { id } = req.params;
  const { title, time, mon, tue, wed, thur, fri, sat, sun } = req.body;

  const sql =
    "UPDATE alarm SET alarm_title = ? , alarm_time = ? , mon = ? , tue = ? , wed = ? , thur = ? , fri = ? , sat = ? , sun = ? WHERE id = ?";

  DB.query(
    sql,
    [title, time, mon, tue, wed, thur, fri, sat, sun, id],
    (err, result) => {
      if (err)
        return res
          .status(304)
          .json({ message: "Failed to update alarm", error: err.message });

      res
        .status(200)
        .json({ message: "Updated alarm with id " + id, result: result });
    }
  );
};

export { viewAllAlarms, addNewAlarm, updateAlarm };
