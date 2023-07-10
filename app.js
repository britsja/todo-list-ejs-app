const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.listen(3000, function() {
    console.log("Listening on port 3000!")
})

var itemList = [];

app.get("/", function(req, res) {
    var today = new Date();
    
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];

    if (today.getDay() === 6 || today.getDay() === 0) {
        var weekend = "a weekend baby!"
        res.render('list', {dayName: weekend, itemList: itemList});
    } else {
        res.render('list', {dayName: dayName, itemList: itemList});
    }
})

app.get("/about", function(req, res) {
    res.render("about");
})

app.post("/", function(req, res) {
    const newItem = req.body.newItem;    
    itemList.push(newItem);    
    res.redirect("/");
    
})