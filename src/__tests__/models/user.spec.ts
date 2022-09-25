import client from "../../database/database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../../types/User";
import { UserStore } from "../../models/user";
import { users } from "../../data/data";
import { SECRET } from "../../config/config";

dotenv.config();

const userStore = new UserStore();

describe("user model", () => {
    beforeAll(async () => {
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

    it("should get all users", async () => {
        expect(await userStore.index()).toEqual([
            {
                id: 1,
                ...users[0]
            }
        ]);
    });

    it("should create new user", async () => {
        const { id, username, firstname, lastname, password } =
            await userStore.create(users[1]);

        const isPasswordTrue = bcrypt.compareSync(
            users[1].password + (SECRET as string),
            password
        );

        expect({
            id,
            username,
            firstname,
            lastname,
            password: isPasswordTrue
        }).toEqual({
            id: 2,
            ...users[1],
            password: true
        });
    });

    it("should authenticate user", async () => {
        expect(await userStore.authenticate(users[1])).toEqual(true);
    });

    it("should NOT authenticate user", async () => {
        expect(
            await userStore.authenticate({
                ...users[1],
                password: "notke7el2pass"
            })
        ).toEqual(false);
    });

    it("should show one user", async () => {
        const { id, username, firstname, lastname, password } =
            await userStore.showUser(users[1].username);

        const isPasswordTrue = bcrypt.compareSync(
            users[1].password + (SECRET as string),
            password
        );

        expect({
            id,
            username,
            firstname,
            lastname,
            password: isPasswordTrue
        }).toEqual({
            id: 2,
            ...users[1],
            password: true
        });
    });

    it("should NOT show one user", async () => {
        expect(await userStore.showUser("notke7el2username")).toEqual(
            undefined as unknown as User
        );
    });
});
