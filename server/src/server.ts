import { server } from "./app"; 
import { startConsumer } from "./modules/kafka/kafkaConsumer";

const PORT = process.env.PORT || 8082;

const startServer = async () => {
  try {
    await startConsumer();

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('API endpoints available at /api/*');
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
