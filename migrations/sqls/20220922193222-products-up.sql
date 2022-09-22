/* Create Products Schema */
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    price INT NOT NULL,
    category VARCHAR(32)
);
