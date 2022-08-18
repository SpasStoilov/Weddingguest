const fs = require("fs/promises");
const After = require("./models/afters.js")
const Alcohol = require("./models/alcohols.js")
const Appeteizer = require("./models/appetizer.js")
const Main = require("./models/mains.js")
const Salad = require("./models/salads")
const Soft = require("./models/softs.js")

async function appendImgInStaticUploads(files, imgsNewPaths) {

    for (let Img of Object.keys(files)){

        const originalName = files[Img].originalFilename;
        const oldPath = files[Img].filepath;

        // check if name is true because we allowed when we do editing of VR temp to enter empty names!)
        if (originalName){

            let ID = (Math.random() * (10**20)).toFixed() + '-' + (Math.random() * (10**20)).toFixed() + '-' + (Math.random() * (10**20)).toFixed();
            
            const newPath = './static/useruploads/'+ `ID-${ID}-end$` + originalName;
            const reducedNewPath = 'http://localhost:3030/useruploads/'+ `ID-${ID}-end$` + originalName;
            
            try {
                await fs.copyFile(oldPath, newPath);
                imgsNewPaths.push(reducedNewPath);
                return imgsNewPaths
            } catch (err) {
                console.log(err.message);
            };
        };
        //-----------------------------------------------------------------------------------------------

    };
}

// function recordMenuMeals(mealList, guideMark, drink=false){

//     const modelsGuide = {
//         allSalads: Salad,
//         allAppetizer: Appeteizer,
//         allMain: Main,
//         allAfter: After,
//         allAlcohol: Alcohol,
//         allSoft: Soft,
//     }
    
//     let Obj;
    
//     async function SaveMenu(meal, index){
//         try {

//             if (index % 2 === 0 || drink === 'drink'){
//                 Obj = new modelsGuide[guideMark]()
//                 Obj.title = meal[1]
                
//                 if (drink === 'drink'){
//                     await Obj.save()
//                     return Obj
//                 }
//             }
//             else {
//                 Obj.recepie = meal[1]
//                 await Obj.save()
//                 return Obj
//             }

//         }
//         catch (err) {
//             throw err
//         }
//     }

//     let listPromise = Promise.all(mealList.map((meal, index) => SaveMenu(meal, index)))
//     return listPromise

// }

function recordMenuMeals(mealList, guideMark, drink=false){

    const modelsGuide = {
        allSalads: Salad,
        allAppetizer: Appeteizer,
        allMain: Main,
        allAfter: After,
        allAlcohol: Alcohol,
        allSoft: Soft,
    }
    
    let Obj;
    
    let listNewMeals = mealList.map((meal, index) => {
        
        if (index % 2 === 0 || drink === 'drink'){
            Obj = new modelsGuide[guideMark]()
            Obj.title = meal[1]
            
            if (drink === 'drink'){
                Obj.save()
                return Obj
            }
        }
        else {
            Obj.recepie = meal[1]
            Obj.save()
            return Obj
        }
       
    }).filter(el => el)

    return listNewMeals
}

async function deleteOldEventPicture(imageOldUrl){
    
    const cutStartIndex = ('http://localhost:3030/').length
    const path = imageOldUrl.slice(cutStartIndex)
    console.log('Delete Event Img on path: ', path)
    try {
        await fs.unlink(`/Js/react-demo/server/static/${path}`)
    }
    catch (err){
        console.log(err.message)
    }
 
}

function getMenueFromForm(fields){

    console.log(Object.entries(fields))
    
    const allSalads = Object.entries(fields).filter((Salad) => Salad[0].endsWith('-Salad') || Salad[0].endsWith('-Salad-recepie'))
    
    const allAppetizer = Object.entries(fields).filter((Appetizer) => Appetizer[0].endsWith('-Appetizer') || Appetizer[0].endsWith('-Appetizer-recepie'))
    

    const allMain = Object.entries(fields).filter((Main) => Main[0].endsWith('-Main') || Main[0].endsWith('-Main-recepie'))
    

    const allAfter = Object.entries(fields).filter((After) => After[0].endsWith('-After') || After[0].endsWith('-After-recepie'))
    
    const allAlcohol = Object.entries(fields).filter((Alcohol) => Alcohol[0].endsWith('-Alcohol'))
    
    const allSoft = Object.entries(fields).filter((Soft) => Soft[0].endsWith('-Soft'))
    
    return [allSalads, allAppetizer, allMain, allAfter, allAlcohol, allSoft]
    
}

function getMenueClientDataWithID(fields){

    const allSalads = Object.entries(fields).filter(
        (Salad) => Salad[0].endsWith('-Salad') || Salad[0].endsWith('-Salad-recepie') || 
        Salad[0].endsWith('-Salad-ID')
    )

    const allAppetizer = Object.entries(fields).filter(
        (Appetizer) => Appetizer[0].endsWith('-Appetizer') || Appetizer[0].endsWith('-Appetizer-recepie') || Appetizer[0].endsWith('-Appetizer-ID')
    )
    

    const allMain = Object.entries(fields).filter(
        (Main) => Main[0].endsWith('-Main') || Main[0].endsWith('-Main-recepie') || 
        Main[0].endsWith('-Main-ID')
    )
    

    const allAfter = Object.entries(fields).filter(
        (After) => After[0].endsWith('-After') || After[0].endsWith('-After-recepie') || 
        After[0].endsWith('-After-ID')
    )
    
    const allAlcohol = Object.entries(fields).filter(
        (Alcohol) => Alcohol[0].endsWith('-Alcohol') || Alcohol[0].endsWith('-Alcohol-ID')
    )
    
    const allSoft = Object.entries(fields).filter(
        (Soft) => Soft[0].endsWith('-Soft') || Soft[0].endsWith('-Soft-ID')
    )
    
    return [allSalads, allAppetizer, allMain, allAfter, allAlcohol, allSoft]
}

async function DeleteMealFromDataBase(ID, Type){

    const dict = {
        'After': After, 
        'Alcohol': Alcohol,
        'Appeteizer': Appeteizer, 
        'Main': Main,
        'Salad': Salad,
        'Soft': Soft, 
    }


    try {
        console.log(`DELETE FROM THIS TYPE - ${Type}:`, dict[Type])
        await dict[Type].deleteOne({_id: ID})
    }
    catch (err){
        console.log(err.message)
    }

}


function AppendMealInEvent(ALL, Event){

    const dict = {
        'afters': Event.afterMeals, 
        'alcohols': Event.alcohols,
        'appetizers': Event.appetizers, 
        'mains': Event.mains,
        'salads': Event.salads,
        'softs': Event.softs, 
    }


    for (let [ListObj, Type] of ALL){

        for(let obj of ListObj){
            dict[Type].push(obj)
        }
    }
 
}

const useService = {
    appendImgInStaticUploads,
    recordMenuMeals,
    deleteOldEventPicture,
    getMenueFromForm,
    getMenueClientDataWithID,
    DeleteMealFromDataBase,
    AppendMealInEvent
}

module.exports = useService