import express, { Request, Response } from "express";
import { ProductStore } from "../models/product";
import dotenv from "dotenv";
import { isAutherized } from "../middlewares/isAutherized";

const productStore = new ProductStore();

dotenv.config();

const index = async (_req: Request, res: Response) => {
    try {
        const result = await productStore.index();
        res.json({ result: result });
    } catch (err) {
        // console.log("🚀 ~ file: users.ts ~ line 17 ~ index ~ err", err);
        res.status(400);
        res.json({ err });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const product = req.body;
        const result = await productStore.create(product);
        res.json({ result: result });
    } catch (err) {
        // console.log("🚀 ~ file: users.ts ~ line 31 ~ create ~ err", err);
        res.status(400);
        res.json({ err });
    }
};

const showProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await productStore.showProduct(id);
        // console.log(user);
        res.json({ result });
    } catch (err) {
        // console.log("🚀 ~ file: users.ts ~ line 59 ~ showUser ~ err", err);
        res.status(400);
        res.json({ err });
    }
};

const productsRoutes = (app: express.Application) => {
    app.get("/products", index);
    app.post("/products", isAutherized, create);
    app.get("/products/:id", showProduct);
};

export default productsRoutes;
