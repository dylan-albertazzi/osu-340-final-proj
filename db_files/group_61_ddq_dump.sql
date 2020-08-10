-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for Linux (x86_64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: cs340_albertad
-- ------------------------------------------------------
-- Server version	10.4.13-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `droids`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE products (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  branch_id INT NOT NULL,
  name VARCHAR(256) not NULL,
  price DECIMAL(10) not NULL,
  FOREIGN KEY (branch_id)
    REFERENCES branches(id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (branch_id, `name`, `price`) VALUES
(1, "Speedy Boat", 58671),
(2, "Super Boat", 92103),
(3, "Luxury Boat", 182449);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE branches (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  total_sales INT(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` (`name`, `total_sales`) VALUES
("Portland, OR", 1234334),
("Los Angeles, CA", 3243244),
("Miami, FL", 5435654);
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE orders (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  customer_id INT NOT NULL,
  branch_id INT NOT NULL,
  total_price DECIMAL(10) not NULL,
  purchase_date DATE not NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`customer_id`, `branch_id`, `total_price`, `purchase_date`) VALUES
(1, 1, 92103, '02/05/2020'),
(2, 2, 183000, '05/22/2020'),
(3, 3, 95000, '04/17/2020');

/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order`
--

DROP TABLE IF EXISTS `product_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE product_order (
  product_id INT NOT NULL,
  order_id INT NOT NULL,
  PRIMARY KEY (product_id, order_id),
  FOREIGN KEY (product_id)
    REFERENCES products(id),
  FOREIGN KEY (order_id)
    REFERENCES orders(id)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` (`name`, `email`, `address`, `city`, `state`, `zip_code`, `age`) VALUES
("Tyler Smith", "tyler@gmail.com", "3230 Pine Dr.", "Corvallis", "OR", 97330, 38),
("John Hunt", "jh@gmail.com", "13 Lucky Ln.", "Los Angeles", "CA", 90001, 61),
("Stacy Johnson", "stacyj@gmail.com", "4342 15th St.", "Miami", "FL", 33101, 49);


/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `branch_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE branch_customer (
  branch_id INT NOT NULL,
  customer_id INT NOT NULL,
  PRIMARY KEY (branch_id, customer_id),
  FOREIGN KEY (branch_id)
    REFERENCES branches(id),
  FOREIGN KEY (customer_id)
    REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `product_order` WRITE;
/*!40000 ALTER TABLE `product_order` DISABLE KEYS */;
INSERT INTO `product_order` (`product_id`, `order_id`) VALUES
(2, 1),
(3, 2),
(2, 3);
/*!40000 ALTER TABLE `product_order` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `branch_customer` WRITE;
/*!40000 ALTER TABLE `branch_customer` DISABLE KEYS */;
INSERT INTO `branch_customer` (`branch_id`, `customer_id`) VALUES
(1, 1),
(2, 2),
(3, 3);
/*!40000 ALTER TABLE `branch_customer` ENABLE KEYS */;
UNLOCK TABLES;

