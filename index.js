//This file routes urls to their appropriate fuctions using Express

var bodyParser = require("body-parser");
var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("./dbcon.js");

var app = express();

// app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("mysql", mysql);
console.log("my sql set");
//serve static files
app.use(express.static(__dirname + "/static"));
app.use("/branches", require("./branches.js"));
app.use("/customers", require("./customers.js"));
app.use("/orders", require("./orders.js"));
app.use("/products", require("./products.js"));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).render("base");
});

//This function is called when a get request is sent to the '/recipe' url
app.post("/", (req, res, next) => {
  res.render("base");
});

app.get("/about", (req, res) => {
  res.status(200).render("about");
});

app.get("/branches", (req, res) => {
  res.status(200).render("branches");
});

app.get("/customers", (req, res) => {
  res.status(200).render("customers");
});
app.get("/orders", function (req, res) {
  res.render("orders");
});
app.get("/products", function (req, res) {
  res.render("products");
});
//404 handler
app.get("*", function (req, res) {
  res.status(404).render("404");
});

app.listen(process.env.PORT || 2087, function () {
  console.log("== Server listening on port 2087");
});
