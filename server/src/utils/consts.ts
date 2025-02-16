export const corsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    preflightContinue: false, 
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Authorization",
    exposedHeaders: "Authorization",
  };

export const baseURL = process.env.BASE_URL;