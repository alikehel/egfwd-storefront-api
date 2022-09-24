import express, { Request, Response } from "express";
import { ProductStore } from "../../../models/product";
import productsRoutes from "../../../handlers/products";
import { UserStore } from "../../../models/user";
import usersRoutes from "../../../handlers/users";
import ordersRoutes from "../../../handlers/orders";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../../index";
import client from "../../../database/database";
import { User } from "../../../types/User";
import { Product } from "../../../types/Product";
import { Order } from "../../../types/Order";
import bcrypt from "bcrypt";
import { DashboardStore } from "../../../models/services/dashboard";
import dashboardRoutes from "../../../handlers/services/dashboard";
import { OrderStore } from "../../../models/order";

dotenv.config();

const userStore = new UserStore();
const productStore = new ProductStore();
const dashboardStore = new DashboardStore();
const orderStore = new OrderStore();
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
        const res = await req
            .post("/users/1/orders/1")
            .set("content-type", "application/json")
            .send({ productid: 2 })
            .set(
                "Cookie",
                //jwt for 'ke7el2` + 'THISISSECRET'
                `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
            );
        // const res = await req.post("/users/1/orders").set(
        //     "Cookie",
        //     //jwt for 'ke7el2` + 'THISISSECRET'
        //     `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
        // );
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

    // app.get(
    //     "/users/:userid/orders/:orderid",
    //     isAutherized,
    //     getUserOrderProducts
    // );
    it("should get 200 ok from GET /users/:userid/orders/:orderid", async () => {
        const res = await req
            .get("/users/1/orders/1")
            .set("content-type", "application/json")
            .set(
                "Cookie",
                //jwt for 'ke7el2` + 'THISISSECRET'
                `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
            );
        // const res = await req.post("/users/1/orders").set(
        //     "Cookie",
        //     //jwt for 'ke7el2` + 'THISISSECRET'
        //     `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
        // );
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
