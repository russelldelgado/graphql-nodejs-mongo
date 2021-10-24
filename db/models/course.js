//documentos =>Filas
//colecciones =>Tabla


const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    title : String,
    views : Number,
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})


module.exports = mongoose.model('Course' , courseSchema);