import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const baseURL = process.env.BASE_URL || 'http://localhost:8082';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KanbanIQ API",
      version: "1.0.0",
      description: "API for managing tasks",
    },
    servers: [{ url: `${baseURL}/api` }],
  },
  apis: ["./src/modules/*/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
