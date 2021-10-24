const express = require('express')
const { GraphQLSchema, GraphQLObjectType, GraphQLString, graphql, buildSchema, GraphQLInt } = require('graphql')


const app = express();


const courseType = new GraphQLObjectType({
    name: 'Course',
    fields: {
        title: { type: GraphQLString },
        views: { type: GraphQLInt }
    }
})


const schema = new GraphQLSchema({
    query: new GraphQLObjectType(
        {
            name: "RootQueryType", // este es el tipo para las consultas bases
            fields: {
                message: {
                    type: GraphQLString, // este es el tipo de dato
                    resolve() { // esta es la funcion que indica como responder cuando soliciten este mensaje
                        return "Hola mundo, hola russell"
                    }
                },
                course: {
                    type : courseType,
                    resolve(){
                        return {title : 'curso de grapql' , views : 1000};
                    }
                }
            }
        }
    )
});

app.get('/', (req, resp) => {

    //esta funcion nos permite hacer consultas a nuestro schema, para esto tendremos que pasarle el schema
    //posteriormente le digo la consulta a realizar, en este caso le pido el mensaje
    //posteriormente cuando tenga la respuesta le mando en json la respuesta al que me ha hecho la consulta.
    graphql(schema, '{ message , course{title , views} }').then(r => resp.json(r)).catch(res.json)
    // resp.send("Hola russell vamos a empezar con graphql"); 
})

app.listen(8080, function () {
    console.log("Servidor iniciado en el puerto 80");
})

//lo primero que tenemos que hacer en graphql es crear un schema de neustros datos
//dentro de grapql shecha va todo nuestro objetos y como se realiza todo