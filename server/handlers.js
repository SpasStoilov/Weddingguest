const { validationResult } = require("express-validator");
const formidable = require("formidable")
const bcrypt = require('bcrypt');
const User = require("./models/user.js")
const Event = require("./models/events.js")
const Guest = require("./models/guests")
const useService = require("./services.js");
const { response } = require("express");

const saltRounds = 10;


async function Register(req, res){
    console.log("Hand Register REQ.body:", req.body)
    let result = validationResult(req)
    console.log("Hand Register Validations:", result)
    console.log("Hand Register REQ.session:", req.session)

    try {

        let userExist = await User.findOne({email:req.body.email})
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const accessToken = await bcrypt.hash(req.body.email, saltRounds);

        if (result.errors.length !== 0) {
            res.status(406) //Not acceptable
            res.json(result.errors)
        }
        else if (userExist){
            res.status(302) //found
            res.json({})
        }
        else {
            let user = new User({
                email: req.body.email,
                password: hashedPassword,
                accessToken
            })
           
            user.save()
            res.json(user)
        }
    }
    catch (err) {
        console.log(err)
    }

}

async function Login(req, res){

    console.log("Hand Login REQ.body:", req.body)
    let result = validationResult(req)
    console.log("Hand Login Validations:", result)

    try {

        let user = await User.findOne({email: req.body.email})
        let isItUser = await bcrypt.compare(req.body.password, user.password)

        if (isItUser) {
            res.json(user)
        }
        else {

            result.errors = result.errors.concat(
                [
                    {
                        msg: 'Email and password do not match!',
                        param: 'email',
                    },
                    {
                        msg: 'Email and password do not match!',
                        param: 'password'
                    }
                ]
            )

        }

        if (result.errors.length !== 0) {
            res.status(406) //Not acceptable
            res.json(result.errors)
        }
   
    }
    catch (err) {
        console.log(err)
    }
        
}

async function Events(req, res){
    console.log("Hand Event req.headers:", req.headers['x-authorization'])
    try {

        let user = await User.findOne({accessToken: req.headers['x-authorization']})
            .populate({
                path: "events",
                populate: {
                    path: "salads",
                    populate: "vote"
                    }
            })

        if (user && user.events.length > 0){

            let allEvents = await Event.find({ownerId: user._id})
                .populate("guests")
                .populate({
                    path: "salads",
                    populate: 'vote'
                })
                .populate({
                    path: "appetizers",
                    populate: 'vote'
                })
                .populate({
                    path: "mains",
                    populate: 'vote'
                })
                .populate({
                    path: "afterMeals",
                    populate: 'vote'
                })
                .populate({
                    path: "alcohols",
                    populate: 'vote'
                })
                .populate({
                    path: "softs",
                    populate: 'vote'
                })

           
            console.log(allEvents)
            res.status(200)
            res.json(allEvents)
        }
        else if (user && user.events.length == 0){
            res.status(204) // no content
            res.json({})
        }
        else {
            res.status(401) // unauthorized
            res.end()
        }
    }
    catch (err) {
        console.log(err)
    }
    
}

