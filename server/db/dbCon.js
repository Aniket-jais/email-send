const express = require('express');
const app = express();
const mongoose = require('mongoose');
const con = async (req, res, next) => {
    try{
        mongoose.connect('mongodb://localhost/signInDb');
    }
    catch(err){
        console.log("error");
    }
}
module.exports = con;