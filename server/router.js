const { body } = require('express-validator');
const useHandler = require("./handlers.js");


function router(server){
    
    console.log('S:>>> Router acting...')

    server.post('/register', 
        body('email').exists().normalizeEmail().isEmail().trim(),
        body('password').exists().isLength({min: 3}).custom((value, {req}) => {
            if (value !== req.body.repeatPassword){
                throw new Error('Passwords do not match!')
            }
            return true
        }).trim(),
        useHandler.Register
    )
    server.post('/login', 
        body('email').exists().normalizeEmail().isEmail().trim(),
        body('password').exists().isLength({min: 3}).trim(),
        useHandler.Login
    )

    server.post('/user/events/create', useHandler.CreateEvent)
    server.post('/user/events/:queryParams', useHandler.UpdateEvent)
}

module.exports = router