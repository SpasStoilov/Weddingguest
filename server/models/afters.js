let  {Schema, model} = require("mongoose")


let afterSchema = new Schema({
    title: String, 
    recepie: String,
    vote: [{type: Schema.Types.ObjectId, ref: "Guest"}]
})


let After = model('After', afterSchema)

module.exports = After