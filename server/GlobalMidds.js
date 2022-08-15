const esepressSession = require('express-session');


function GlobalMidllewares(server, express) {

    console.log('S:>>> GlobalMiddlewares acting...')

    // --------- middlewere settings -------------:

    const expressSessionConfig = {
        secret: "someKey",
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    }

    // --------- middleware using here -------------:
         //express.json() middle - parses req body from json to object:
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));
         //--------
    server.use(express.static('./static'));
    server.use(esepressSession(expressSessionConfig))

    server.use((req, res, next) =>{
        console.log("HIIIIII")
        res.header('Access-Controll-Allow-Origin', '*');
        res.header('Access-Controll-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.header('Access-Controll-Allow-Header', 'Content-Type, X-Authorization');
        next();
    });
    

};

module.exports = GlobalMidllewares;