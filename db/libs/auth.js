const jwt = require('jsonwebtoken')
const secreto = require('./env').secret
const User = require("../models/user") 

var numero = 1;


module.exports = async function({req}){

    console.log(`chinga tu madre pasamos por aqui y esto se para en la funcion de autorización ${numero++} `)

    let token = null;
    let currentUser = null;

    token  = req.headers['Authorization'];
    console.log("token")
    console.log(token)

    if(!token) return {}; 

    //tenemos que verificar el secreto y pasarle un token para ver los datos que hay dentro, esto me devuelve un objeto con los datos que le he mandado anteriormente
   const decodedInfo =  jwt.verify(token , secreto)

    if(token && decodedInfo){
        //sabemos que hay un id por que cuando hemos incriptado el token le hemos mandado como dato el id del usuario que estamos utilizando
        currentUser = await User.findById(decodedInfo.id)

        console.log("chinga tu madre pasamos por aqui y esto se para en la funcion de autorización")
        if(!currentUser) throw new Error('Invalid token')
    }

    console.log("vamos a retornar ya algo bueno sugpongo")
    //retornamos el token y el current user del usuario actual
    //esto que retorno aqui lo puedo ver en el contexto de mi aplicación de graphql
    return {
        token,
        currentUser 
    }

}