import app from "./app.js";

import { connectToDB } from "./config/index.js";

const port = process.env.PORT || 5001;

app.listen(port, () => {
  connectToDB();
  console.log(`[server]: Running on port http://localhost:${port}`);
});
