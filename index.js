//This file routes urls to their appropriate fuctions using Express

var bodyParser = require("body-parser");
var express = require("express");
var exphbs = require("express-handlebars");

var app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//serve static files
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.status(200).render("base");
});

//This function is called when a get request is sent to the '/recipe' url
app.post("/", (req, res, next) => {
  res.render("base");
});

//404 handler
app.get("*", function (req, res) {
  res.status(404).render("404");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("== Server listening on port 3000");
});

app.get('/customers',function(req,res){
  res.render('customers')
});
app.get('/orders',function(req,res){
  res.render('orders')
});
app.get('/products',function(req,res){
  res.render('products')
});
app.get('/branches',function(req,res){
  res.render('branches')
});