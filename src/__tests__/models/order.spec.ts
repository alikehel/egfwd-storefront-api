import client from "../../database/database";
import dotenv from "dotenv";
import { Order } from "../../types/Order";
import { OrderStore } from "../../models/order";
import { UserStore } from "../../models/user";
import { users, orders } from "../../data/data";

dotenv.config();

// const productStore = new ProductStore();
const userStore = new UserStore();
const orderStore = new OrderStore();

describe("order model", () => {
    beforeAll(async () => {
        try {
            const { id } = await userStore.create(users[0]);
            const conn = await client.connect();
            const sql = "INSERT INTO orders (userid,status) VALUES ($1,$2)";
            await conn.query(sql, [id, orders[0].status]);
            conn.release();
        } catch (err) {
            throw new Error(`cannot create order. ${err}`);
        }
    });

    afterAll(async () => {
        try {
            const conn = await client.connect();
            const sql = "TRUNCATE TABLE orders,users RESTART IDENTITY CASCADE";
            await conn.query(sql);
            conn.release();
        } catch (err) {
            throw new Error(`cannot TRUNCATE orders,users table. ${err}`);
        }
    });

    it("should get all orders", async () => {
        expect(await orderStore.index()).toEqual([
            {
                id: 1,
                ...orders[0]
            }
        ]);
    });

    it("should create new order", async () => {
        const result = await orderStore.create(1);
        expect(result).toEqual({ id: 2, ...orders[0] });
    });

    it("should show one order", async () => {
        const result = await orderStore.getOrder(2);
        expect(result).toEqual({ id: 2, ...orders[0] });
    });

    it("should NOT show one order", async () => {
        expect(await orderStore.getOrder(-5)).toEqual(
            undefined as unknown as Order
        );
    });
});
