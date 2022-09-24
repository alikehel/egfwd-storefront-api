import client from "../../database/database";
import dotenv from "dotenv";
import { User } from "../../types/User";
import { Order } from "../../types/Order";
import { OrderStore } from "../../models/order";
import { UserStore } from "../../models/user";

dotenv.config();

// const productStore = new ProductStore();
const userStore = new UserStore();
const orderStore = new OrderStore();

const users: User[] = [
    {
        username: "ke7el1username",
        password: "ke7el1pass",
        firstname: "ali1",
        lastname: "kehel1"
    },
    {
        username: "ke7el2username",
        password: "ke7el2pass",
        firstname: "ali2",
        lastname: "kehel2"
    },
    {
        username: "ke7el3username",
        password: "ke7el3pass",
        firstname: "ali3",
        lastname: "kehel3"
    }
];

const orders: Order[] = [
    {
        userid: 1,
        status: "active"
    },
    {
        userid: 2,
        status: "active"
    },
    {
        userid: 3,
        status: "active"
    }
];

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
