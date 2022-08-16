const fs = require("fs/promises");

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


const useService = {
    appendImgInStaticUploads,
}

module.exports = useService