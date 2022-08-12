let  {Schema, model} = require("mongoose")


let softSchema = new Schema({
    title: String, 
    vote: [{type: Schema.Types.ObjectId, ref: "Guest"}]
})


let Soft = model('Soft', softSchema)