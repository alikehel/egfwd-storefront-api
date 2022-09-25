import client from "../database/database";
import dotenv from "dotenv";
import { Order } from "../types/Order";
import { orderQueries } from "../database/queries";

dotenv.config();

//CRUD
export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const result = await conn.query(orderQueries.showOrders);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`cannot get orders. ${err}`);
        }
    }

    async create(userid: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const result = await conn.query(orderQueries.createOrder, [
                userid,
                "active"
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot create order. ${err}`);
        }
    }

    async getOrder(orderid: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const result = await conn.query(orderQueries.showOrder, [orderid]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot create order. ${err}`);
        }
    }
}
