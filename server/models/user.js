let  {Schema, model} = require("mongoose")


let userSchema = new Schema({
    email: String,
    password: String,
    events: [{type: Schema.Types.ObjectId, ref: "Event"}]
})


let User = model('User', userSchema)