import usersRoutes from "../../handlers/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../index";
import client from "../../database/database";
import { products, users } from "../../data/data";
import { SECRET } from "../../config/config";
import bcrypt from "bcrypt";

dotenv.config();

const req = supertest(app);

describe("user handlers", () => {
    beforeAll(async () => {
        usersRoutes(app);
        try {
            const conn = await client.connect();
            const sql =
                "INSERT INTO users (username,password,firstname,lastname) VALUES ($1,$2,$3,$4)";
            await conn.query(sql, [
                users[0].username,
                users[0].password,
                users[0].firstname,
                users[0].lastname
            ]);
            conn.release();
        } catch (err) {
            throw new Error(`cannot create user. ${err}`);
        }
    });

    afterAll(async () => {
        try {
            const conn = await client.connect();
            const sql = "TRUNCATE TABLE users RESTART IDENTITY CASCADE";
            await conn.query(sql);
            conn.release();
        } catch (err) {
            throw new Error(`cannot TRUNCATE users table. ${err}`);
        }
    });

    // app.get("/users", index);
    it("should get 200 ok from GET /users", async () => {
        const res = await req.get("/users");
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: [
                {
                    id: 1,
                    username: "ke7el1username",
                    password: "ke7el1pass",
                    firstname: "ali1",
                    lastname: "kehel1"
                }
            ]
        });
    });

    // app.post("/users", create);
    it("should get 200 ok from POST /users", async () => {
        const res = await req
            .post("/users")
            .set("content-type", "application/json")
            .send(JSON.stringify(users[1]));
        const { password } = res.body.result;
        const isPasswordTrue = bcrypt.compareSync(
            users[1].password + (SECRET as string),
            password
        );
        // const isPasswordTrue = true;
        expect(res.status).toEqual(200);
        expect({
            result: { ...res.body.result, password: isPasswordTrue },
            token: res.body.token
        }).toEqual({
            result: {
                id: 2,
                ...users[1],
                password: true
            },
            token: jwt.sign(users[1].username, SECRET as string)
        });
    });

    it("should get 400 ERROR from POST /users", async () => {
        const res = await req
            .post("/users")
            .set("content-type", "application/json")
            .send(JSON.stringify(products[1]));
        // const isPasswordTrue = true;
        expect(res.status).toEqual(400);
    });

    // app.post("/users/auth", authenticate);
    it("should get 200 ok from POST /users/auth", async () => {
        const res = await req
            .post("/users/auth")
            .set("content-type", "application/json")
            .send(JSON.stringify(users[1]));
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: true,
            token: jwt.sign(users[1].username, SECRET as string)
        });
    });

    it("should get 400 ERROR from POST /users/auth", async () => {
        const res = await req
            .post("/users/auth")
            .set("content-type", "application/json")
            .send(JSON.stringify(products[1]));
        expect(res.status).toEqual(400);
    });

    it("should get 400 ERROR from POST /users/auth", async () => {
        const res = await req
            .post("/users/auth")
            .set("content-type", "application/json")
            .send(JSON.stringify(users[2]));
        expect(res.status).toEqual(400);
    });

    // app.get("/users/:username", showUser);
    it("should get 200 ok from GET /users/:username", async () => {
        const res = await req.get("/users/ke7el1username");
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            result: {
                id: 1,
                username: "ke7el1username",
                password: "ke7el1pass",
                firstname: "ali1",
                lastname: "kehel1"
            }
        });
    });

    // app.get("/signout", signout);
    it("should get 302 redirect from GET /signout", async () => {
        const res = await req.get("/signout");
        expect(res.status).toEqual(302);
    });
});
