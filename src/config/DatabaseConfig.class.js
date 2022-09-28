import { config } from 'dotenv';
import { MongoClient } from "mongodb";
config();

export class DatabaseConfig {
  constructor(){
    this.url = process.env.DATABASE_URL;
    this.client = new MongoClient(this.url);
    this.database = this.client.db(process.env.DATABASE_NAME);
  }
}
