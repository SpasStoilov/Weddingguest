let  {Schema, model} = require("mongoose")


let evetSchema = new Schema({
    title: String,
    imageUrl: String,
    hints: String,
    locations: String,
    guests: [{type: Schema.Types.ObjectId, ref: "Guest"}],
    salads: [{type: Schema.Types.ObjectId, ref: "Salad"}],
    appetizers: [{type: Schema.Types.ObjectId, ref: "Appetizer"}],
    mains: [{type: Schema.Types.ObjectId, ref: "Main"}],
    afterMeals: [{type: Schema.Types.ObjectId, ref: "After"}],
    alcohols: [{type: Schema.Types.ObjectId, ref: "Alcohol"}],
    softs: [{type: Schema.Types.ObjectId, ref: "Soft"}],
})

let Event = model("Event", evetSchema)