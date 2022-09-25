import { UserStore } from "../../models/user";
import ordersRoutes from "../../handlers/orders";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../index";
import client from "../../database/database";
import { users, orders } from "../../data/data";

dotenv.config();

const userStore = new UserStore();
const req = supertest(app);

describe("orders handlers", () => {
    beforeAll(async () => {
        try {
            ordersRoutes(app);
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

    // app.get("/orders", index);
    it("should get 200 ok from GET /orders", async () => {
        const res = await req.get("/orders");
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: [
                {
                    id: 1,
                    ...orders[0]
                }
            ]
        });
    });

    // app.post("/orders", isAutherized, create);
    it("should get 200 ok from POST /users/:userid/orders", async () => {
        const { token } = (
            await req
                .post("/users")
                .set("content-type", "application/json")
                .send(JSON.stringify(users[1]))
        ).body;
        const res = await req.post("/users/1/orders").set(
            "Cookie",
            //jwt for 'ke7el2` + 'THISISSECRET'
            // `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
            `jwt=${token}`
        );
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: {
                id: 2,
                ...orders[0]
            }
        });
    });

    it("should get 400 ERROR from POST /users/:userid/orders", async () => {
        const { token } = (
            await req
                .post("/users")
                .set("content-type", "application/json")
                .send(JSON.stringify(users[1]))
        ).body;
        const res = await req.post("/users/1/orders").set(
            "Cookie",
            //jwt for 'ke7el2` + 'THISISSECRET'
            // `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
            `jwt=${token}HAHAHAHA`
        );
        expect(res.status).toEqual(401);
    });

    // app.get("/orders/:orderid", showOrder);
    it("should get 200 ok from GET /orders/:id", async () => {
        const res = await req.get("/orders/2");
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: {
                id: 2,
                ...orders[0]
            }
        });
    });
});
