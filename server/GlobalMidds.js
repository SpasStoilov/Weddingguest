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

};

module.exports = GlobalMidllewares;