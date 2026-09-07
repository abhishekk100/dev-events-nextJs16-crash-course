import "server-only";

import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
	conn: Mongoose | null;
	promise: Promise<Mongoose> | null;
};

declare global {
	var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ?? {
	conn: null,
	promise: null,
};

if (!globalThis.mongooseCache) {
	globalThis.mongooseCache = cached;
}

const connectionOptions = {
	bufferCommands: false,
} satisfies mongoose.ConnectOptions;

export const connectToDatabase = async (): Promise<Mongoose> => {
	if (cached.conn) {
		return cached.conn;
	}

	const mongodbUri = process.env.MONGODB_URI;

	if (!mongodbUri) {
		throw new Error("Missing MONGODB_URI environment variable.");
	}

	// Reuse the in-flight promise during hot reloads to avoid duplicate connections.
	if (!cached.promise) {
		cached.promise = mongoose.connect(mongodbUri, connectionOptions);
	}

	try {
		cached.conn = await cached.promise;
		return cached.conn;
	} catch (error) {
		// Reset the failed promise so the next request can retry the connection.
		cached.promise = null;
		throw error;
	}
};
