import app from "./app.js";

import { connectToDB } from "./utils/db.js";
import { BASE_URL, PORT } from "./config/index.js";

app.listen(PORT, () => {
  connectToDB();
  console.log(`[server]: Running on ${BASE_URL}`);
});
