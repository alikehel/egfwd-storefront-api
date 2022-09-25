import client from "../../database/database";
import dotenv from "dotenv";
import { dashboardQueries } from "../../database/queries";

dotenv.config();

//CRUD
export class DashboardStore {
    // get 'users/:id/orders/:id'
    async getUserOrderProducts(
        // userid: number,
        orderid: number
    ): Promise<{ orderid: number; name: string }[]> {
        try {
            const conn = await client.connect();
            const result = await conn.query(dashboardQueries.getUserProducts, [
                orderid
            ]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`cannot get user current order. ${err}`);
        }
    }

    // post 'users/:id/orders/:id/'
    async addProductToOrder(
        // userid: number,
        orderid: number,
        productid: number
    ): Promise<{
        id?: number;
        orderid: number;
        productid: number;
        quantity: number;
    }> {
        try {
            const conn = await client.connect();
            const result = await conn.query(
                dashboardQueries.addProductToOrder,
                [orderid, productid, 1]
            );
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot add product to order. ${err}`);
        }
    }
}
