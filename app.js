const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.listen(3000, function() {
    console.log("Listening on port 3000!")
})

var itemList = [];

app.get("/", function(req, res) {
    res.render('list', {dayName: date, itemList: itemList});
})

app.get("/about", function(req, res) {
    res.render("about");
})

app.post("/", function(req, res) {
    const newItem = req.body.newItem;    
    itemList.push(newItem);    
    res.redirect("/");
    
})