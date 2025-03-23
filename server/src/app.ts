import express from "express";
import bodyParser from "body-parser";
import router from "./router";
import { setupSwagger } from "./config/swagger";
import cors from "cors";
import { corsOptions } from "./utils/consts";
import connectDB from "./config/database.config";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

export const server = http.createServer(app);
export const wss = new WebSocketServer({ server });

app.use("/api", router);

// Create a WebSocket namespace `/tasks`
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
      ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => console.log("Client disconnected"));
});

setupSwagger(app);

// Start Database
connectDB();

export default app;
