import express, { Request, Response } from "express";
import { ProductStore } from "../../models/product";
import productsRoutes from "../../handlers/products";
import { UserStore } from "../../models/user";
import usersRoutes from "../../handlers/users";
import ordersRoutes from "../../handlers/orders";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../index";
import client from "../../database/database";
import { User } from "../../types/User";
import { Product } from "../../types/Product";
import { Order } from "../../types/Order";
import bcrypt from "bcrypt";

dotenv.config();

const userStore = new UserStore();
const productStore = new ProductStore();
const SECRET = process.env.SECRET;
const req = supertest(app);

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
        // await req
        //     .post("/users")
        //     .set("content-type", "application/json")
        //     .send(JSON.stringify(users[0]));
        const res = await req.post("/users/1/orders").set(
            "Cookie",
            //jwt for 'ke7el2` + 'THISISSECRET'
            `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
        );
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: {
                id: 2,
                ...orders[0]
            }
        });
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