async function CreateEvent(req, res){
    console.log("Hand CreateEvent REQ.body:", req.body)
    console.log("Hand CreateEvent REQ.session:", req.session)

    try {

        // let isUserValid = await bcrypt.compare(req.session.user.email, req.headers['X-Authorization'])
        console.log('S:>>> Hand CreateEvent X-Authorization:', req.headers)
        let user = await User.findOne({accessToken: req.headers['x-authorization']})
        console.log('S:>>> Hand CreateEvent User:', user)

        if (user){
            
            let formDataClient = new formidable.IncomingForm()
            console.log('S:>>> Hand CreateEvent -> FORMDATA:', formDataClient);

            formDataClient.parse(req, (err, fields, files) => {
                console.log('S:>>> Hand CreateEvent: ERRORS:', err);
                console.log('S:>>> Hand CreateEvent: FIELDS:', fields);
                console.log('S:>>> Hand CreateEvent: FILES:', files);
                console.log('S:>>> Hand CreateEvent: FILES Keys:', Object.keys(files));

                let imgsNewPaths = []
                useService.appendImgInStaticUploads(files, imgsNewPaths)
    
                async function RecordINDataBase(){
                    
                    let [allSalads, allAppetizer, allMain, allAfter, allAlcohol, allSoft] = useService.getMenueFromForm(fields)

                    // const allSalads = Object.entries(fields).filter((Salad) => Salad[0].endsWith('-Salad') || Salad[0].endsWith('-Salad-recepie'))
                    mapedSalads =  await useService.recordMenuMeals(allSalads, 'allSalads')
                    mapedSalads = mapedSalads.filter(el => el)
                
                    // const allAppetizer = Object.entries(fields).filter((Appetizer) => Appetizer[0].endsWith('-Appetizer') || Appetizer[0].endsWith('-Appetizer-recepie'))
                    mapedAppetizer = await useService.recordMenuMeals(allAppetizer, 'allAppetizer')
                    mapedAppetizer = mapedAppetizer.filter(el => el)

                    // const allMain = Object.entries(fields).filter((Main) => Main[0].endsWith('-Main') || Main[0].endsWith('-Main-recepie'))
                    mapedMain = await useService.recordMenuMeals(allMain, 'allMain')
                    mapedMain = mapedMain.filter(el => el)

                    // const allAfter = Object.entries(fields).filter((After) => After[0].endsWith('-After') || After[0].endsWith('-After-recepie'))
                    mapedAfter = await useService.recordMenuMeals(allAfter, 'allAfter')
                    mapedAfter = mapedAfter.filter(el => el)

                    // const allAlcohol = Object.entries(fields).filter((Alcohol) => Alcohol[0].endsWith('-Alcohol'))
                    mapedAlcohol = await useService.recordMenuMeals(allAlcohol, 'allAlcohol', 'drink')
                    mapedAlcohol = mapedAlcohol.filter(el => el)

                    // const allSoft = Object.entries(fields).filter((Soft) => Soft[0].endsWith('-Soft'))
                    mapedSoft = await useService.recordMenuMeals(allSoft, 'allSoft', 'drink')
                    mapedSoft = mapedSoft.filter(el => el)
                    

                    let newEvent = new Event({
                        title: fields.title,
                        imageUrl: imgsNewPaths[0],
                        hints: fields.hints,
                        locations: fields.locations,
                        ownerId: user._id,
                        guests: [],
                        salads: mapedSalads,
                        appetizers: mapedAppetizer,
                        mains: mapedMain,
                        afterMeals: mapedAfter,
                        alcohols: mapedAlcohol,
                        softs: mapedSoft,
                    })

                    await newEvent.save()
                    user.events.push(newEvent)
                    await user.save()

                    res.status(200)
                    res.json(newEvent)

                }

                RecordINDataBase()
            })


        }
        else {
            res.status(401) // unauthorized
            res.end()
        }

    }
    catch (err) {
        console(err.message)
    }

}

