import * as dotenv from "dotenv";
dotenv.config();

const { BASE_URL, DB_URI, PORT, SECRET_ACCESS_TOKEN, STRIPE_TEST_SECRECT_KEY } =
  process.env;

export { BASE_URL, DB_URI, PORT, SECRET_ACCESS_TOKEN, STRIPE_TEST_SECRECT_KEY };
