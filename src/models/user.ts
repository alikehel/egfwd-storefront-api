import client from "../database/database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../types/User";

dotenv.config();

const SECRET = process.env.SECRET;

//CRUD
export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM users";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`cannot get users. ${err}`);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const hash = bcrypt.hashSync(
                user.password + (SECRET as string),
                12
            );
            const conn = await client.connect();
            const sql =
                "INSERT INTO users (username,password,firstname,lastname) VALUES ($1,$2,$3,$4) RETURNING *";
            const result = await conn.query(sql, [
                user.username,
                hash,
                user.firstname,
                user.lastname
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot create user. ${err}`);
        }
    }

    async authenticate(user: User): Promise<boolean> {
        try {
            const conn = await client.connect();
            const sql = "SELECT password FROM users WHERE username=$1";
            const result = await conn.query(sql, [user.username]);
            const password = result.rows[0].password;
            // console.log(
            //     '🚀 ~ file: user.ts ~ line 52 ~ UserStore ~ authenticate ~ password',
            //     password
            // );
            const isAuthenticated = bcrypt.compareSync(
                user.password + (SECRET as string),
                password
            );
            conn.release();
            return isAuthenticated;
        } catch (err) {
            throw new Error(`cannot authenticate user. ${err}`);
        }
    }

    async showUser(username: string): Promise<User> {
        try {
            const con = await client.connect();
            const sql = "SELECT * FROM users WHERE username=$1";
            const result = await con.query(sql, [username]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot get the user. ${err}`);
        }
    }
}
