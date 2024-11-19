import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routers/userRoutes/userRoutes.js";

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log("Server is running. PORT:", port);
});

app.use("/api/user", userRoutes);
