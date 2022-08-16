const { validationResult } = require("express-validator");
const formidable = require("formidable")
const bcrypt = require('bcrypt');
const User = require("./models/user.js")
const Event = require("./models/events.js")
const Guest = require("./models/guests")
const useService = require("./services.js")

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

                    const allSalads = Object.entries(fields).filter((Salad) => Salad[0].endsWith('-Salad') || Salad[0].endsWith('-Salad-recepie'))
                    let mapedSalads =  await useService.recordMenuMeals(allSalads, 'allSalads')
                    mapedSalads = mapedSalads.filter(el => el)
                
                    const allAppetizer = Object.entries(fields).filter((Appetizer) => Appetizer[0].endsWith('-Appetizer') || Appetizer[0].endsWith('-Appetizer-recepie'))
                    let mapedAppetizer = await useService.recordMenuMeals(allAppetizer, 'allAppetizer')
                    mapedAppetizer = mapedAppetizer.filter(el => el)

                    const allMain = Object.entries(fields).filter((Main) => Main[0].endsWith('-Main') || Main[0].endsWith('-Main-recepie'))
                    let mapedMain = await useService.recordMenuMeals(allMain, 'allMain')
                    mapedMain = mapedMain.filter(el => el)

                    const allAfter = Object.entries(fields).filter((After) => After[0].endsWith('-After') || After[0].endsWith('-After-recepie'))
                    let mapedAfter = await useService.recordMenuMeals(allAfter, 'allAfter')
                    mapedAfter = mapedAfter.filter(el => el)

                    const allAlcohol = Object.entries(fields).filter((Alcohol) => Alcohol[0].endsWith('-Alcohol'))
                    let mapedAlcohol = await useService.recordMenuMeals(allAlcohol, 'allAlcohol', 'drink')
                    mapedAlcohol = mapedAlcohol.filter(el => el)

                    const allSoft = Object.entries(fields).filter((Soft) => Soft[0].endsWith('-Soft'))
                    let mapedSoft = await useService.recordMenuMeals(allSoft, 'allSoft', 'drink')
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
    console.log("Hand UpdateEvent REQ.body:", req.body)
    let isUserValid = await bcrypt.compare(req.session.user.email, req.headers['X-Authorization'])
    if (isUserValid){
        res.json({})
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