async function UpdateEvent(req, res){

    console.log("Hand UpdateEvent REQ.params.eventId:", req.headers['X-Authorization'])

    try {

        let isUserValid = await User.findOne(req.headers['X-Authorization'])
        
        if (isUserValid){

            let eventToUpdate = await Event.findById(req.params.eventId)
                .populate("guests")
                .populate({
                    path: "salads",
                    populate: 'vote'
                })
                .populate({
                    path: "appetizers",
                    populate: 'vote'
                })
                .populate({
                    path: "mains",
                    populate: 'vote'
                })
                .populate({
                    path: "afterMeals",
                    populate: 'vote'
                })
                .populate({
                    path: "alcohols",
                    populate: 'vote'
                })
                .populate({
                    path: "softs",
                    populate: 'vote'
                })

            console.log('Hand Update -> Event Found:', eventToUpdate)
           
            if (eventToUpdate){

                //update event:
                let formDataClient = new formidable.IncomingForm()
                console.log('S:>>> Hand Update -> FORMDATA:', formDataClient);

                formDataClient.parse(req, (err, fields, files) => {
                    console.log('S:>>> Hand Update: ERRORS:', err);
                    console.log('S:>>> Hand Update: FIELDS:', fields);
                    console.log('S:>>> Hand Update: FILES:', files);
                    console.log('S:>>> Hand Update: FILES Keys:', Object.keys(files));

                    async function Update(){

                        if (Object.keys(files).length !== 0){
                            let imgsNewPaths = []
                            useService.deleteOldEventPicture(eventToUpdate.imageUrl)
                            useService.appendImgInStaticUploads(files, imgsNewPaths)
                            eventToUpdate.imageUrl = imgsNewPaths[0]
                            await eventToUpdate.save();
                        }

                        if (Object.keys(fields).length !== 0){

                            if (fields.title && (eventToUpdate.title !== fields.title)){
                                eventToUpdate.title = fields.title
                            }
                            if (fields.locations && (eventToUpdate.locations !== fields.locations)){
                                eventToUpdate.locations = fields.locations
                            }
                            if (fields.hints && (eventToUpdate.hints !== fields.hints)){
                                eventToUpdate.hints = fields.hints
                            }

                            await eventToUpdate.save()

                            let [newSalads, newAppetizer, newMain, newAfter, newAlcohol, newSoft] = useService.getMenueClientDataWithID(fields) 
                            //ex: allSalads -> [[title, value], [recepie, value], [id, value]]

                            let MealsMster = [
                                [eventToUpdate.salads, newSalads],
                                [eventToUpdate.appetizers, newAppetizer], 
                                [eventToUpdate.mains, newMain], 
                                [eventToUpdate.afterMeals, newAfter]
                            ]

                            let newObjToRecord = []

                            for (let [EventField, listTypeOfMeals] of MealsMster){
                                // listTypeOfDrinks -> [  [title, value], [recepie, value], [id, value], ...]
                                
                                for (let i=2; i < listTypeOfMeals.length; i++){
                                    
                                    if ((i+1) % 3 == 0){

                                        let mealId = listTypeOfMeals[i][1]
                                        let newRecepie = listTypeOfMeals[i-1][1]
                                        let newTitle = listTypeOfMeals[i-2][1]
                                        let updateThisMeal = EventField.map((obj) => obj._id === mealId)[0]

                                        if (!updateThisMeal) {
                                            newObjToRecord.push(listTypeOfMeals[i-2])
                                            newObjToRecord.push(listTypeOfMeals[i-1])
                                            continue
                                        }
                                        
                                        if (newTitle === updateThisMeal.title){
                                            updateThisMeal.title = newTitle
                                        }
                                        if (newRecepie === updateThisMeal.recepie){
                                            updateThisMeal.recepie = newRecepie
                                        }

                                    }
                                    
                                }
                            }

                            let DrinksMster = [
                                [eventToUpdate.alcohols, newAlcohol], 
                                [eventToUpdate.softs, newSoft]
                            ]
                            for (let [EventField, listTypeOfDrinks] of DrinksMster){
                                
                                for (let i=1; i < listTypeOfDrinks.length; i++){
                                    // listTypeOfDrinks -> [  [title, value], [id, value], [title, value], [id, value] ]

                                    if ((i+1) % 2 == 0){

                                        let drinkId = listTypeOfDrinks[i][1]
                                        let newTitle = listTypeOfDrinks[i-1][1]
                                        let updateThisDrink = EventField.map((obj) => obj._id === drinkId)[0]

                                        if (!updateThisDrink) {
                                            newObjToRecord.push(listTypeOfDrinks[i-1])
                                            continue
                                        }
                                        
                                        if (newTitle === updateThisDrink.title){
                                            updateThisDrink.title = newTitle
                                        }
                                       

                                    }
                                    
                                }
                            }

                            await eventToUpdate.save()

                            let newFields = Object.fromEntries(newObjToRecord)

                            let [allSalads, allAppetizer, allMain, allAfter, allAlcohol, allSoft] = useService.getMenueFromForm(newFields)

                            // const allSalads = Object.entries(fields).filter((Salad) => Salad[0].endsWith('-Salad') || Salad[0].endsWith('-Salad-recepie'))
                            mapedSalads =  await useService.recordMenuMeals(allSalads, 'allSalads')
                            mapedSalads = mapedSalads.filter(el => el)
                        
                            // const allAppetizer = Object.entries(fields).filter((Appetizer) => Appetizer[0].endsWith('-Appetizer') || Appetizer[0].endsWith('-Appetizer-recepie'))
                            mapedAppetizer = await useService.recordMenuMeals(allAppetizer, 'allAppetizer')
                            mapedAppetizer = mapedAppetizer.filter(el => el)

                            // const allMain = Object.entries(fields).filter((Main) => Main[0].endsWith('-Main') || Main[0].endsWith('-Main-recepie'))
                            mapedMain = await useService.recordMenuMeals(allMain, 'allMain')
                            mapedMain = mapedMain.filter(el => el)

                            // const allAfter = Object.entries(fields).filter((After) => After[0].endsWith('-After') || After[0].endsWith('-After-recepie'))
                            mapedAfter = await useService.recordMenuMeals(allAfter, 'allAfter')
                            mapedAfter = mapedAfter.filter(el => el)

                            // const allAlcohol = Object.entries(fields).filter((Alcohol) => Alcohol[0].endsWith('-Alcohol'))
                            mapedAlcohol = await useService.recordMenuMeals(allAlcohol, 'allAlcohol', 'drink')
                            mapedAlcohol = mapedAlcohol.filter(el => el)

                            // const allSoft = Object.entries(fields).filter((Soft) => Soft[0].endsWith('-Soft'))
                            mapedSoft = await useService.recordMenuMeals(allSoft, 'allSoft', 'drink')
                            mapedSoft = mapedSoft.filter(el => el)
                            
                    
                            eventToUpdate.salads = eventToUpdate.salads.concat(mapedSalads)
                            eventToUpdate.appetizers = eventToUpdate.appetizers.concat(mapedAppetizer)
                            eventToUpdate.mains = eventToUpdate.mains.concat(mapedMain)
                            eventToUpdate.afterMeals = eventToUpdate.afterMeals.concat(mapedAfter)
                            eventToUpdate.alcohols = eventToUpdate.alcohols.concat(mapedAlcohol)
                            eventToUpdate.softs = eventToUpdate.softs.concat(mapedSoft)
                            
        
                            await eventToUpdate.save()
                        
                            res.status(200)
                            res.json(eventToUpdate)
                            
                        }
                        else {
                            res.status(204)
                            res.json({})
                        }


                    }

                    Update()
                    
                })
                
            }

        }
        else {
            res.status(401)
            res.end()
        }

    }
    catch (err){
        console.log(err)
    }
    
}


let useHandler = {
    Register,
    Login,
    CreateEvent,
    UpdateEvent,
    Events
}

module.exports = useHandler;