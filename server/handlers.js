// const { model } = require("mongoose")

function Register(req, res){
    console.log("Hand Register REQ.body:", req.body)
    res.json({})
}

function Login(req, res){
    console.log("Hand Login REQ.body:", req.body)
    res.json({})
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