import { Product } from "../types/Product";
import { User } from "../types/User";
import { Order } from "../types/Order";

export const users: User[] = [
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
export const products: Product[] = [
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

export const orders: Order[] = [
    {
        userid: 1,
        status: "active"
    },
    {
        userid: 2,
        status: "active"
    },
    {
        userid: 3,
        status: "active"
    }
];
