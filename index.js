const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const dotenv = require('dotenv').config();
var mongoose=require('mongoose')

const port = process.env.PORT || 3000;

//to use json and 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// mongodb connection and functions
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
var db=mongoose.connection
db.on('error',()=>console.log('AWS Server under Maintenence'))
db.once('open',()=>{
    console.log("connected to AWS N. Virginia (us-east-1)")
    console.log("visit at --->  http://localhost:3123")
})
var collectionOne = db.collection(process.env.COLLECTION_ONE)

const users = [];
fs.createReadStream('MOCK_DATA.csv')
  .pipe(csv())
  .on('data', (row) => {
    users.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

//   ROUTING

app.route('/')
    .get((req,res)=>{
      return res.send("/ is getting");
    })
    .post((req,res)=>{
        return res.send("/ is getting")
    })

app.route('/csv')
    .get((req,res)=>{
        return res.send(users)
    })

app.route('/csv/:id')
    .get((req,res)=>{
        const id = req.params.id;
        const user = users.find((user) => user.id === id);
        return res.json(user)
    })


app.listen(port, () => {
  console.log('server is on: ' + port);
});
