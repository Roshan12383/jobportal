
import "dotenv/config";
import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";
const url = new URL(process.env.DATABASE_URL);

const connection = await mysql.createConnection({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: decodeURIComponent(url.pathname.slice(1)),
ssl: {
  ca: readFileSync("./certs/ca.pem"),
  rejectUnauthorized: true, 
},
});

try {
  const [rows] = await connection.query("SHOW TABLES");
  console.table(rows);
} catch (error) {
  console.error(error.message);
} finally {
  await connection.end();
}
