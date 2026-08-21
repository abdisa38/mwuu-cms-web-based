import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix Windows SRV DNS resolution
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("URI from env:", process.env.MONGO_URI ? "Found" : "Missing");

try {
  console.log("Connecting to Mongo with Google DNS resolver...");
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("✅ CONNECTED SUCCESSFULLY TO:", conn.connection.host);
  await mongoose.disconnect();
  console.log("Disconnected.");
  process.exit(0);
} catch (err) {
  console.error("Connection failed:", err.message);
  process.exit(1);
}
