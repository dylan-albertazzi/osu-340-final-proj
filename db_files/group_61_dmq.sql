-------------------------------------------------------------------------------
-- troopers page

SELECT *
  FROM troopers;

INSERT INTO `troopers` (`id`, `garrison`, `loadout`) VALUES
 (:idInput, :garrisonInput, :loadoutInput);

SELECT * 
    FROM troopers
    WHERE garrison = (garrisonForm);

-- Filter by trooper id
SELECT *
  FROM troopers;
WHERE id=:idInput;

-- Change garrison Assignment: moving to another garrison radio button
UPDATE troopers
   SET garrison=:garrisonInput
 WHERE id=:idInput;

-- Change garrison Assignment: removing from current garrison radio button
UPDATE troopers
   SET garrison=NULL
 WHERE id=:idInput;

-- Deleting troopers (RIP)
DELETE FROM `troopers` WHERE id=:idInput;

-------------------------------------------------------------------------------
-- garrisons page

SELECT * 
    FROM garrisons;

INSERT INTO `garrisons` (`id`, `name`, `capacity`) VALUES
(:idInput, :nameInput, :capacityInput);

-------------------------------------------------------------------------------
-- loadouts page
SELECT * FROM loadouts;
    INSERT INTO `loadouts` (`blaster`, `detonator`) VALUES
    (:blasterInput, :detonatorInput);

UPDATE loadouts 
    SET blaster = :blasterInput, detonator = :detonatorInput
    WHERE id = (:loadoutForm);


-------------------------------------------------------------------------------
-- ships page

SELECT *
  FROM ships;

INSERT INTO `ships` (`id`, `type`) VALUES
(:idInput, :typeInput);

-------------------------------------------------------------------------------
-- droids page
SELECT * 
    FROM droids;

INSERT INTO `droids` (`type`) VALUES
    (:typeInput);


-------------------------------------------------------------------------------
-- manifests page

--------------------------------------------------
-- ships_troopers
SELECT * FROM ships_troopers;

-- Adding a trooper to a ship
INSERT INTO `ships_troopers` (`ship`, `trooper`) VALUES
(:shipInput, :trooperInput);

-- Removing a trooper from a ship
DELETE FROM `ships_troopers` WHERE ship=:shipInput AND trooper=:trooperInput;

--------------------------------------------------
-- ships_droids
SELECT *
    FROM ships;

INSERT INTO `ships_droids` (`ship`, `droid`) VALUES
    (:shipInput, :droidInput);

DELETE FROM `ships_droids` WHERE ship = :shipInput OR :droidInput;



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