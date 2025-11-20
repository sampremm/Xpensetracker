// src/server.ts
import app from "./app";
import { PORT } from "./config/env";
import { dbconnect } from "./config/db";

const start = async () => {
  await dbconnect();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch(err => {
  console.error("Failed to start", err);
  process.exit(1);
});
