let  {Schema, model} = require("mongoose")


let guestSchema = new Schema({
    name: String, 
    email: String,
    accessToken: String
})


let Guest = model('Guest', guestSchema)

module.exports = Guest