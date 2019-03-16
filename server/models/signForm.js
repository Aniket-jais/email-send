const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const formSchema = mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    }, 
    mobileNumber:{
        type:Number
    },
    dateOfBirth:{
        type:Date
    },
    password:{
        type:String
    },
    confirmPassword:{
        type:String
    }
});
formSchema.plugin(uniqueValidator);
const Form = mongoose.model('SignForm',formSchema);
module.exports = Form;