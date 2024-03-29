import * as dotenv from "dotenv";
dotenv.config();

const { DB_URI, PORT, SECRET_ACCESS_TOKEN, STRIPE_TEST_SECRECT_KEY, NODE_ENV } =
  process.env;

export { DB_URI, PORT, SECRET_ACCESS_TOKEN, STRIPE_TEST_SECRECT_KEY, NODE_ENV };
