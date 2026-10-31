import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing required environment variable: MONGODB_URI");

let connection = globalThis.mongooseConnection;
if (!connection) {
  connection = globalThis.mongooseConnection = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  if (connection.conn) return connection.conn;
  if (!connection.promise) {
    connection.promise = mongoose.connect(uri, { bufferCommands: false });
  }
  try {
    connection.conn = await connection.promise;
  } catch (error) {
    connection.promise = null;
    throw error;
  }
  return connection.conn;
}
