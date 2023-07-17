const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
require('dotenv').config({path: __dirname + '/.env'});
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(cors());

const uri = process.env.ATLAS_URI;

console.log(uri);

app.listen(3000, function() {
    console.log("Listening on port 3000!")
})

mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
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