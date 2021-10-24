const express = require('express');
const { graphqlHTTP } = require('express-graphql')
//cuando trabajamos con graphql tenemos dos maneras de definir el schema. 1-Con objetos. 2-buildSchema
const { buildSchema } = require('graphql')
let courses = require('./courses')
const app = express();


//usamos `` para definir un template literal
//Si usamos el ID de graphql validamos que no existan dos objetos que existan con el mismo ID
//! Indica que ambos datos son obligatorios
//en getCourses indicamos de que tipo seran estos valores
//Schema definition languaje
const schema = buildSchema(`
    type Course{
        id : ID!
        title : String!
        views : Int
    }

    input  CourseInput{
        title : String!
        views : Int
    }

    type Alert{
        message : String
    }


    type Query{
        getCourses(pag : Int , limit : Int = 1 ): [Course],
        getCourseById(id : ID!) :Course
    }

    type Mutation{
        addCourse( input  : CourseInput ): Course,
        updateCourse(id : ID! , input : CourseInput ) : Course,
        deleteCourse(id : ID!) : Alert
    }
`)


const root = {
    getCourses({ pag  , limit}){

        if(pag != undefined){
            //slice me retorna un numero de arreglos específicos
            return courses.slice((pag * limit) , ((pag + 1) * limit))
        }

        return courses;
    },
    getCourseById({ id }){
        console.log(id);
       return  courses.find(( course ) => id == course.id   )
    },
    addCourse( { input} ){

        const { title , views } = input

        const course = {
            title,
            views,
            id : String(courses.length + 1),
        }
        courses.push(course)
        return course;

    },
    updateCourse({id , input }){
        const { title ,views } = input
        //esto me devuelve la posición donde he econtrado mi arreglo
        const courseIndex = courses.findIndex( course => id !== course.id);
        const course = courses[courseIndex];
        //esto me permite crear un nuevo objeto tomando un valor inicial y modificando o agregando nuevo valores que pongamos despues
        const newCourse = Object.assign(course , { title , views})
        //guardo el la posición del curso anterior el nuevo curso y lo sustituyo por el nuevo
        courses[courseIndex] = newCourse;
        //retorno el valor
        return newCourse;
    },
    deleteCourse({ id }){

        //filter lo que hace es retornar un nuevo dato sin los datos indicados 
        courses = courses.filter( curso => id === curso.id)
        return { message : `el curso  ${ id } fue eliminado correctamente` }

        // const courseIndex = courses.findIndex(course => id === course.id)
        // console.log(`quieres eliminar el curso ${courseIndex}`);
        // if(course >= 0){
            // courses.splice( courseIndex )
            // return {alert()}
        // }
        // return { message : "No se ha podido eliminar su curso"}



    }



}

//Esto quiere decir que va a montar un servidor dentro de nuestro propio servidor
//pero le tengo que indicar con el primer valor donde lo tienen que montar, ese es el primer valor y puedo poner lo que yo quiera.
//como no tenemos como devolver un resolve uno a uno, lo que podemos hacer es introducir un objeto con funciones que hagan mas con el mismo nombre de las querys  de mi schema.
app.use("/graphql" , graphqlHTTP({
    schema,
    rootValue : root,
    graphiql : true
}))

app.get("/" , function(req , res){
    res.json(courses)
})


app.listen('8080' , function(){
    console.log("servidor iniciado en el puerto 8080");
})