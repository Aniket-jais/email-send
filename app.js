let router = require("./server/routes/router");
//let router1 = require('./email');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
const joi = require('joi');
mongoose.connect('mongodb://localhost/signInDb');
//const dbConn = require('./server/db/dbCon')
const bodyParser = require('body-parser');
const PORT = 3000;
app.use(bodyParser.json());
app.use(router);
//app.use(router1);
app.listen(PORT,(req,res)=>{
    console.log(`server running on ${PORT}`);
});






