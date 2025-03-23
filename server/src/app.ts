import express from "express";
import bodyParser from "body-parser";
import router from "./router";
import { setupSwagger } from "./config/swagger";
import cors from "cors";
import connectDB from "./config/database.config";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use('/api', router);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});
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
