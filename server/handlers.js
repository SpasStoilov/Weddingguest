// const { model } = require("mongoose")

function Register(req, res){
    console.log("Hand Register REQ.body:", req.body)
}

function Login(req, res){
    console.log("Hand Login REQ.body:", req.body)
}

function CreateEvent(req, res){
    console.log("Hand CreateEvent REQ.body:", req.body)
}

function UpdateEvent(req, res){
    console.log("Hand UpdateEvent REQ.body:", req.body)
}


const useHandler = {
    Register,
    Login,
    CreateEvent,
    UpdateEvent
}

model.exports = useHandler