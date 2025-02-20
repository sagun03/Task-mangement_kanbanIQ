import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!base64ServiceAccount) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is missing.");
}

const serviceAccount = JSON.parse(
  Buffer.from(base64ServiceAccount, "base64").toString("utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

export { auth };
