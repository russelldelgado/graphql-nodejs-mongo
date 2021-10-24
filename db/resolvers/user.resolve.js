const userModel = require('../models/user')
const Course = require("../models/course")

module.exports = {

    Query: {
        async getUsers() {

            const users = await userModel.find()
            return users;
        },
        async getUserById(obj, { id }) {

            const user = await userModel.findById(id)
            return user;

        },
    },

    Mutation: {
        async signUp(obj, { input }) {

            const newUser = new userModel(input)

            await newUser.save();

            return newUser;

        },
        async logIn(obj, { input }) {
            try {

                const user = userModel.authenticate(input)
                return user;
            } catch (error) {
                return null;
            }


        },
        // async signOut() {

        // }

    },
    //podemos escribir resolver personalizados para subcampos de nuestro tipo objeto, este user hacer referencia al User de objeto
    //y le indico que para el subcampo course quiero que retornes algo en específico
    //objeto
    User: {
        //subcampo del user
        //el campo padre es el que resuelve esto asiqeu obtengo todos sus datos dentro de la propiedad u
        async courses(u) {
            console.log("ejecutando los cursos ssi no los pido no se ejecutan");
            return await Course.find({ user: u.id })
        }
    }
}