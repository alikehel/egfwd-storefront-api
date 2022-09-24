import client from "../../../database/database";
import dotenv from "dotenv";
import { Product } from "../../../types/Product";
import { User } from "../../../types/User";
import { OrderStore } from "../../../models/order";
import { UserStore } from "../../../models/user";
import { DashboardStore } from "../../../models/services/dashboard";
import { ProductStore } from "../../../models/product";

dotenv.config();

const productStore = new ProductStore();
const userStore = new UserStore();
const orderStore = new OrderStore();
const dashboardStore = new DashboardStore();

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

const products: Product[] = [
    {
        name: "samsung",
        price: 5000,
        category: "phones"
    },
    {
        name: "iphone",
        price: 15000,
        category: "phones"
    },
    {
        name: "acer",
        price: 30000,
        category: "laptops"
    }
];

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
