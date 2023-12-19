import app from "./app";

import { connectToDB } from "./utils/db";
import { logger } from "./constants/logger";
import { PORT } from "./config";

app.listen(PORT, () => {
  connectToDB();
  logger.info(`[Server] Running on http://localhost:${PORT}`);
});
