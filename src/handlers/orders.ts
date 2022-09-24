import { OrderStore } from "../models/order";
import { isAutherized } from "../middlewares/isAutherized";
const orderStore = new OrderStore();
import express, { Request, Response } from "express";

const index = async (_req: Request, res: Response) => {
    try {
        const result = await orderStore.index();
        res.json({ result: result });
    } catch (err) {
        res.status(400).json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const { userid } = req.params;
    try {
        const result = await orderStore.create(parseInt(userid));
        res.json({ result: result });
    } catch (err) {
        res.status(400).json({
            err: err
        });
    }
};

const getOrder = async (req: Request, res: Response) => {
    try {
        const { orderid } = req.params;
        const result = await orderStore.getOrder(parseInt(orderid));
        res.json({ result: result });
    } catch (err) {
        res.status(400).json(err);
    }
};
const ordersRoutes = (app: express.Application) => {
    app.get("/orders", index);
    app.post("/users/:userid/orders", isAutherized, create);
    app.get("/orders/:orderid", getOrder);
};

export default ordersRoutes;
