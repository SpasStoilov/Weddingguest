const { validationResult } = require("express-validator");
const formidable = require("formidable")
const bcrypt = require('bcrypt');
const After = require("./models/afters.js")
const Alcohol = require("./models/alcohols.js")
const Appeteizer = require("./models/appetizer.js")
const Event = require("./models/events.js")
const Guest = require("./models/guests")
const Main = require("./models/mains.js")
const Salad = require("./models/salads")
const Soft = require("./models/softs.js")
const User = require("./models/user.js")
const useService = require("./services.js")

const saltRounds = 10;


async function Register(req, res){
    console.log("Hand Register REQ.body:", req.body)
    let result = validationResult(req)
    console.log("Hand Register Validations:", result)
    console.log("Hand Register REQ.session:", req.session)

    try {

        let userExist = await User.findOne({email:req.body.email})
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const accessToken = await bcrypt.hash(req.body.email, saltRounds);

        if (result.errors.length !== 0) {
            res.status(406) //Not acceptable
            res.json(result.errors)
        }
        else if (userExist){
            res.status(302) //found
            res.json({})
        }
        else {
            let user = new User({
                email: req.body.email,
                password: hashedPassword,
                accessToken
            })
           
            user.save()
            res.json(user)
        }
    }
    catch (err) {
        console.log(err)
    }

}

async function Login(req, res){

    console.log("Hand Login REQ.body:", req.body)
    let result = validationResult(req)
    console.log("Hand Login Validations:", result)

    try {

        let user = await User.findOne({email:req.body.email})
        let isItUser = await bcrypt.compare(req.body.password, user.password)

        if (isItUser) {
            res.json(user)
        }
        else {

            result.errors = result.errors.concat(
                [
                    {
                        msg: 'Email and password do not match!',
                        param: 'email',
                    },
                    {
                        msg: 'Email and password do not match!',
                        param: 'password'
                    }
                ]
            )

        }

        if (result.errors.length !== 0) {
            res.status(406) //Not acceptable
            res.json(result.errors)
        }
   
    }
    catch (err) {
        console.log(err)
    }
        
}

async function CreateEvent(req, res){
    console.log("Hand CreateEvent REQ.body:", req.body)
    console.log("Hand CreateEvent REQ.session:", req.session)

    try {

        // let isUserValid = await bcrypt.compare(req.session.user.email, req.headers['X-Authorization'])
        console.log('S:>>> Hand CreateEvent X-Authorization:', req.headers)
        let user = await User.findOne({accessToken: req.headers['x-authorization']})
        console.log('S:>>> Hand CreateEvent User:', user)

        if (user){
            
            let formDataClient = new formidable.IncomingForm()
            console.log('S:>>> Hand CreateEvent -> FORMDATA:', formDataClient);

            formDataClient.parse(req, (err, fields, files) => {
                console.log('S:>>> Hand CreateEvent: ERRORS:', err);
                console.log('S:>>> Hand CreateEvent: FIELDS:', fields);
                console.log('S:>>> Hand CreateEvent: FILES:', files);
                console.log('S:>>> Hand CreateEvent: FILES Keys:', Object.keys(files));
                let imgsNewPaths = []
                useService.appendImgInStaticUploads(files, imgsNewPaths)
            })
            res.json({yes:"ok"})
        }
        res.json({err:"no"})

    }
    catch (err) {
        console(err)
    }

}

async function UpdateEvent(req, res){
    console.log("Hand UpdateEvent REQ.body:", req.body)
    let isUserValid = await bcrypt.compare(req.session.user.email, req.headers['X-Authorization'])
    if (isUserValid){
        res.json({})
    }
}


let useHandler = {
    Register,
    Login,
    CreateEvent,
    UpdateEvent
}

module.exports = useHandler;