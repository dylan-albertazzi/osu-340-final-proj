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

  function getOrders(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT orders.id, orders.purchase_date, orders.total_price, customers.name AS customer, branches.name AS branch
            FROM orders
            LEFT JOIN customers
            ON orders.customer_id = customers.id

            LEFT JOIN branches
            ON orders.branch_id = branches.id

            LEFT JOIN product_order
            ON orders.id = product_order.order_id

            LEFT JOIN products
            ON product_order.product_id = products.id

            GROUP BY orders.id`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.orders = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getOrdersByPrice(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT orders.id, orders.purchase_date, orders.total_price, customers.name AS customer, branches.name AS branch
            FROM orders
            LEFT JOIN customers
            ON orders.customer_id = customers.id

            LEFT JOIN branches
            ON orders.branch_id = branches.id

            LEFT JOIN product_order
            ON orders.id = product_order.order_id

            LEFT JOIN products
            ON product_order.product_id = products.id

            GROUP BY orders.id
            ORDER BY total_price DESC`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.orders = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getOrdersByDate(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT orders.id, orders.purchase_date, COALESCE(SUM(products.price), 0) AS total_price, customers.name AS customer, branch.location AS branch
            FROM orders
            LEFT JOIN customers
            ON orders.customer_id = customers.id

            LEFT JOIN branches
            ON orders.branch_id = branches.id

            LEFT JOIN product_order
            ON orders.id = product_order.order_id

            GROUP BY orders.id
            ORDER BY purchase_date ASC`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.orders = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getOrder(res, mysql, context, id, complete) {
    var sql = "SELECT id, total_price FROM orders WHERE orders.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.order = results[0];
      complete();
    });
  }

  /*Display all orders. Requires web based javascript to delete users with AJAX*/

  router.get("/", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getOrders(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("orders", context);
      }
    }
  });

  /*Display Orders by total price*/

  router.get("/byTotalPrice", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getOrdersByPrice(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("orders", context);
      }
    }
  });

  /*Display Orders by purchase date*/

  router.get("/byDate", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getOrdersByDate(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("orders", context);
      }
    }
  });

  /* Display one order for the specific purpose of updating orders */

  router.get("/:id", function (req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateorder.js"];
    var mysql = req.app.get("mysql");

    getOrder(res, mysql, context, req.params.id, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("context:", context);
        res.render("update-order", context);
      }
    }
  });

  /* Adds a order, redirects to the orders page after adding */

  router.post("/", function (req, res) {
    console.log(req.body.orderDate);
    var mysql = req.app.get("mysql");
    var sql = "INSERT INTO orders (purchase_date) VALUES (?)";
    var inserts = [req.body.orderDate];

    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect("/orders");
      }
    });
  });

  /* The URI that update data is sent to in order to update a order */

  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    console.log("in form put yay. Context:", req.body);
    var sql = "UPDATE orders SET purchase_date=? WHERE id=?";
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

  /* Route to delete a order, simply returns a 202 upon success. Ajax will handle this. */

  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql = "DELETE FROM orders WHERE id = ?";
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
