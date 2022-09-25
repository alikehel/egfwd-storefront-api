# Requirements

## API Endpoints

### Products

Action | HTTP Verb | HTTP Endpoint | Request Body
-------|-----------|---------------|--------------------------------------------------------------------------
Index  | GET       | /products     |
Show   | GET       | /products/:id |
Create | POST      | /products     | {"name": productname, "price": productprice, "category": productcategory}

### Users

Action       | HTTP Verb | HTTP Endpoint    | Request Body
-------------|-----------|------------------|-----------------------------------------------------------------------------------------
Index        | GET       | /users           |
Show         | GET       | /users/:username |
Create       | POST      | /users           | {"username":username, "password":password , "firstname":firstname , "lastname":lastname}
Authenticate | POST      | /users/auth      | {"username":username, "password":password}
Sign Out     | GET       | /signout         |

### Orders

Action                     | HTTP Verb | HTTP Endpoint                  | Request Body
---------------------------|-----------|--------------------------------|------------------------
Current Order by user      | GET       | /users/:userid/orders/:orderid |
Add a product to the order | POST      | /users/:userid/orders/:orderid | {"productid":productid}
Show all orders            | GET       | /orders                        |
Create order               | POST      | users/:userid/orders           |
Get specific order         | GET       | /orders/:orderid               |

## Database Schema - ERD

```mermaid
erDiagram
 USER  ||--o{  ORDER  : makes
 USER {
 int id PK
 string username
 string password
 string first_name
 string last_name
 }
 ORDER  |o--|{  ORDERS_PRODUCTS  : ""
 ORDER  {
 int id PK
 int user_id FK
 string status
 }
 PRODUCT ||--|{  ORDERS_PRODUCTS : ""
 PRODUCT {
 int id PK
 string name
 float price
 string category
 }
 ORDERS_PRODUCTS  {
 int id PK
 int order_id FK
 int product_id FK
 int quantity
 }
 ```
