# API Endpoints

## Products

Action | HTTP Verb | HTTP Endpoint
-------|-----------|--------------
Index  | GET       | /products
Show   | GET       | /products/:id
Create | POST      | /products

## Users

Action       | HTTP Verb | HTTP Endpoint
-------------|-----------|-----------------
Index        | GET       | /users
Show         | GET       | /users/:username
Create       | POST      | /users
Authenticate | POST      | /users/auth
Sign Out     | GET       | /signout

## Orders

Action                | HTTP Verb | HTTP Endpoint
----------------------|-----------|-------------------------------
Current Order by user | POST      | /users/:userid/orders/:orderid
Show all orders       | GET       | /orders
Get specific order    | GET       | /orders/:orderid
