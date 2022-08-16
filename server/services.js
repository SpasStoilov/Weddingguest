const fs = require("fs/promises");
const After = require("./models/afters.js")
const Alcohol = require("./models/alcohols.js")
const Appeteizer = require("./models/appetizer.js")
const Main = require("./models/mains.js")
const Salad = require("./models/salads")
const Soft = require("./models/softs.js")

function appendImgInStaticUploads(files, imgsNewPaths) {
    for (let Img of Object.keys(files)){

        const originalName = files[Img].originalFilename;
        const oldPath = files[Img].filepath;

        // check if name is true because we allowed when we do editing of VR temp to enter empty names!)
        if (originalName){

            let ID = (Math.random() * (10**20)).toFixed() + '-' + (Math.random() * (10**20)).toFixed() + '-' + (Math.random() * (10**20)).toFixed();

            const newPath = './static/useruploads/'+ `ID-${ID}-end$` + originalName;
            const reducedNewPath = '/useruploads/'+ `ID-${ID}-end$` + originalName;

            try {
                fs.copyFile(oldPath, newPath);
                imgsNewPaths.push(reducedNewPath);
            } catch (err) {
                console.log(err.message);
            };
        };
        //-----------------------------------------------------------------------------------------------

    };
}





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
    
    async function SaveMenu(meal, index){
        try {

            if (index % 2 === 0 || drink === 'drink'){
                Obj = new modelsGuide[guideMark]()
                Obj.title = meal[1]
                
                if (drink === 'drink'){
                    await Obj.save()
                    return Obj
                }
            }
            else {
                Obj.recepie = meal[1]
                await Obj.save()
                return Obj
            }

        }
        catch (err) {
            throw err
        }
    }

    let listPromise = Promise.all(mealList.map((meal, index) => SaveMenu(meal, index)))
    return listPromise

}


const useService = {
    appendImgInStaticUploads,
    recordMenuMeals
}

module.exports = useService