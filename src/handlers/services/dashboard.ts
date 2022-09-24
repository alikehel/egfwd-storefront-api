import { DashboardStore } from "../../models/services/dashboard";
import { OrderStore } from "../../models/order";
import { isAutherized } from "../../middlewares/isAutherized";
const dashboardStore = new DashboardStore();
const orderStore = new OrderStore();
import express, { Request, Response } from "express";

const getUserOrderProducts = async (req: Request, res: Response) => {
    const { orderid } = req.params;
    try {
        const result = await dashboardStore.getUserOrderProducts(
            // parseInt(userid),
            parseInt(orderid)
        );
        res.json({ result: result });
    } catch (err) {
        res.status(400).json({
            err: err
        });
    }
};

const addProductToOrder = async (req: Request, res: Response) => {
    const { userid, orderid } = req.params;
    try {
        const isOrderExist = await orderStore.getOrder(parseInt(orderid));

        if (isOrderExist == undefined) {
            orderStore.create(parseInt(userid));
        }
    } catch (err) {
        res.json({ err });
    }
    try {
        const result = await dashboardStore.addProductToOrder(
            parseInt(orderid),
            req.body.productid
        );
        res.json({ result: result });
    } catch (err) {
        res.status(400).json({
            err: err
        });
    }
};

const dashboardRoutes = (app: express.Application) => {
    // app.get("/orders", index);
    // app.get("/orders/:orderid", getOrder);
    app.get(
        "/users/:userid/orders/:orderid",
        isAutherized,
        getUserOrderProducts
    );
    app.post("/users/:userid/orders/:orderid", isAutherized, addProductToOrder);
};

export default dashboardRoutes;
