import express, { Application } from "express";
import "dotenv/config";
import userRoutes from "./routes/user.routes";

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK",
    message: "API De Empleados Funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/", (req, res) => {
  res.redirect("/health");
});

app.listen(PORT, () => {
  console.log(`Servidor Ejecutandose En http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`Empleados: http://localhost:3000/api/empleados`);
});