import mysql2 from "mysql2";

const DBConnect = mysql2.createConnection({
  host: "kpqmn.h.filess.io",
  user: "nodemcu_currentbuy",
  password: "1836e3ba74a5af8b5096a9f2fb0d11d145574fee",
  database: "nodemcu_currentbuy",
  port: "3307",
});

DBConnect.on("connect", () => {
  console.log("Database connected successfully");
});

DBConnect.on("error", (err) => {
  console.log("Failed to database. ERROR:  ", err);
});

export default DBConnect;
