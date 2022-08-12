// const { body } = require('express-validator');
const useHandler = require("./handlers.js");

function router(server){
    
    console.log('S:>>> Router acting...')

    server.post('/register', useHandler.Register)
    server.post('/login', useHandler.Login)

    server.post('/user/events/create', useHandler.CreateEvent)
    server.post('/user/events/:queryParams', useHandler.UpdateEvent)
}

module.exports = router