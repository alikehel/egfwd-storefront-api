import dotenv from "dotenv";

dotenv.config();

const {
    PORT,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    ENV,
    SECRET
} = process.env;

export {
    PORT,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    ENV,
    SECRET
};
