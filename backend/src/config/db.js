import dns from "dns";
import mongoose from "mongoose";

// Support Windows DNS resolution for MongoDB Atlas SRV connection strings
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  console.warn("DNS setServers warning:", e.message);
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(pro