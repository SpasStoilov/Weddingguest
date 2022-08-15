const startDataBase = require("./dataBaseConfig.js");
const express = require("express");
const GlobalMidllewares = require("./GlobalMidds.js");
const router = require("./router.js");


async function Main(){
    try {
        // Starting DataBase:
        await startDataBase();

        // SERVER:
        const server = express();
        server.listen(3030, () => console.log("Express working on port  3030"));

        // Global middlewares:
        GlobalMidllewares(server, express);
    
        console.log("FFFFFF")

        // Rounter:
        router(server);
    }
    catch(err){
        console.log(err.message)
    }
}

Main()