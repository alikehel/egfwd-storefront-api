import client from "../database/database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../types/User";
import { userQueries } from "../database/queries";
import { SECRET } from "../config/config";

dotenv.config();

//CRUD
export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const result = await conn.query(userQueries.showUsers);
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
            const result = await conn.query(userQueries.createUser, [
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
            const result = await conn.query(userQueries.authenticateUser, [
                user.username
            ]);
            const password = result.rows[0].password;
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
            const result = await con.query(userQueries.showUser, [username]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot get the user. ${err}`);
        }
    }
}
