const { body } = require('express-validator');
const useHandler = require("./handlers.js");

// localMidds:
// function XAuth (req, res, next){

//     if (!req.headers['X-Authorization'] || req.headers['X-Authorization'] === "empty"){
//         console.log(req.headers['X-Authorization'])
//         res.status(401)
//         res.send("Unauthorized behavior!")
//         res.end()
//     }
//     else {
//         next()
//     }
    
// }
//----------------------------------------------------------------------------------------

function router(server){
    
    console.log('S:>>> Router acting...')

    server.post('/register', 
        body('email').notEmpty().bail().exists().normalizeEmail().isEmail().trim(),
        body('password').notEmpty().bail().exists().isLength({min: 3}).custom((value, {req}) => {
            if (value !== req.body.repeatPassword){
                throw new Error('Passwords do not match!')
            }
            return true
        }).trim(),
        body('repeatPassword').notEmpty().bail().exists().isLength({min: 3}).custom((value, {req}) => {
            if (value !== req.body.password){
                throw new Error('Passwords do not match!')
            }
            return true
        }).trim(),
        useHandler.Register
    )
    server.post('/login', 
        body('email').notEmpty().bail().exists().normalizeEmail().isEmail().trim(),
        body('password').notEmpty().bail().exists().isLength({min: 3}).trim(),
        useHandler.Login
    )

    server.post('/event/vote/:eventId', useHandler.AppendVote)
    server.get('/event/:eventId', useHandler.GetEvent)
    server.get('/user/events', useHandler.Events)
    server.post('/user/events/create', useHandler.CreateEvent)
    server.post('/user/events/update/:eventId', useHandler.UpdateEvent)
    server.delete('/user/events/update/:eventId', useHandler.DeleteEvent)
}

module.exports = router