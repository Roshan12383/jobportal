import "dotenv/config";

import mysql from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";

const connection = mysql.createConnection(process.env.DATABASE_URL!);

connection.query("SET time_zone = '+00:00'");

export const db = drizzle({
  client: connection,
});