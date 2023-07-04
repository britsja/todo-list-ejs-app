const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.listen(3000, function() {
    console.log("Listening on port 3000!")
})

app.get("/", function(req, res) {
    var today = new Date();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];

    if (today.getDay() === 6 || today.getDay() === 0) {
        var weekend = "a weekend baby!"
        res.render('list', {dayName: weekend});
    } else {
        res.render('list', {dayName: dayName});
    }
})