
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {type: String, default:'', trim:true,lowercase:true},
    email: {type: String, default:"", unique:true,trim:true,lowercase:true},
    password : {type: String, default:"", trim:true},
})

// we name the UserSchema users and export the model (aka class)
module.exports= mongoose.model('users', UserSchema)
