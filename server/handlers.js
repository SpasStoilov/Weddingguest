const { validationResult } = require("express-validator");
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

const saltRounds = 10;


async function Register(req, res){
    console.log("Hand Register REQ.body:", req.body)
    let result = validationResult(req)
    console.log("Hand Register Validations:", result)

    if (result.errors.length === 0) {
        
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            const accessToken = await bcrypt.hash(req.body.email, saltRounds);
            let user = new User({
                email: req.body.email,
                password: hashedPassword,
                accessToken
            })
            user.save()
            req.session.user = user
            res.json(user)
        }
        catch (err) {
            console.log(err.message)
        }
        
    } 
    else {
        res.json(result.errors)
    }
    
}

async function Login(req, res){
    
    console.log("Hand Login REQ.body:", req.body)
    let result = validationResult(req)
    console.log("Hand Login Validations:", result)

    if (result.errors.length === 0) {
        
        try {
            let user = await User.findOne({email:req.body.email})
            let isUser = await bcrypt.compare(req.body.password, user.password)
            if(isUser){
                res.json(user)
            }
            else {
                throw new Error("Email and Password do not match!")
            }
        }
        catch (err) {
            console.log(err.message)
            res.json({
                email: req.body.email,
                passwrod: req.body.password,
                msg: err.message,
                param1: 'email',
                param2: "password",
            })
        }
        
    } 
    else {
        res.json(result.errors)
    }
}

function CreateEvent(req, res){
    console.log("Hand CreateEvent REQ.body:", req.body)
    res.json({})
}

function UpdateEvent(req, res){
    console.log("Hand UpdateEvent REQ.body:", req.body)
    res.json({})
}


let useHandler = {
    Register,
    Login,
    CreateEvent,
    UpdateEvent
}

module.exports = useHandler;