import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

export default app;
