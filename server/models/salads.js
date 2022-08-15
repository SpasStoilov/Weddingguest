let  {Schema, model} = require("mongoose")


let saladSchema = new Schema({
    title: String, 
    recepie: String,
    vote: [{type: Schema.Types.ObjectId, ref: "Guest"}]
})

// we have to chek in every meal list of votes wich hold guest if the new guest is not in the list we add iv it is 
let Salad = model('Salad', saladSchema)

module.exports = Salad