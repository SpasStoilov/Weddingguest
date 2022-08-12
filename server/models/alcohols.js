let  {Schema, model} = require("mongoose")


let alcoholSchema = new Schema({
    title: String, 
    vote: [{type: Schema.Types.ObjectId, ref: "Guest"}]
})


let Alcohol = model('Alcohol', alcoholSchema)