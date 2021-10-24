//para poder crear cursos necesito el modelo.
//y todas las operaciones se tienen que hacer atravez del modelo.


const Course = require('../models/course')
const User = require("../models/user")


const courses = [];

module.exports = {
    Query: {
        async  getCourses(obj, { pag, limit } , context) {

            console.log(`vamos a obtener el contexto de mis cursos : ${ context}`)
            
//limite me dice cuantos registro me quiero traer de mi base de datos 
//skip me dice cuantos registro me tengo que saltar para traer el que necesito
          let courses =  Course.find()
          
          if(pag != undefined){
              courses = courses.limit(limit).skip(((pag - 1 ) * limit));
          }

            return await courses;
        },
        async getCourseById(obj, { id }) {
            
            const course = await Course.findById(id)
            return course ;

        },
    },
    Mutation: {
        async addCourse(obj, { input  , user}) {

            //si queremos porteger que nadie que no este autorizado pueda subir cursos lo que podemos hacer es traer el contexto y verificar que en el token que nos mandan haya
            //por lo menos el usuario y demas
            //por el contrario retornamos null
            //if(!context || !context.currentUser) return null;

            let myUser = await User.findById(user)
            //creo mi nuevo objeto y luego lo tengo que guardar
            const course = new Course({...input , user});

            //guardo el objeto creado anteriormente
            await course.save();
             myUser.courses.push(course);
             await myUser.save()
            console.log("guardado : ");

            return course;

        },
       async updateCourse(obj, { id, input }) {
            const course = await Course.findByIdAndUpdate(id , input);
            return course;
        },
        async deleteCourse(obj, { id }) {

           await Course.deleteOne({_id : id});
            return { message: `el curso  ${id} fue eliminado correctamente` }

          

        }

    },
    Course : {
        async user(c){
            //retorno el usuario cuyo id sea el que esta en el curso 
            return await User.findById(c.user)
        }
    }

}