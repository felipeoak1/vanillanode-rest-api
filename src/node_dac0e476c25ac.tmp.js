const http = require("http")
const routes = require('./routes') 
const { URL } = require('url') 
const bodyParser = require('./helpers/bodyParser')

const server = http.createServer((request, response)=>{
    console.log(`Request method: ${request.method} | Request Endpoint: ${request.url}`)
    
    const parsedUrl = new URL(`http://localhost:3000${request.url}`)

    let id = null;
    let { pathname } = parsedUrl
    const splitEndPoint = pathname.split('/').filter(Boolean)
    
    if (splitEndPoint.length > 1) {
        pathname = `/${splitEndPoint[0]}/:id`
        id = splitEndPoint[1]
    }

    const route = routes.find((routeObj)=>{return routeObj.endpoint === pathname && routeObj.method === request.method})
    
    response.send = (statusCode, body)=>{
        response.writeHead(statusCode, {'content-type': 'application/json'})
        response.end(body)
    }
    
    if (route){
        request.params = { id }
        request.query = Object.fromEntries(parsedUrl.searchParams)
        
        if (['POST', 'PUT', 'PATCH'].includes(request.method)){
            bodyParser(request, ()=>{route.handler(request, response)})
        } else {
            route.handler(request, response)
        }
    } else {
        response.send(404, `Cannot acess ${request.method} ${pathname}`)  
    }
})

server.listen(3000, ()=>{console.log("Server start at http://localhost:3000")}) 