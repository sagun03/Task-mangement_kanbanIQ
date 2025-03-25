import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import EmailService from "../email/email.service";

dotenv.config();

const kafka = new Kafka({
  clientId: "email-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "email-group" });
const emailService = new EmailService(); // Create an instance of EmailService

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "email-topic", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const emailData = JSON.parse(message?.value!.toString());
      console.log("📩 Processing email:", emailData);

      try {
        await emailService.sendEmail(
          emailData.to,
          emailData.subject,
          emailData.text,
          emailData.html
        );

        console.log("✅ Email sent successfully to", emailData.to);
      } catch (error) {
        console.error("❌ Error sending email:", error);
      }
    },
  });
};

