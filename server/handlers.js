const { validationResult } = require("express-validator");
const formidable = require("formidable")
const bcrypt = require('bcrypt');
const User = require("./models/user.js")
const Event = require("./models/events.js")
const Guest = require("./models/guests")
const useService = require("./services.js");
const { response } = require("express");
const Salad = require("./models/salads.js")

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
        console.log("ERROR: ", err)
        res.status(404)
        res.json({message:err.message})
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

                async function RecordINDataBase(){

                    let imgsNewPaths = []
                    imgsNewPaths = await useService.appendImgInStaticUploads(files, imgsNewPaths)
                    
                    let [allSalads, allAppetizer, allMain, allAfter, allAlcohol, allSoft] = useService.getMenueFromForm(fields)

                    allSalads =  useService.recordMenuMeals(allSalads, 'allSalads')

                    allAppetizer = useService.recordMenuMeals(allAppetizer, 'allAppetizer')
  
                    allMain = useService.recordMenuMeals(allMain, 'allMain')
 
                    allAfter = useService.recordMenuMeals(allAfter, 'allAfter')
      
                    allAlcohol = useService.recordMenuMeals(allAlcohol, 'allAlcohol', 'drink')
                    
                    allSoft = useService.recordMenuMeals(allSoft, 'allSoft', 'drink')
                    
                    console.log("allSalads:", allSalads)
                    console.log("allMains:", allMain)
                    console.log("allAppetazior:", allAppetizer)
                    console.log("allAfter:", allAfter)
                    console.log("allAlcohols:", allAlcohol)
                    console.log("allSoft:", allSoft)

                    let newEvent = new Event({
                        title: fields.title,
                        imageUrl: imgsNewPaths[0],
                        hints: fields.hints,
                        locations: fields.locations,
                        ownerId: user._id,
                        guests: [],
                        salads: [...allSalads],
                        appetizers: [...allAppetizer],
                        mains: [...allMain],
                        afterMeals: [...allAfter],
                        alcohols: [...allAlcohol],
                        softs: [...allSoft],
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

    console.log("Hand UpdateEvent X-Authorization:", req.headers['x-authorization'])

    try {

        let isUserValid = await User.findOne({accessToken:req.headers['x-authorization']})
        
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

                       
                        if (Object.keys(files).length !== 0 && files.imageUrl.originalFilename){
                           
                            let imgsNewPaths = []

                            console.log("Old IMGURL:", eventToUpdate.imageUrl)

                            if (eventToUpdate.imageUrl){
                                await useService.deleteOldEventPicture(eventToUpdate.imageUrl)
                            }

                            imgsNewPaths = await useService.appendImgInStaticUploads(files, imgsNewPaths)
                            console.log("New Path IMG Upate: ", imgsNewPaths[0])
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


                            let [newSalads, newAppetizer, newMain, newAfter, newAlcohol, newSoft] = useService.getMenueClientDataWithID(fields) 
                            //ex: allSalads -> [[title, value], [recepie, value], [id, value]]

                            const masterMenuFields = newSalads.concat(newAppetizer, newAppetizer, newMain, newAfter, newAlcohol, newSoft)
                            console.log("MasterField: ", masterMenuFields)

                            if (masterMenuFields.length !== 0){

                                let MealsMster = [
                                    [eventToUpdate.salads, newSalads, "Salad"],
                                    [eventToUpdate.appetizers, newAppetizer, "Appetizer"], 
                                    [eventToUpdate.mains, newMain, 'Main'], 
                                    [eventToUpdate.afterMeals, newAfter, "After"]
                                ]

                                let newObjToRecord = []
                                
                                for (let [EventField, listTypeOfMeals, Type] of MealsMster){
                                    // listTypeOfDrinks -> [  [title, value], [recepie, value], [id, value], ...]

                                    let existingMealsToDelete = [...EventField]

                                    console.log("LOOP ATTR:", EventField, listTypeOfMeals, Type)
                                    
                                    for (let i=2; i < listTypeOfMeals.length; i++){
                                        
                                        if ((i+1) % 3 == 0){

                                            let mealId = listTypeOfMeals[i][1]

                                            console.log("ID UPDATE: ", mealId)

                                            let newRecepie = listTypeOfMeals[i-1][1]
                                            let newTitle = listTypeOfMeals[i-2][1]
                                            let updateThisMeal = EventField.filter(obj => obj._id == mealId)[0]

                                            console.log("UPDATES THIS MEAL: ", updateThisMeal)

                                            if (!updateThisMeal) {
                                                newObjToRecord.push(listTypeOfMeals[i-2])
                                                newObjToRecord.push(listTypeOfMeals[i-1])
                                                continue
                                            }

                                            existingMealsToDelete = existingMealsToDelete.filter(obj => obj._id != mealId)

                                            console.log(`OLD titel ${updateThisMeal.title} - NewTitle ${newTitle}`)
                                            

                                            if (newTitle !== updateThisMeal.title){
                                                updateThisMeal.title = newTitle
                                                console.log(`NEW TITLE HIT: `, newTitle)
                                            }
                                            if (newRecepie !== updateThisMeal.recepie){
                                                updateThisMeal.recepie = newRecepie
                                                console.log(`NEW RECEPIE HIT:`, updateThisMeal.recepie)
                                            }
                                            await updateThisMeal.save()

                                        }
                                        
                                    }

                                    console.log('existingMealsToDelete:', existingMealsToDelete)
                                    console.log('existingMealsToDelete:',existingMealsToDelete.length !== 0)

                                    if (existingMealsToDelete.length !== 0){
                                    
                                        let lastIndex = EventField.length - 1
                                        let counter = 0
                                        let i = 0

                                        while (counter <= lastIndex) {
                                            let obj = EventField[i]

                                            let checkForObj = existingMealsToDelete.filter(objTodel => objTodel._id == obj._id)[0]

                                            if (checkForObj){
                                                
                                                console.log("checkForObj TO DELETE: ", checkForObj)
                                                
                                                EventField.splice(i, 1)
                                                
                                                console.log("NEW EVENT FIELD: ", EventField)
                                                useService.DeleteMealFromDataBase(checkForObj._id, Type)
                                            }
                                            else {
                                                i++
                                            }

                                            counter++;
                                        };
                                        
                                    }



                                }

                                let DrinksMster = [
                                    [eventToUpdate.alcohols, newAlcohol, "Alcohol"], 
                                    [eventToUpdate.softs, newSoft, "Soft"]
                                ]

                                for (let [EventField, listTypeOfDrinks, Type] of DrinksMster){
                                    
                                    let existingDrinksToDelete = [...EventField]
                                    console.log("LOOP ATTR:", EventField, listTypeOfDrinks, Type)

                                    for (let i=1; i < listTypeOfDrinks.length; i++){
                                        // listTypeOfDrinks -> [  [title, value], [id, value], [title, value], [id, value] ]

                                        if ((i+1) % 2 == 0){

                                            let drinkId = listTypeOfDrinks[i][1]

                                            console.log("ID UPDATE: ", drinkId)

                                            let newTitle = listTypeOfDrinks[i-1][1]
                                            let updateThisDrink = EventField.filter((obj) => obj._id == drinkId)[0]
                                            
                                            console.log("UPDATES THIS MEAL: ", updateThisDrink)

                                            if (!updateThisDrink) {
                                                newObjToRecord.push(listTypeOfDrinks[i-1])
                                                continue
                                            }

                                            existingDrinksToDelete = existingDrinksToDelete.filter(obj => obj._id != drinkId)
                                            
                                            if (newTitle !== updateThisDrink.title){
                                                updateThisDrink.title = newTitle
                                            }
                                            await updateThisDrink.save()
                                        
                                        }
                                        
                                    }

                                    console.log('existingDrinksToDelete:', existingDrinksToDelete)
                                    console.log('existingDrinksToDelete:', existingDrinksToDelete.length !== 0)

                                    if (existingDrinksToDelete.length !== 0){
                                    
                                        let lastIndex = EventField.length - 1
                                        let counter = 0
                                        let i = 0

                                        while (counter <= lastIndex) {

                                            let obj = EventField[i]

                                            let checkForObj = existingDrinksToDelete.filter(objTodel => objTodel._id == obj._id)[0]

                                            if (checkForObj){
                                                
                                                console.log("checkForObj TO DELETE: ", checkForObj)
                                                
                                                EventField.splice(i, 1)
                                                
                                                console.log("NEW EVENT FIELD: ", EventField)
                                                useService.DeleteMealFromDataBase(checkForObj._id, Type)
                                            }
                                            else {
                                                i++
                                            }

                                            counter++;
                                        }
                                    }
                                }


                                console.log("NEW OBJ TO RECORD:", newObjToRecord)

                                let newFields = Object.fromEntries(newObjToRecord)

                                let [allSalads, allAppetizer, allMain, allAfter, allAlcohol, allSoft] = useService.getMenueFromForm(newFields)

                                allSalads =  useService.recordMenuMeals(allSalads, 'allSalads')
                             
                                allAppetizer = useService.recordMenuMeals(allAppetizer, 'allAppetizer')
                            
                                allMain = useService.recordMenuMeals(allMain, 'allMain')
                               
                                allAfter = useService.recordMenuMeals(allAfter, 'allAfter')
                            
                                allAlcohol = useService.recordMenuMeals(allAlcohol, 'allAlcohol', 'drink')
                        
                                allSoft = useService.recordMenuMeals(allSoft, 'allSoft', 'drink')
                               
                                const ALL = [
                                    [allSalads,'salads'], 
                                    [allAppetizer, 'appetizers'], 
                                    [allMain, 'mains'], 
                                    [allAfter, 'afters'], 
                                    [allAlcohol, 'alcohols'], 
                                    [allSoft, 'softs']
                                ]

                                console.log(allSalads,'salads') 
                                console.log(allAppetizer, 'appetizers') 
                                console.log(allMain, 'mains')
                                console.log(allAfter, 'afters') 
                                console.log(allAlcohol, 'alcohols')
                                console.log(allSoft, 'softs')

                                useService.AppendMealInEvent(ALL, eventToUpdate)
  
                            }

                        }

                        await eventToUpdate.save()
                        res.status(200)
                        res.json(eventToUpdate)

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

async function DeleteEvent(req, res){
    
    console.log("Hand DELETEvent X-Authorization:", req.headers['x-authorization'])
    
    try {
        
        let isUserValid = await User.findOne({accessToken: req.headers['x-authorization']}).populate('events')
        
        if (isUserValid){

            let eventToDELETE = await Event.findById(req.params.eventId)
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

            const listsOfObjToDelete = [
                [eventToDELETE.afterMeals, 'After'], 
                [eventToDELETE.alcohols, 'Alcohol'],
                [eventToDELETE.appetizers, 'Appeteizer'], 
                [eventToDELETE.mains, 'Main'],
                [eventToDELETE.salads, 'Salad'],
                [eventToDELETE.softs, 'Soft'],
                // eventToDELETE.guests, 
            ]

            if (eventToDELETE.imageUrl){
                await useService.deleteOldEventPicture(eventToDELETE.imageUrl)
            }

            for (let [list, Type] of listsOfObjToDelete){
                for (let obj of list){
                    console.log(`Obj.id: ${obj._id} - Type: ${Type}`)
                    useService.DeleteMealFromDataBase(obj._id, Type)
                }
            }

            let indexToDel = isUserValid.events.indexOf(eventToDELETE)
            isUserValid.events.splice(indexToDel, 1)
            await isUserValid.save()

            await Event.deleteOne({_id: eventToDELETE._id})
            res.status(200)
            res.end()
        }
    }
    catch(err){
        console.log(err)
    }
}

async function GetEvent(req, res){
    
    console.log("Hand Get Event ID:", req.params.eventId)
    
    try {

        let eventToExtract = await Event.findById(req.params.eventId)
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
        
        if (eventToExtract) {
            res.status(302) // found
            res.json(eventToExtract)
        }
        else {
            throw new Error("Event was not Found!")
        }
 
    }
    catch(err){
        console.log(err.message)
        res.status(404)
        res.end()
    }
}

async function AppendVote(req, res){
    
    console.log("Hand AppendVote Event Id:", req.params.eventId)
    console.log("Hand AppendVote Req.body:", req.body)
    console.log("Hand AppendVote req.headers['x-authorization']:", req.headers['x-authorization'])

    try {

    
        let eventToVote = await Event.findById(req.params.eventId)
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

        if (!eventToVote){
            throw new Error('Event is not Found!')
        }

        let isGuestValid = await Guest.findOne({accessToken: req.headers['x-authorization']})

        if (!isGuestValid){

            const accessToken = await bcrypt.hash(req.body.email, saltRounds);

            let newGuest = new Guest({
                name: req.body.guestName,
                email: req.body.email,
                accessToken
            })

            await newGuest.save()
            isGuestValid = newGuest
            console.log("New Guest is Made:", isGuestValid)
        }
        
        console.log("eventToVote.guests:", eventToVote.guests)
        console.log("isGuestValid._id:", isGuestValid._id)

        const isInEvent = eventToVote.guests.filter(obj => obj._id.equals(isGuestValid._id))[0]
        console.log("isInEvent:", isInEvent)

        if (!isInEvent){
            eventToVote.guests.push(isGuestValid)
            await eventToVote.save()
            console.log("Append new Guest to event:", eventToVote.guests)
        }

        const DICTMENU = {
            'afterMeals': eventToVote.afterMeals, 
            'appetizers': eventToVote.appetizers, 
            'mains': eventToVote.mains,
            'salads': eventToVote.salads,
            'alcohols': eventToVote.alcohols,
            'softs': eventToVote.softs,
        }

        const listOfreqBodyValues = Object.values(req.body)

        for (let [fieldName, fieldValue] of Object.entries(req.body)){

            if (fieldName == "email" || fieldName == "guestName"){
                continue
            }

            let pattern = /(?<=-)[a-z M]+$/
            let patternIdDrink = /^\w+(?=-[a-z M]+$)/

            let matchDrinkId = fieldName.match(patternIdDrink)
            let matchMealType = fieldName.match(pattern)

            let listMeals;
          
            let idDrink = matchDrinkId ? matchDrinkId[0] : false

            if (matchMealType){
                let Type = matchMealType[0]
                listMeals = DICTMENU[Type]
            }

            console.log("Vote listMeals: ", listMeals)
            console.log("Vote idDrink: ", idDrink)
           
            if (listMeals){

                // if titles are unique no probllem
                await Promise.all(listMeals.map(async function(obj){

                    console.log("TITLE:", obj.title)

                    let votes = obj.vote
                    const isGuestVoted = votes.filter(obj => obj._id.equals(isGuestValid._id))[0]

                    let ruleOne = !idDrink 
                        ? obj.title == fieldValue && !isGuestVoted 
                        : obj._id.toString() == idDrink && !isGuestVoted

                    let ruleTwo = !idDrink 
                        ? obj.title != fieldValue && isGuestVoted
                        : obj._id.toString() != idDrink && !listOfreqBodyValues.includes(obj.title) && isGuestVoted
                    
                    console.log("obj.title", obj.title)
                    console.log("listOfreqBodyValues", listOfreqBodyValues)
                    console.log("!listOfreqBodyValues.includes(obj.title)", !listOfreqBodyValues.includes(obj.title))
                    console.log("obj._id.toString() != idDrink", obj._id.toString() != idDrink)
                    console.log("1:", ruleOne)
                    console.log("2:", ruleTwo)
                    
                    if (ruleOne){
                        votes.push(isGuestValid)
                        console.log("New votes after push:", votes)
                    }
                    else if (ruleTwo){
                        const indexG = votes.filter((obj, index) => {
                            if(obj._id.equals(isGuestValid._id)){
                                return index
                            }
                        })[0]

                        console.log("Index Of meal to del:", indexG)
                        votes.splice(indexG, 1) 
                        console.log("New votes after del:", votes)
                    }

                    return await obj.save()
                    
                }))
                
            }

        }

        await eventToVote.save()
        res.json(isGuestValid)

    }
    catch (err) {
        console.log(err)
        res.status(404)
        res.json({message: err.message})
    }

}

let useHandler = {
    Register,
    Login,
    CreateEvent,
    UpdateEvent,
    Events,
    DeleteEvent,
    GetEvent,
    AppendVote
}

module.exports = useHandler;