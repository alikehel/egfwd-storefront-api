import { ProductStore } from "../../../models/product";
import { UserStore } from "../../../models/user";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../../index";
import client from "../../../database/database";
import dashboardRoutes from "../../../handlers/services/dashboard";
import { OrderStore } from "../../../models/order";
import { users, products } from "../../../data/data";

dotenv.config();

const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
const req = supertest(app);

describe("dashboard handlers", () => {
    beforeAll(async () => {
        try {
            dashboardRoutes(app);
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

    // app.post("/users/:userid/orders/:orderid", isAutherized, addProductToOrder);
    it("should get 200 ok from POST /users/:userid/orders/:orderid", async () => {
        const { token } = (
            await req
                .post("/users")
                .set("content-type", "application/json")
                .send(JSON.stringify(users[1]))
        ).body;
        const res = await req
            .post("/users/1/orders/1")
            .set("content-type", "application/json")
            .send({ productid: 2 })
            .set(
                "Cookie",
                //jwt for 'ke7el2` + 'THISISSECRET'
                // `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
                `jwt=${token}`
            );
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: {
                id: 2,
                orderid: 1,
                productid: 2,
                quantity: 1
            }
        });
    });

    it("should get 400 ERROR from POST /users/:userid/orders/:orderid", async () => {
        const { token } = (
            await req
                .post("/users")
                .set("content-type", "application/json")
                .send(JSON.stringify(users[1]))
        ).body;
        const res = await req
            .post("/users/1/orders/1")
            .set("content-type", "application/json")
            .send({ productid: 2 })
            .set(
                "Cookie",
                //jwt for 'ke7el2` + 'THISISSECRET'
                // `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
                `jwt=${token}HAHAHAH`
            );
        expect(res.status).toEqual(401);
    });

    it("should get 400 ERROR from POST /users/:userid/orders/:orderid", async () => {
        const { token } = (
            await req
                .post("/users")
                .set("content-type", "application/json")
                .send(JSON.stringify(users[1]))
        ).body;
        const res = await req
            .post("/users/1/orders/1")
            .set("content-type", "application/json")
            .send({ productid: -5 })
            .set(
                "Cookie",
                //jwt for 'ke7el2` + 'THISISSECRET'
                // `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
                `jwt=${token}`
            );
        expect(res.status).toEqual(400);
    });

    it("should get 200 ok from GET /users/:userid/orders/:orderid", async () => {
        const { token } = (
            await req
                .post("/users")
                .set("content-type", "application/json")
                .send(JSON.stringify(users[1]))
        ).body;
        const res = await req
            .get("/users/1/orders/1")
            .set("content-type", "application/json")
            .set(
                "Cookie",
                //jwt for 'ke7el2` + 'THISISSECRET'
                // `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
                `jwt=${token}`
            );
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: [
                {
                    orderid: 1,
                    name: "samsung"
                },
                { orderid: 1, name: "iphone" }
            ]
        });
    });
});
