import client from "../database/database";
import dotenv from "dotenv";
import { Product } from "../types/Product";

dotenv.config();

//CRUD
export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM products";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`cannot get products. ${err}`);
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql =
                "INSERT INTO products (name,price,category) VALUES ($1,$2,$3) RETURNING *";
            const result = await conn.query(sql, [
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
            const sql = "SELECT * FROM products WHERE id=$1";
            const result = await con.query(sql, [id]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`cannot get the product. ${err}`);
        }
    }
}
