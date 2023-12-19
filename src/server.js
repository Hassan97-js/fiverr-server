import app from "./app.js";

import { connectToDB } from "./utils/db.js";
import { PORT } from "./config/index.js";
import { logger } from "./constants/logger.js";

app.listen(PORT, () => {
  connectToDB();
  logger.info(`[Server] Running on http://localhost:${PORT}`);
});
