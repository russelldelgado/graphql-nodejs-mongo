const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')

// const { graphqlExpress , graphiqlExpress } =  require('graphql-server-express')
// const { makeExecutableSchema } = require('graphql-tools')

const { ApolloServer }  =require('apollo-server-express')

const courseTypes = require('./types/course.types')
//merge me permite combinar objetos ya que si no no podría juntar objetos para los resolvers
const { merge } = require('lodash')
const courseResolver = require('./resolvers/course.resolve')

//user type definition - user resolvers
const userTypes = require('./types/user.types')
const userResolver = require('./resolvers/user.resolve')


//importamos esta función para poder hacer login con usuario autorizado mandando el token en la cabecera.

const authFunc = require('./libs/auth')

mongoose.connect('mongodb://172.17.0.2:27017/graphql_db_course' , {
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(() =>{
    console.log("base de datos abierta");
}).catch( err => console.log("error pendejo"))




async function startApolloServer(server , app) {
    await server.start();
    server.applyMiddleware({ app });
  }

//iniciamos nuestro servidor con express
const app =  express();

const typeDefs = `

    type Alert{
        message : String
    }

    type Query{
        _ : Boolean
    }

    type Mutation{
        _ : Boolean
    }

`;

const resolver = {

}

// const schema = makeExecutableSchema({
//     typeDefs : [typeDefs , courseTypes , userTypes],
//     resolvers : merge(resolver , courseResolver , userResolver)
// })


const server = new ApolloServer({
    typeDefs : [typeDefs , courseTypes , userTypes],
    resolvers : merge(resolver , courseResolver , userResolver), 
    context : authFunc()
    
})


// //estos son los midelware
// app.use("/graphql" , bodyParser.json() , graphqlExpress({schema : schema}))
// //grapiql lo que nos pide es una url donde se tienen que ir haciendo las peticiones
// app.use("/graphiql" , graphiqlExpress({ endpointURL : "/graphql"}))
// await server.start();
// server.applyMiddleware({app : app})

startApolloServer(server , app)


app.get('/' , (req , resp) =>{
    resp.json({conectado : true})
})


app.listen(8080 , function(){
    console.log("servidor lanzado en el puerto 8080")
})



