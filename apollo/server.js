const {ApolloServer} = require('apollo-server')
const { makeExecutableSchema } = require('graphql-tools')
const courses = require('./courses')

//hacemos la definición de tipos


const typeDefs = `

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

`

//creamos los resolver 


const  resolvers = {
    Query :{
        getCourses(obj ,{ pag  , limit}){

            if(pag != undefined){
                //slice me retorna un numero de arreglos específicos
                return courses.slice((pag * limit) , ((pag + 1) * limit))
            }
    
            return courses;
        },
        getCourseById(obj ,{ id }){
            console.log(id);
           return  courses.find(( course ) => id == course.id   )
        },
    },
    Mutation : {
        addCourse(obj ,  { input} ){

            const { title , views } = input
    
            const course = {
                title,
                views,
                id : String(courses.length + 1),
            }
            courses.push(course)
            return course;
    
        },
        updateCourse(obj , {id , input }){
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
        deleteCourse(obj , { id }){
    
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
}


//creamos el schema con la función importada anteriormente


const schema = makeExecutableSchema({
    typeDefs,
    resolvers

})


//creamos una nueva instancia de apollo server para que sea nuestro servidor en vez de express
const server = new ApolloServer({
    schema : schema,
});


server.listen().then( ({url}) =>{
    console.log(`servidor lanzado en ${ url }`);
})