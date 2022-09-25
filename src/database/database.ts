import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
import {
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    ENV
} from "../config/config";

let pool: Pool;

if (ENV === "test") {
    pool = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB_TEST,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });
} else {
    pool = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });
}

export default pool;
