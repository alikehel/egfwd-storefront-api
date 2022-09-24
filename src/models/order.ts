import client from "../database/database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Order } from "../types/Order";

dotenv.config();

const SECRET = process.env.SECRET;

//CRUD
export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM orders";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`cannot get orders. ${err}`);
        }
    }

    async create(userid: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql =
                "INSERT INTO orders (userid,status) VALUES ($1,$2) RETURNING *";
            const result = await conn.query(sql, [userid, "active"]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot create order. ${err}`);
        }
    }

    async getOrder(orderid: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM orders WHERE id = $1";
            const result = await conn.query(sql, [orderid]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot create order. ${err}`);
        }
    }
}
