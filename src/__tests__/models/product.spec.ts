import client from "../../database/database";
import dotenv from "dotenv";
import { Product } from "../../types/Product";
import { ProductStore } from "../../models/product";

dotenv.config();

const productStore = new ProductStore();

const products: Product[] = [
    {
        name: "samsung",
        price: 5000,
        category: "phones"
    },
    {
        name: "iphone",
        price: 15000,
        category: "phones"
    },
    {
        name: "acer",
        price: 30000,
        category: "laptops"
    }
];

describe("product model", () => {
    beforeAll(async () => {
        try {
            const conn = await client.connect();
            const sql =
                "INSERT INTO products (name,price,category) VALUES ($1,$2,$3)";
            await conn.query(sql, [
                products[0].name,
                products[0].price,
                products[0].category
            ]);
            conn.release();
        } catch (err) {
            throw new Error(`cannot create product. ${err}`);
        }
    });

    afterAll(async () => {
        try {
            const conn = await client.connect();
            const sql = "TRUNCATE TABLE products RESTART IDENTITY CASCADE";
            await conn.query(sql);
            conn.release();
        } catch (err) {
            throw new Error(`cannot TRUNCATE products table. ${err}`);
        }
    });

    it("should get all products", async () => {
        expect(await productStore.index()).toEqual([
            {
                id: 1,
                ...products[0]
            }
        ]);
    });

    it("should create new product", async () => {
        const result = await productStore.create(products[1]);
        expect(result).toEqual({ id: 2, ...products[1] });
    });

    it("should show one product", async () => {
        const result = await productStore.showProduct(2);
        expect(result).toEqual({ id: 2, ...products[1] });
    });

    it("should NOT show one product", async () => {
        expect(await productStore.showProduct(-5)).toEqual(
            undefined as unknown as Product
        );
    });
});
