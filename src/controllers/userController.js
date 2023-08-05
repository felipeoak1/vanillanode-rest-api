//Regra de negócios da aplicação.
let users = require('../mocks/users')

 module.exports = {
     listUsers(request, response){
        const { order } = request.query
        const sortedUsers = users.sort((p, s)=>{
            if (order === 'desc') {
                return p.id < s.id ? 1 : -1
            }
            return p.id > s.id ? 1 : -1
        })

        response.send(200, JSON.stringify(sortedUsers))
    },

    getUserById(request, response){
        const { id } = request.params
        const userById = users.find((user) => {
           return user.id === Number(id)
        })

        if (!userById) {
            return response.send(400, JSON.stringify({erro:`User not found`}))
        }
        
        response.send(200, JSON.stringify({userById}) )
    },

    createUser(request, response) {
        const { body } = request
        const lastUserId = users[users.length - 1].id
        const newUser = {
            id: lastUserId + 1,
            name: body.nome
        } 

        users.push(newUser)

        response.send(200, JSON.stringify(newUser))
    },
    
    updateUser(request, response) {
        let { id }  = request.params
        const { name }  = request.body

        id = Number(id)

        const userExists = users.find((user) => {return user.id === id})
        console.log(userExists)
        
        if (!userExists) {
            return response.send(400, JSON.stringify({error: "User not found"}))
        }
        users = users.map((user) => {
            if (user.id === id ){
                return {
                    id,
                    name,
                }
            }
            
            return user
        })
        response.send(200, JSON.stringify({id, name}))
    }, 

    deleteUser(request, response) {
        let { id }  = request.params
        id = Number(id)

        users = users.filter((user)=>{return user.id !== id })
        response.send(200, JSON.stringify({'deleted':true}))
    }
 }