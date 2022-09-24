import client from "../../database/database";
import dotenv from "dotenv";

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
            const sql = `
                SELECT orderid, name
                FROM products
                INNER JOIN orders_products
                on (products.id = orders_products.productid)
                WHERE orderid = $1;
            `;
            const result = await conn.query(sql, [orderid]);
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
            const sql =
                "INSERT INTO orders_products (orderid, productid, quantity) VALUES ($1, $2, $3) RETURNING *";
            const result = await conn.query(sql, [orderid, productid, 1]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot add product to order. ${err}`);
        }
    }
}
