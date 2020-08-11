-- -----------------------------------------------------------------------------
-- ***** Create Tables *****

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS product_order;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS branch_customer;
DROP TABLE IF EXISTS customers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE products (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  branch_id INT NOT NULL,
  name VARCHAR(256) not NULL,
  price DECIMAL(10) not NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE branches (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  total_sales INT(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE product_order (
  product_id INT NOT NULL,
  order_id INT NOT NULL,
  PRIMARY KEY (product_id, order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE orders (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  customer_id INT NOT NULL,
  branch_id INT NOT NULL,
  total_price DECIMAL(10) UNSIGNED NOT NULL,
  purchase_date DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE branch_customer (
  branch_id INT NOT NULL,
  customer_id INT NOT NULL,
  PRIMARY KEY (branch_id, customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE customers (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  email VARCHAR(256) NOT NULL,
  address VARCHAR(256) NOT NULL,
  city VARCHAR(256) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code INT(5) NOT NULL,
  age INT(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-------------------------------------------------------------------------------
-- ***** Relationships *****

--------------------------------------------------
-- ***** products Relationships *****

ALTER TABLE products
  ADD FOREIGN KEY (branch_id)
  REFERENCES branches(id);


--------------------------------------------------
-- ***** product_order relationships *****

ALTER TABLE product_order
  ADD FOREIGN KEY (product_id)
  REFERENCES products(id);

ALTER TABLE product_order
  ADD FOREIGN KEY (order_id)
  REFERENCES orders(id);

--------------------------------------------------
-- ***** orders relationships *****

ALTER TABLE orders
  ADD FOREIGN KEY (customer_id)
  REFERENCES customers(id);

ALTER TABLE orders
  ADD FOREIGN KEY (branch_id)
  REFERENCES branches(id);

--------------------------------------------------
-- ***** branch_customer relationships *****

ALTER TABLE branch_customer
  ADD FOREIGN KEY (branch_id)
  REFERENCES branches(id);

ALTER TABLE branch_customer
  ADD FOREIGN KEY (customer_id)
  REFERENCES customers(id);

-------------------------------------------------------------------------------
-- ***** Initial Data *****

INSERT INTO `branches` (`name`, `total_sales`) VALUES
("Portland, OR", 1234334),
("Los Angeles, CA", 3243244),
("Miami, FL", "DC-15A", 5435654);

INSERT INTO `products` (branch_id, `name`, `price`) VALUES
(1, "Speedy Boat", 58671),
(2, "Super Boat", 92103),
(3, "Luxury Boat", 182449);

INSERT INTO `customers` (`name`, `email`, `address`, `city`, `state`, `zip_code`, `age`) VALUES
("Tyler Smith", "tyler@gmail.com", "3230 Pine Dr.", "Corvallis", "OR", 97330, 38),
("John Hunt", "jh@gmail.com", "13 Lucky Ln.", "Los Angeles", "CA", 90001, 61),
("Stacy Johnson", "stacyj@gmail.com", "4342 15th St.", "Miami", "FL", 33101, 49);

INSERT INTO `orders` (`customer_id`, `branch_id`, `total_price`, `purchase_date`) VALUES
(1, 1, 92103, '02/05/2020'),
(2, 2, 183000, '05/22/2020'),
(3, 3, 95000, '04/17/2020');


INSERT INTO `product_order` (`product_id`, `order_id`) VALUES
(2, 1),
(3, 2),
(2, 3);

INSERT INTO `branch_customer` (`branch_id`, `customer_id`) VALUES
(1, 1),
(2, 2),
(3, 3);
