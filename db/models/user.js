const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secreto = require('../libs/env').secret

const userSchema = new mongoose.Schema({
    email: String,
    hashedPassword: {
        type: String
    },
    token: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }]
})
//creamos estos campos virtuales como se les suele llamara para que se ejecute antes de guardar el usuario 
userSchema.virtual('password')
//ejecutaremos esto que se llama hook para realizar una accion antes, durante o despues segun le hayamos indicado 
//en nuestro caso antes de que se ejecuten las validaciones vamos a proceder a encryptar nuestro password
userSchema.pre('validate', async function () {

    if (this.password == undefined) return;
    //esta es la función que se encarga de encriptar un valor


    try {
        const hash = await bcrypt.hash(this.password, 10);
        console.log(hash , this.password)
        this.hashedPassword = hash

    } catch (error) {
        console.log(error);
        throw error
    }

})


//este es un metodo estático que llamaremos para autenticarnos
//User.authenticate()

userSchema.statics.authenticate = async function({email , password}){

    //dentro de un metodo estático la palabra reservada this hace referencia al mismo objeto.


    const user =await  this.findOne({email});

    


    //comparamos que nuestra contraseña es igual a la que tenemos almacenada ne la bbdd
    //el reltado nos dice si ambos son iguales
    const resultado =await  bcrypt.compare(password , user.hashedPassword);

    console.log(`el resultado es ${resultado}`)


    if(!resultado){
        throw new Error('Email or password is no real')
    }

    //JSON WEB TOKEN

    user.token = jwt.sign({id : user.id} , secreto )
    
    await user.save();


    return user;

}



//con esto indicamos que tenemos una relación con los cursos, y que un usuario puede tener muchos cursos
// courses : [{
// type : mongoose.Schema.Types.ObjectId,
// ref : "Course"
// }]

module.exports = mongoose.model("User", userSchema)