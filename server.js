/*********************************************************************************
 *  WEB422 – Assignment 1 Restaurant API
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Ahmad Jafari  Student ID: 143469195  Date: 17/09/2021
 *  Heroku Link: https://young-journey-13407.herokuapp.com/
 *
 ********************************************************************************/
const express = require("express");
const app = express();
var cors = require("cors");

const HTTP_PORT = process.env.PORT || 8080;

const RestaurantDB = require("./modules/restaurantDB.js");
 const db = new RestaurantDB();

app.use(cors());
app.use(express.json());
//mongodb+srv://as1admin:<qweasd>@cluster0.0vijw.mongodb.net/sample_restaurants?retryWrites=true&w=majority
const mongoDBUrl = `mongodb+srv://web322:123QweAsd@mjafari.hn63j.mongodb.net/sample_restaurants?retryWrites=true&w=majority`;

db.initialize(mongoDBUrl).then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
    }).catch((err)=>{
    console.log(err);
    });

app.get("/", (req, res) => {
    res.json({ msg: "API Listening" });
  });

// app.listen(HTTP_PORT, ()=>{
//     console.log(`server listening on: ${HTTP_PORT}`);
// });
app.post("/api/restaurants", (req, res)=>{
    db.addNewRestaurant(req.body)
    .then(()=>{
        res.status(201).json({ message: "Success adding restaurant."});
    }).catch((err)=>{
        res.status(500).json({ message: "Error adding restaurant. " + err.message});
    });
});

app.get("/api/restaurants", (req, res)=>{
    let parsedPage = parseInt(req.query.page, 0);
    let parsedPerPage = parseInt(req.query.perPage, 0);

    db.getAllRestaurants(parsedPage, parsedPerPage, req.query.borough)
    .then((restaurants)=>{
        res.status(201).json(restaurants);
    }).catch((err)=>{
        res.status(500).json({message: "Error. " + err.message});
    });
 })

 app.get("/api/restaurants/:id", (req, res)=>{
    db.getRestaurantById(req.params.id)
    .then((rest)=>{
        res.status(201).json(rest);
    }).catch((err)=>{
        res.status(204).json({message: "No restaurants found."});
        res.status(500).json({message:"Internal server error."})    
    })
});
app.put("/api/restaurants/:id", (req, res)=>{
    console.log(req.body._id)
    if (req.params.id != req.body._id) {
        res.status(404).json({ message: "Resource not found" });
      }
    else {
       let result = db.updateRestaurantById(req.body, req.params.id);
       if(result)
          res.status(201).json(result)
       else
          res.status(404).json({ message: "Resource not found" });
    }
});

app.delete("/api/restaurants/:id", (req, res)=>{
    if(req.params.id == req.body._id){
        db.deleteRestaurantById(req.params.id)
        .then(()=>{
            res.status(201).json({message:"Restaurant deleted."});
        }).catch((err)=>{
            res.status(500).json({message:"Server error. " + err.message});
        });
    }
    res.status(204).json({message:"Restaurant not found."});
});