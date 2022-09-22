/* Create Users Schema */
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(16) NOT NULL,
    lastname VARCHAR(16) NOT NULL
);
