const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
require('dotenv').config({path: __dirname + '/.env'});
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const _ = require('lodash');

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

const listSchema = {
    name: String,
    items: [taskSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

    const itemList = [];

    Tasks.find().then((data) => {    
        const taskname = "Default"    
        if (data.length > 0) {
            data.forEach(function (entry) {            
                itemList.push(entry);                        
            });            
            res.render('list', {listName: taskname, itemList: itemList});
        } else {
            Tasks.insertMany([ {name: "Welcome to the to do list app"}, {name: "Hit the + button to add a new task"}, {name: "<-- Hit this to delete a task"} ]);   
            res.redirect("/");                 
        }          
    });       
});

app.get("/about", function(req, res) {
    res.render("about");
})

app.post("/", async function(req, res) {
    const newItem = req.body.newItem;   
    const listName = req.body.listName;    
    if (listName === "Default") {
        if (newItem.length > 0) { 
            await Tasks.create({
                name: newItem
            });
            res.redirect("/");
        } else {
        res.redirect("/");
        }
    } else {
        try {
          const data = await List.find({ name: listName });
          if (data.length > 0) {
            const itemEntry = { name: newItem };            
            data[0].items.push(itemEntry);
            await data[0].save();
          }
          res.redirect("/" + listName);
        } catch (error) {
          console.error(error);
          res.status(500).send("An error occurred");
        }
      }
})

app.post("/delete", async function(req, res) {
    const listName = req.body.listName;
    const listItemId = req.body.checkbox;
  
    if (listName === "Default") {
      await Tasks.deleteOne({_id: listItemId});
      res.redirect("/");
    } else {
      try {
        await List.findOneAndUpdate(
          { name: listName },
          { $pull: { items: { _id: listItemId } } }
        ).exec()
        .then(() => {
            res.redirect("/" + listName);
        })
        
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
      }
    }
});

  

app.get("/:pageId", function(req, res) {
    if (req.params.pageId != "favicon.ico") {
      customListName = _.capitalize(req.params.pageId);

      const itemList = [];

      List.find({name: customListName}).then((data) => {
        if (data.length > 0) {            
            data.forEach(function (entry) {   
                const items = entry.items;  
                items.forEach(function (item) {
                    itemList.push(item);  
                })     
                                      
            });
            res.render('list', {listName: customListName, itemList: itemList});
        } else {
            const list = new List({
                name: customListName,
                items: [{name: "Welcome to the to do list app"}, {name: "Hit the + button to add a new task"}, {name: "<-- Hit this to delete a task"}]
            });
    
            list.save()

            res.redirect("/" + customListName);
            
        }
      });      

    }
})