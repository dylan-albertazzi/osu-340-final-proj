// Add sql functions here.
module.exports = (function () {
  var express = require("express");
  var router = express.Router();
  var bodyParser = require("body-parser");

  //Need to parse req body
  router.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  function getCustomers(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT customers.id, customers.name, customers.email, customers.city, customers.state, customers.age
        FROM customers`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.customers = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  
  function getCustomersByState(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT id, name, email, address, city, state, zip_code, age 
        FROM customers
        ORDER BY state ASC`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.customers = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getCustomer(res, mysql, context, id, complete) {
    var sql =
      "SELECT id, name, email, address, city, state, zip_code, age FROM customers WHERE customers.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.customer = results[0];
      complete();
    });
  }

  function getCustomerOrders(res, mysql, context, id, complete) {
    var sql = `SELECT orders.total_price, branches.name, orders.purchase_date  FROM orders 
      INNER JOIN branches
      ON orders.branch_id = branches.id
      WHERE orders.customer_id = ?`;
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.orders = results;
      complete();
    });
  }

  /*Display all branches. Requires web based javascript to delete users with AJAX*/

  router.get("/", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getCustomers(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("customers", context);
      }
    }
  });


  /*Display customers by state*/

  router.get("/byState", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getCustomersByState(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("customers", context);
      }
    }
  });

  /* Display one customer for the specific purpose of updating customers */

  router.get("/:id", function (req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updatecustomer.js"];
    var mysql = req.app.get("mysql");

    getCustomer(res, mysql, context, req.params.id, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("context:", context);
        res.render("update-customer", context);
      }
    }
  });

  /* Display one customers orders */

  router.get("/customer/:id", function (req, res) {
    callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getCustomerOrders(res, mysql, context, req.params.id, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("context for single customer:", context);
        res.render("orders-customers", context);
      }
    }
  });

  /* Adds a customer, redirects to the customers page after adding */

  router.post("/", function (req, res) {
    console.log("in post:", req.body);
    var mysql = req.app.get("mysql");
    var sql =
      "INSERT INTO customers (name, email, address, city, state, zip_code, age) VALUES (?,?,?,?,?,?,?)";
    var inserts = [
      req.body.customerName,
      req.body.customerEmail,
      req.body.customerAddress,
      req.body.customerCity,
      req.body.customerState,
      req.body.customerZip,
      req.body.customerAge,
    ];

    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect("/customers");
      }
    });
  });

  /* The URI that update data is sent to in order to update a branch */

  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    console.log("in form put yay. Context:", req.body);
    var sql =
      "UPDATE customers SET name=?, email=?, address=?, city=?, state=?, zip_code=?, age=? WHERE id=?";
    var inserts = [
      req.body.name,
      req.body.email,
      req.body.address,
      req.body.city,
      req.body.state,
      req.body.zip_code,
      req.body.age,
      req.params.id,
    ];

    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(error);

        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect(303, "/");
      }
    });
  });

  /* Route to delete a customer, simply returns a 202 upon success. Ajax will handle this. */

  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql = "DELETE FROM customers WHERE id = ?";
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.status(400);
        res.end();
      } else {
        res.status(202).end();
      }
    });
  });

  return router;
})();
