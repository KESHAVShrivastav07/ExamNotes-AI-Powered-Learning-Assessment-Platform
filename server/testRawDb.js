import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collections = await db.listCollections().toArray();
    let result = {};
    for (let c of collections) {
      if (c.name === 'usermodels' || c.name === 'admins' || c.name === 'teachers') {
          const docs = await db.collection(c.name).find({}).toArray();
          result[c.name] = docs.map(d => ({ email: d.email, role: d.role, credits: d.credits }));
      }
    }
    fs.writeFileSync('db_dump.json', JSON.stringify(result, null, 2));
    console.log("Dumped out users to db_dump.json");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
