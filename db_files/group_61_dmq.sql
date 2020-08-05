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




-----------------------------------------------
-- Dylan: Branches and Customers

-----------------------------------------------
-- Branches page

SELECT branches.id, branches.name, COALESCE(SUM(orders.total_price), 0) AS tot_sales, COUNT(products.id) AS tot_products, COUNT(orders.id) AS tot_orders, COUNT(customers.id) AS tot_customers
    FROM branches 
    LEFT JOIN orders
    ON orders.branch_id = branches.id
    
    LEFT JOIN branch_customer
    ON branches.id = branch_customer.branch_id
    LEFT JOIN customers
    ON branch_customer.customer_id = customers.id
    LEFT JOIN products
    ON products.branch_id = branches.id
    GROUP BY branches.id

-- Sort by total sales
SELECT branches.id, branches.name, COALESCE(SUM(orders.total_price), 0) AS tot_sales, COUNT(products.id) AS tot_products, COUNT(orders.id) AS tot_orders, COUNT(customers.id) AS tot_customers
    FROM branches 
    LEFT JOIN orders
    ON orders.branch_id = branches.id
    
    LEFT JOIN branch_customer
    ON branches.id = branch_customer.branch_id
    LEFT JOIN customers
    ON branch_customer.customer_id = customers.id
    LEFT JOIN products
    ON products.branch_id = branches.id
    GROUP BY branches.id
    ORDER BY tot_sales DESC
-- Sort by location
SELECT branches.id, branches.name, COALESCE(SUM(orders.total_price), 0) AS tot_sales, COUNT(products.id) AS tot_products, COUNT(orders.id) AS tot_orders, COUNT(customers.id) AS tot_customers
    FROM branches 
    LEFT JOIN orders
    ON orders.branch_id = branches.id
    
    LEFT JOIN branch_customer
    ON branches.id = branch_customer.branch_id
    LEFT JOIN customers
    ON branch_customer.customer_id = customers.id
    LEFT JOIN products
    ON products.branch_id = branches.id
    GROUP BY branches.id
    ORDER BY branches.name ASC

-- Update a branch
UPDATE branches SET name=? WHERE id=?

-- Insert new branch
INSERT INTO branches (name) VALUES (?)

-- Deleting a branch
DELETE FROM branches WHERE id = ?

-----------------------------------------------
-- Customers page

SELECT customers.id, customers.name, customers.email, customers.city, customers.state, customers.age
    FROM customers


-- Sort by state
SELECT id, name, email, address, city, state, zip_code, age 
        FROM customers
        ORDER BY state ASC

-- Update customers
UPDATE customers SET name=?, email=?, address=?, city=?, state=?, zip_code=?, age=? WHERE id=?

-- Insert new customer
INSERT INTO customers (name, email, city, state, zip_code, age) VALUES (?,?,?,?,?,?)

-- Deleting a customer
DELETE FROM customers WHERE id=:idInput;


--------------------------------------------------

-- branch_customer
SELECT * FROM branch_customer;

-- 
INSERT INTO `branch_customer` (`branch_id`, `customer_id`) VALUES
(:branchIdInput, :customerIdInput);

--
DELETE FROM `branch_customer` WHERE branch_id=:branchIdInput AND customer_id=:customerIdInput;
