# API Endpoints

## Products

Action | HTTP Verb | HTTP Endpoint | Request Body
-------|-----------|---------------|--------------------------------------------------------------------------
Index  | GET       | /products     |
Show   | GET       | /products/:id |
Create | POST      | /products     | {"name": productname, "price": productprice, "category": productcategory}

## Users

Action       | HTTP Verb | HTTP Endpoint    | Request Body
-------------|-----------|------------------|-----------------------------------------------------------------------------------------
Index        | GET       | /users           |
Show         | GET       | /users/:username |
Create       | POST      | /users           | {"username":username, "password":password , "firstname":firstname , "lastname":lastname}
Authenticate | POST      | /users/auth      | {"username":username, "password":password}
Sign Out     | GET       | /signout         |

## Orders

Action                     | HTTP Verb | HTTP Endpoint                  | Request Body
---------------------------|-----------|--------------------------------|------------------------
Current Order by user      | GET       | /users/:userid/orders/:orderid |
Add a product to the order | POST      | /users/:userid/orders/:orderid | {"productid":productid}
Show all orders            | GET       | /orders                        |
Create order               | POST      | users/:userid/orders           |
Get specific order         | GET       | /orders/:orderid               |
