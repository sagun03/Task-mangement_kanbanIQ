import { server } from "./app"; 

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server due to database issues:", error);
  }
}

startServer();
