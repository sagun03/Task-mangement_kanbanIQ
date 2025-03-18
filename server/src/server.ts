import app from "./app";
import connectDB from "./config/database.config";

const PORT = process.env.PORT || 8082;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('API endpoints available at /api/*');
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
