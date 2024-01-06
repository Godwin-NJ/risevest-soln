import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  // host: "localhost",
  host: "host.docker.internal",
  database: "risevestdb",
  password: "excelG747",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
