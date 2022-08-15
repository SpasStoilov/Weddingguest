let  {Schema, model} = require("mongoose")


let appetizerSchema = new Schema({
    title: String, 
    recepie: String,
    vote: [{type: Schema.Types.ObjectId, ref: "Guest"}]
})


let Appetizer = model('Appetizer', appetizerSchema)

module.exports = Appetizer