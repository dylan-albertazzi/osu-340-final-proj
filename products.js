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

  function getProducts(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT products.id, products.name, branches.name AS branch, products.price
            FROM products
            LEFT JOIN branches
            ON products.branch_id = branches.id
            GROUP BY products.id`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.products = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getProductsByPrice(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT products.id, products.name, branches.name AS branch, products.price
            FROM products
            LEFT JOIN branches
            ON products.branch_id = branches.id
            GROUP BY products.id
            ORDER BY price DESC`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.products = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getProductsByBranch(res, mysql, context, complete) {
    mysql.pool.query(
      `SELECT products.id, products.name, branches.name AS branch, products.price
            FROM products
            LEFT JOIN branches
            ON products.branch_id = branches.id
            GROUP BY products.id
            ORDER BY branch ASC`,
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.products = results;

        complete();
      }
    );
    console.log("=Context in func:", context);
  }

  function getProduct(res, mysql, context, id, complete) {
    var sql = "SELECT id, name FROM products WHERE products.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.product = results[0];
      complete();
    });
  }

  /*Display all products. Requires web based javascript to delete users with AJAX*/

  router.get("/", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getProducts(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("products", context);
      }
    }
  });

  /*Display Products by price*/

  router.get("/byPrice", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getProductsByPrice(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("products", context);
      }
    }
  });

  /*Display Orders by purchase date*/

  router.get("/byBranch", function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get("mysql");

    getProductsByBranch(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("res.render context:", context);
        res.render("products", context);
      }
    }
  });

  /* Display one product for the specific purpose of updating products */

  router.get("/:id", function (req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateorder.js"];
    var mysql = req.app.get("mysql");

    getProduct(res, mysql, context, req.params.id, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        console.log("context:", context);
        res.render("update-product", context);
      }
    }
  });

  /* Adds a order, redirects to the orders page after adding */

  router.post("/", function (req, res) {
    console.log(req.body.productName);
    var mysql = req.app.get("mysql");
    var sql = "INSERT INTO products (name, price) VALUES (?, ?)";
    var inserts = [
      req.body.productName,
      req.body.productPrice,
    ];

    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect("/products");
      }
    });
  });

  /* The URI that update data is sent to in order to update a order */

  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    console.log("in form put yay. Context:", req.body);
    var sql = "UPDATE products SET name=?, price=? WHERE id=?";
    var inserts = [
      req.name,
      req.body.price,
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

  /* Route to delete a order, simply returns a 202 upon success. Ajax will handle this. */

  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql = "DELETE FROM products WHERE id = ?";
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
