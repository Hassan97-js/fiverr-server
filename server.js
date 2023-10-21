import app from "./app.js";

import { connectToDB } from "./utils/index.js";

const PORT = process.env.PORT || 5001;
const BASE_URL = process.env.BASE_URL;

app.listen(PORT, () => {
  connectToDB();
  console.log(`[server]: Running on ${BASE_URL}`);
});
