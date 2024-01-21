import app from "./app";

import { connectToDB } from "./utils/db";
import { logger } from "./constants/logger";
import { PORT } from "./config";

app.listen(PORT, async () => {
  try {
    await connectToDB();
    logger.info(`[Server] Running on http://localhost:${PORT}`);
  } catch (error) {
    logger.error(`[DB] Could not connect to DB`);
  }
});
