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

app.listen(3000, function() {
    console.log("Listening on port 3000!")
})

mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
})

const taskSchema = new mongoose.Schema ({
    name: String
})

const Tasks = mongoose.model("Task", taskSchema);

app.get("/", function(req, res) {

    const itemList = [];

    Tasks.find().then((data) => {        
        if (data.length > 0) {
        data.forEach(function (entry) {            
            itemList.push(entry);                        
        });
        res.render('list', {dayName: date, itemList: itemList});
        } else {
            Tasks.insertMany([ {name: "Welcome to the to do list app"}, {name: "Hit the + button to add a new task"}, {name: "<-- Hit this to delete a task"} ]);   
            res.redirect("/");                 
        }
        
        
    });   
    
});

app.get("/about", function(req, res) {
    res.render("about");
})

app.post("/", function(req, res) {
    const newItem = req.body.newItem;   
    if (newItem.length > 0) { 
        Tasks.create({
            name: newItem
        });
        res.redirect("/");
    } else {
    res.redirect("/");
    }
})

app.post("/delete", async function(req, res) {
    await Tasks.deleteOne({_id: req.body.checkbox})
    res.redirect("/");
})