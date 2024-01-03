import { Client } from "pg";

const { app } = require("./app");
const pool = require("./db");

const PORT = process.env.PORT || 3000;

pool.connect((client: Client, err: Error) => {
  app.listen(PORT, (): void => {
    console.log(`Server Running here 👉 http://localhost:${PORT}`);
  });
});
