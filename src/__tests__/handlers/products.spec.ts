import express, { Request, Response } from "express";
import { ProductStore } from "../../models/product";
import productsRoutes from "../../handlers/products";
import { UserStore } from "../../models/user";
import usersRoutes from "../../handlers/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../index";
import client from "../../database/database";
import { User } from "../../types/User";
import { Product } from "../../types/Product";
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
        // await req
        //     .post("/users")
        //     .set("content-type", "application/json")
        //     .send(JSON.stringify(users[0]));
        const res = await req
            .post("/products")
            .set("content-type", "application/json")
            .send(JSON.stringify(products[1]))
            .set(
                "Cookie",
                //jwt for 'ke7el2` + 'THISISSECRET'
                `jwt=eyJhbGciOiJIUzI1NiJ9.a2U3ZWwy.J32h2wSshKWYyc5KB4l-fAtT_OFSPPtHsyZg69IcjrY`
            );
        // const { password } = res.body.result;
        // const isPasswordTrue = bcrypt.compareSync(
        //     users[1].password + (SECRET as string),
        //     password
        // );
        // const isPasswordTrue = true;
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: {
                id: 2,
                ...products[1]
            }
        });
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
