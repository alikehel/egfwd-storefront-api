import express, { Request, Response } from "express";
import { UserStore } from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const userStore = new UserStore();

dotenv.config();

const SECRET = process.env.SECRET;

const index = async (_req: Request, res: Response) => {
    try {
        const result = await userStore.index();
        res.json({ result: result });
    } catch (err) {
        // console.log("🚀 ~ file: users.ts ~ line 17 ~ index ~ err", err);
        res.status(400);
        res.json({ err });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const result = await userStore.create(user);
        const token = jwt.sign(user.username, SECRET as string);
        res.cookie("jwt", token);
        // res.setHeader("Authorization", `Bearer ${token}`);
        // console.log(user);
        res.json({ result: result, token: token });
    } catch (err) {
        // console.log("🚀 ~ file: users.ts ~ line 31 ~ create ~ err", err);
        res.status(400);
        res.json({ err });
    }
};

const authenticate = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const result = await userStore.authenticate(user);
        const token = jwt.sign(user.username, SECRET as string);
        res.cookie("jwt", token);
        // res.setHeader("Authorization", `Bearer ${token}`);
        // console.log(user);
        res.json({ result, token });
    } catch (err) {
        // console.log("🚀 ~ file: users.ts ~ line 45 ~ authenticate ~ err", err);
        res.status(400);
        res.json({ err });
    }
};

const showUser = async (req: Request, res: Response) => {
    try {
        const username = req.params.username;
        const result = await userStore.showUser(username);
        // console.log(user);
        res.json({ result });
    } catch (err) {
        // console.log("🚀 ~ file: users.ts ~ line 59 ~ showUser ~ err", err);
        res.status(400);
        res.json({ err });
    }
};

const signout = (req: Request, res: Response) => {
    try {
        if (req.cookies.jwt) {
            res.clearCookie("jwt").status(302).redirect("/");
        } else {
            res.status(302).redirect("/");
        }
    } catch (err) {
        res.status(400).json({ err });
        // console.log(`error signing out. ${err}`);
    }
};

const usersRoutes = (app: express.Application) => {
    app.get("/users", index);
    app.post("/users", create);
    app.post("/users/auth", authenticate);
    app.get("/users/:username", showUser);
    app.get("/signout", signout);
};

export default usersRoutes;
