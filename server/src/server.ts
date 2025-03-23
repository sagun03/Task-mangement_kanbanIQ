import { server } from "./app"; 
import { startConsumer } from "./modules/kafka/kafkaConsumer";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await startConsumer();

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server due to database issues:", error);
  }
}

startServer();
