/* Create Orders Schema */
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    userid INT REFERENCES users(id) NOT NULL,
    status VARCHAR(16) NOT NULL
);
