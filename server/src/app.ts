import express from "express";
import bodyParser from "body-parser";
import router from "./router";
import { setupSwagger } from "./config/swagger";
import cors from "cors";
import { corsOptions } from "./utils/consts";
import connectDB from "./config/database.config";

const app = express();

app.use(cors(corsOptions)); 
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', router); 

setupSwagger(app);

// Start Database
connectDB();

export default app;
