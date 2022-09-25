import client from "../database/database";
import dotenv from "dotenv";
import { Product } from "../types/Product";
import { productQueries } from "../database/queries";

dotenv.config();

//CRUD
export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const result = await conn.query(productQueries.showProducts);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`cannot get products. ${err}`);
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const conn = await client.connect();
            const result = await conn.query(productQueries.createProduct, [
                product.name,
                product.price,
                product.category
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot create product. ${err}`);
        }
    }

    async showProduct(id: number): Promise<Product> {
        try {
            const con = await client.connect();
            const result = await con.query(productQueries.showProduct, [id]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot get the product. ${err}`);
        }
    }
}
