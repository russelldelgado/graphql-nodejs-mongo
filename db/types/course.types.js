
module.exports  = ` 


type Course{
    id : ID!
    title : String!
    views : Int
    user : User
}

input  CourseInput{
    title : String!
    views : Int
}

#extendemos para que no nos de fallos al importar dentro de las tools
extend type Query{
    getCourses(pag : Int , limit : Int = 1 ): [Course],
    getCourseById(id : ID!) :Course
}

#extendemos para que no nos de fallos al importar dentro de las tools
extend type Mutation{
    addCourse( input  : CourseInput , user : ID! ): Course,
    updateCourse(id : ID! , input : CourseInput ) : Course,
    deleteCourse(id : ID!) : Alert
}
`;