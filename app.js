const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.listen(3000, function() {
    console.log("Listening on port 3000");
})

app.get("/", function(req, res) {
    res.send("<h1>Hello</h1>")
})