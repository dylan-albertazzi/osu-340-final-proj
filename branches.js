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

  function getBranches(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT branches.id, branches.name, COALESCE(SUM(orders.total_price), 0) AS tot_sales, COUNT(products.id) AS tot_products, COUNT(orders.id) AS tot_orders, COUNT(customers.id) AS tot_customers
            FROM branches 
            LEFT JOIN orders
            ON orders.branch_id = branches.id
            
            LEFT JOIN branch_customer
            ON branches.id = branch_customer.branch_id
            LEFT JOIN customers
            ON branch_customer.customer_id = customers.id
            LEFT JOIN products
            ON products.branch_id = branches.id
            GROUP BY branches.id`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.branches = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getBranchesBySales(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT branches.id, branches.name, COALESCE(SUM(orders.total_price), 0) AS tot_sales, COUNT(products.id) AS tot_products, COUNT(orders.id) AS tot_orders, COUNT(customers.id) AS tot_customers
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
            ORDER BY tot_sales DESC`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.branches = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getBranchesByLocation(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT branches.id, branches.name, COALESCE(SUM(orders.total_price), 0) AS tot_sales, COUNT(products.id) AS tot_products, COUNT(orders.id) AS tot_orders, COUNT(customers.id) AS tot_customers
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
            ORDER BY branches.name ASC`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.branches = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getBranch(res, mysql, context, id, complete) {
    var sql = "SELECT id, name FROM branches WHERE branches.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.branch = results[0];
      complete();
    });
  }

  /*Display all branches. Requires web based javascript to delete users with AJAX*/

  router.get("/", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getBranches(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("branches", context);
      }
    }
  });

  /*Display Branches by total sales*/

  router.get("/bySales", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getBranchesBySales(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("branches", context);
      }
    }
  });

  /*Display Branches by location*/

  router.get("/byLocation", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getBranchesByLocation(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("branches", context);
      }
    }
  });

  /* Display one branch for the specific purpose of updating branches */

  router.get("/:id", function (req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updatebranch.js"];
    var mysql = req.app.get("mysql");

    getBranch(res, mysql, context, req.params.id, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("context:", context);
        res.render("update-branches", context);
      }
    }
  });

  /* Adds a branch, redirects to the branches page after adding */

  router.post("/", function (req, res) {
    console.log(req.body.branchLocation);
    var mysql = req.app.get("mysql");
    var sql = "INSERT INTO branches (name) VALUES (?)";
    var inserts = [req.body.branchLocation];

    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect("/branches");
      }
    });
  });

  /* The URI that update data is sent to in order to update a branch */

  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    console.log("in form put yay. Context:", req.body);
    var sql = "UPDATE branches SET name=? WHERE id=?";
    var inserts = [req.body.name, req.params.id];

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

  /* Route to delete a branch, simply returns a 202 upon success. Ajax will handle this. */

  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql = "DELETE FROM branches WHERE id = ?";
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
