let  {Schema, model} = require("mongoose")


let mainSchema = new Schema({
    title: String, 
    recepie: String,
    vote: [{type: Schema.Types.ObjectId, ref: "Guest"}]
})


let Main = model('Main', mainSchema)