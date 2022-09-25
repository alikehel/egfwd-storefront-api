import client from "../../../database/database";
import dotenv from "dotenv";
import { OrderStore } from "../../../models/order";
import { UserStore } from "../../../models/user";
import { DashboardStore } from "../../../models/services/dashboard";
import { ProductStore } from "../../../models/product";
import { users, products } from "../../../data/data";

dotenv.config();

const productStore = new ProductStore();
const userStore = new UserStore();
const orderStore = new OrderStore();
const dashboardStore = new DashboardStore();

describe("dashboard model", () => {
    beforeAll(async () => {
        try {
            const { id: userid } = await userStore.create(users[0]);
            await productStore.create(products[0]);
            await productStore.create(products[1]);
            await orderStore.create(userid as unknown as number);

            const conn = await client.connect();
            const sql =
                "INSERT INTO orders_products (orderid,productid,quantity) VALUES ($1,$2,$3)";
            await conn.query(sql, [1, 1, 1]);

            conn.release();
        } catch (err) {
            throw new Error(`cannot create order. ${err}`);
        }
    });

    afterAll(async () => {
        try {
            const conn = await client.connect();
            const sql =
                "TRUNCATE TABLE orders,users,products RESTART IDENTITY CASCADE";
            await conn.query(sql);
            conn.release();
        } catch (err) {
            throw new Error(
                `cannot TRUNCATE orders,users,products table. ${err}`
            );
        }
    });

    // getUserOrderProducts;
    it("should get order products", async () => {
        expect(await dashboardStore.getUserOrderProducts(1)).toEqual([
            { orderid: 1, name: "samsung" }
        ]);
    });

    // addProductToOrder;
    it("should add product to order", async () => {
        expect(await dashboardStore.addProductToOrder(1, 2)).toEqual({
            id: 2,
            orderid: 1,
            productid: 2,
            quantity: 1
        });
    });
});
