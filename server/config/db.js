const mongoose = require("mongoose");

// Reuse the connection across warm serverless invocations (Vercel) instead
// of reconnecting on every request; falls back to a plain single connect
// for traditional long-running hosts (local dev, Render, Railway, etc).
let connectionPromise = null;

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set (check your environment variables)");
  }

  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri)
      .then((conn) => {
        console.log("MongoDB connected:", conn.connection.host);
        return conn;
      })
      .catch((err) => {
        connectionPromise = null; // allow a retry on the next request
        console.error("MongoDB connection failed:", err.message);
        throw err;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
