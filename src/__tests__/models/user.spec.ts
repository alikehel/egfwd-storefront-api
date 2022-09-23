import client from "../../database/database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../../types/User";
import { UserStore } from "../../models/user";

dotenv.config();

const SECRET = process.env.SECRET;
const userStore = new UserStore();

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
