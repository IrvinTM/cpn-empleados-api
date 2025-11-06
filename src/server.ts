import express, { Application, Request, Response } from "express";
import "dotenv/config"

const app: Application = express();
const PORT: number = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const tesEnv = process.env.NODE_ENV