import dotenv from "dotenv";
dotenv.config();

export const { APP_PORT, DEBUG_MODE, JWT_SECRET, NODE_ENV ,
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env;
