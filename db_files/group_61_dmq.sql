-------------------------------------------------------------------------------
-- Isaac: orders and products


-------------------------------------------------------------------------------
-- orders page

SELECT *
  FROM orders;

SELECT *
  FROM orders
  ORDER BY purchase_date;

SELECT *
  FROM orders
  WHERE total_price > 100000;
  ORDER BY total_price;

INSERT INTO orders (`customer_id`, `branch_id`, `total_price`, `purchase_date`) VALUES
 (:customerIdInput, :branchIdInput, :priceInput, :dateInput);

UPDATE orders
SET total_price=:priceInput
WHERE id=:idInput;

DELETE FROM orders
WHERE id=:idInput;


-------------------------------------------------------------------------------
-- products page

SELECT *
  FROM products;

SELECT *
  FROM products
  ORDER BY price;

SELECT *
  FROM orders
  WHERE price > 50000;
  ORDER BY price;

INSERT INTO products (`name`, `branch_id`, `price`) VALUES
 (:nameInput, :branchIdInput, :priceInput);

UPDATE products
SET price=:priceInput
WHERE id=:idInput;

DELETE FROM products
WHERE id=:idInput;

-------------------------------------------------------------------------------
-- products_orders

SELECT * FROM products_orders;

-- Adding a relationship
INSERT INTO products_orders (`product_id`, `order_id`) VALUES
(:productIdInput, :orderIdInput);

-- Removing a relationship
DELETE FROM `products_orders` WHERE product_id=:productIdInput AND order_id=:orderIdInput;

-------------------------------------------------------------------------------
-- droids page
SELECT *
    FROM droids;

INSERT INTO `droids` (`type`) VALUES
    (:typeInput);



-----------------------------------------------
-- Dylan: Branches and Customers

-----------------------------------------------
-- Branches page

SELECT *
  FROM branches;

-- Sort by total sales
SELECT *
  FROM branches
  ORDER BY total_sales DESC;

-- Sort by location
SELECT *
  FROM branches
  ORDER BY name DESC;

-- Update a branch
UPDATE branches
   SET `name`=:nameInput, `total_sales`=:totSalesInput
 WHERE id=:idInput;

-- Insert new branch
INSERT INTO branches (`name`, `total_sales`) VALUES
(:nameInput, 0);

-- Deleting a branch
DELETE FROM `troopers` WHERE id=:idInput;

-----------------------------------------------
-- Customers page

SELECT customers.name, customers.email, customers.address, customers.city, customers.state, customers.zip_code, customers.age, SUM(orders.total_price) AS total_spent
    FROM customers
    LEFT JOIN orders
    ON orders.customer_id = customers.id
    GROUP BY customers.id

-- Sort by amount sp
SELECT customers.name, customers.email, customers.address, customers.city, customers.state, customers.zip_code, customers.age, SUM(orders.total_price) AS total_spent
    FROM customers
    LEFT JOIN orders
    ON orders.customer_id = customers.id
    GROUP BY customers.id
    ORDER BY total_spent DESC

-- Sort by state
SELECT customers.name, customers.email, customers.address, customers.city, customers.state, customers.zip_code, customers.age, SUM(orders.total_price) AS total_spent
    FROM customers
    LEFT JOIN orders
    ON orders.customer_id = customers.id
    GROUP BY customers.id
    ORDER BY customers.state DESC

-- Update a branch
UPDATE customers
   SET `name`=:nameInput, `email`=:emailInput, `address`=:addressInput, `city`=:cityInput, `state`=:stateInput, `zip_code`=:zipInput, `age`=:ageInput
 WHERE id=:idInput;

-- Insert new branch
INSERT INTO customers (`name`, `email`, `address`, `city`, `state`, `zip_code`, `age`) VALUES
(:nameInput, :emailInput, :addressInput, :cityInput, :stateInput, :zipInput, :ageInput);

-- Deleting a branch
DELETE FROM customers WHERE id=:idInput;


--------------------------------------------------

-- branch_customer
SELECT * FROM branch_customer;

-- Adding a trooper to a ship
INSERT INTO `branch_customer` (`branch_id`, `customer_id`) VALUES
(:branchIdInput, :customerIdInput);

-- Removing a trooper from a ship
DELETE FROM `branch_customer` WHERE branch_id=:branchIdInput AND customer_id=:customerIdInput;
