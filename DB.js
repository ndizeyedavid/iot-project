import mysql2 from "mysql2";

const DBConnect = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "iot_alarm",
});

DBConnect.on("connect", () => {
  console.log("Database connected successfully");
});

DBConnect.on("error", (err) => {
  console.log("Failed to database. ERROR:  ", err);
});

export default DBConnect;
