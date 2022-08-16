const esepressSession = require('express-session');
const cors = require('cors')
const cookieParser = require('cookie-parser');

async function GlobalMidllewares(server, express) {

    console.log('S:>>> GlobalMiddlewares acting...')

    // --------- middleware using here -------------:
         //express.json() middle - parses req body from json to object:
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));
         //--------
    server.use(express.static('/Js/react-demo/server/static/'));
    server.use(esepressSession({
        secret: "someKey",
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    }))
    
    server.use(cookieParser());
    server.use(cors())
};

module.exports = GlobalMidllewares;