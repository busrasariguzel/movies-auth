const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    movie : {type: String, unique: true, default:''},
    rating: {type: String, default:"", unique:false},
    synopsis : {type: String, default:""},
    release: {type: String , unique:false, default:""},
    genre: {type: Array, default:""},
    box: {type: String , unique:false, default:""}
})

module.exports= mongoose.model('movies', MovieSchema)  