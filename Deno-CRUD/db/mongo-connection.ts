import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts"; // Always use a specific version

const client = new MongoClient();

// Connect to local MongoDB
await client.connect("mongodb://127.0.0.1:27017");

const db: Database = client.database("deno-crud");

// Export collections
export const usersCollection = db.collection("users");