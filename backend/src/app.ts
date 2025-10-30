import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import experienceRoutes from "./routes/experience.routes";
import bookingRoutes from "./routes/booking.routes";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/experiences", experienceRoutes);
app.use("/api/bookings", bookingRoutes);

// If route not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Server Error:", err.message || err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Uncaught exceptions (synchronous)
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1); 
});

// Unhandled promise rejections (async)
process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1); 
});

export default app;
