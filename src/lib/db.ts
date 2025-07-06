import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const globalCache = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

if (!globalCache.mongoose) {
  globalCache.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (globalCache.mongoose!.conn) return globalCache.mongoose!.conn;

  if (!globalCache.mongoose!.promise) {
    globalCache.mongoose!.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  globalCache.mongoose!.conn = await globalCache.mongoose!.promise;
  return globalCache.mongoose!.conn;
}