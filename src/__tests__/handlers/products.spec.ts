import productsRoutes from "../../handlers/products";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../index";
import client from "../../database/database";
import { users, products } from "../../data/data";

dotenv.config();

const req = supertest(app);

describe("product handlers", () => {
    beforeAll(async () => {
        try {
            productsRoutes(app);
            const conn = await client.connect();
            const sql =
                "INSERT INTO products (name,price,category) VALUES ($1,$2,$3)";
            await conn.query(sql, [
                products[0].name,
                products[0].price,
                products[0].category
            ]);
            conn.release();
        } catch (err) {
            throw new Error(`cannot create product. ${err}`);
        }
    });

    afterAll(async () => {
        try {
            const conn = await client.connect();
            const sql = "TRUNCATE TABLE products RESTART IDENTITY CASCADE";
            await conn.query(sql);
            conn.release();
        } catch (err) {
            throw new Error(`cannot TRUNCATE products table. ${err}`);
        }
    });

    // app.get("/products", index);
    it("should get 200 ok from GET /products", async () => {
        const res = await req.get("/products");
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: [
                {
                    id: 1,
                    ...products[0]
                }
            ]
        });
    });

    // app.post("/products", isAutherized, create);
    it("should get 200 ok from POST /products", async () => {
        const { token } = (
            await req
                .post("/users")
                .set("content-type", "application/json")
                .send(JSON.stringify(users[1]))
        ).body;
        const res = await req
            .post("/products")
            .set("content-type", "application/json")
            .send(JSON.stringify(products[1]))
            .set(
                "Cookie", //jwt for 'ke7el2` + 'THISISSECRET'
                // `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
                `jwt=${token}`
            );
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: {
                id: 2,
                ...products[1]
            }
        });
    });

    it("should get 400 ERROR from POST /products", async () => {
        const { token } = (
            await req
                .post("/users")
                .set("content-type", "application/json")
                .send(JSON.stringify(users[1]))
        ).body;
        const res = await req
            .post("/products")
            .set("content-type", "application/json")
            .send(JSON.stringify(products[1]))
            .set(
                "Cookie", //jwt for 'ke7el2` + 'THISISSECRET'
                // `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
                `jwt=${token}HAHAHAHAHHAAHHAHA`
            );
        expect(res.status).toEqual(401);
    });

    it("should get 400 ERROR from POST /products", async () => {
        const { token } = (
            await req
                .post("/users")
                .set("content-type", "application/json")
                .send(JSON.stringify(users[1]))
        ).body;
        const res = await req
            .post("/products")
            .set("content-type", "application/json")
            .send(JSON.stringify(users[1]))
            .set(
                "Cookie", //jwt for 'ke7el2` + 'THISISSECRET'
                // `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
                `jwt=${token}`
            );
        expect(res.status).toEqual(400);
    });

    // app.get("/products/:id", showProduct);
    it("should get 200 ok from GET /products/:id", async () => {
        const res = await req.get("/products/2");
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: {
                id: 2,
                ...products[1]
            }
        });
    });
});
