export const userQueries = {
    showUsers: "SELECT * FROM users",
    createUser:
        "INSERT INTO users (username,password,firstname,lastname) VALUES ($1,$2,$3,$4) RETURNING *",
    authenticateUser: "SELECT password FROM users WHERE username=$1",
    showUser: "SELECT * FROM users WHERE username=$1"
};

export const productQueries = {
    createProduct:
        "INSERT INTO products (name,price,category) VALUES ($1,$2,$3) RETURNING *",
    showProduct: "SELECT * FROM products WHERE id=$1",
    showProducts: "SELECT * FROM products"
};

export const orderQueries = {
    showOrders: "SELECT * FROM orders",
    createOrder:
        "INSERT INTO orders (userid,status) VALUES ($1,$2) RETURNING *",
    showOrder: "SELECT * FROM orders WHERE id = $1"
};

export const dashboardQueries = {
    getUserProducts: `
                SELECT orderid, name
                FROM products
                INNER JOIN orders_products
                on (products.id = orders_products.productid)
                WHERE orderid = $1;
            `,
    addProductToOrder:
        "INSERT INTO orders_products (orderid, productid, quantity) VALUES ($1, $2, $3) RETURNING *"
};
