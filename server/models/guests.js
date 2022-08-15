let  {Schema, model} = require("mongoose")


let guestSchema = new Schema({
    name: String, 
    email: Number,
})


let Guest = model('Guest', guestSchema)

module.exports = Guest