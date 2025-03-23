import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "email-service",
  brokers: ["localhost:9092"], // Change if using a remote Kafka broker
});

const producer = kafka.producer();

const sendMessage = async (message: object) => {
  await producer.connect();
  await producer.send({
    topic: "email-topic",
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log("✅ Email event sent to Kafka:", message);
};

export { sendMessage };
