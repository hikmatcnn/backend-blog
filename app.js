//Read Environment Variables
require('dotenv').config();
// const apm = require('elastic-apm-node').start({
//     serverUrl: 'http://172.10.10.72:8200',
//     // secretToken: 'SGRVV1Q1QUJZcnJ5T2NQQVppTUw6WkMzSDFVc3FUSy1qN0wwT19IOENJZw==',
//     serviceName: 'TIKOMDIK-api-tracer-bencana',
//     // // apiKey: 'apm-server',
//     environment: process.env.NODE_ENV
// });

const express = require('express');
const app = express();
const fs = require('fs'); 
const useragent = require('express-useragent');
const fileupload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

require('moment/locale/id.js');
require('module-alias/register');

//Define Keys
key = require('./app/config/app.conf');

//Panggil Path Node
const app_path = require('path');

//SET GLOBAL VARIABLE APP ROOT
global.__appRoot = app_path.resolve(__dirname);

//Setup Logger
const { setupLogging } = require("@root/app/utils/Logger.util");

//Setup API Docs
const { setupDocs } = require("@root/app/utils/Docs.util");

//Setup Routes
const routerIndex = require('@root/app/routes/App.route');

try {
    const listPathStorage = [
        "logs",
        "tmp/downloads"
    ];
    for (value of listPathStorage) {
        if (!fs.existsSync(app_path.join(__dirname, value))) {
            fs.mkdirSync(app_path.join(__dirname, value), { recursive: true });
        }
    }
} catch (err) {
    console.error(err);
}

// User Agent
app.use(useragent.express());

//Body-Parser using for catching body parser (just in case needed)
app.use(bodyParser.urlencoded({limit: "50mb", extended: false, parameterLimit:50000}));
app.use(bodyParser.json({limit: "50mb"}));

//express-fileupload using for file upload
app.use(fileupload({ useTempFiles: true, tempFileDir: './tmp', createParentPath: false }));

//CORS using for cross origin
app.use(cors());
app.options('*', cors());

//Run Docs
setupDocs(app, app_path);

/**route which should handle
 * Add route in here
 */
app.use('/', routerIndex);

//Run Logger
setupLogging(app, app_path.join(__dirname, "logs"));

//Handling incorrect url & db con error
app.use((req, res, next) => {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    console.error("Error Route -> " + req.originalUrl);
    console.error(error);
    if(process.env.NODE_ENV != 'production'){
        res.status(error.status || 500).send({
            message: error.message,
            detail: error.data
        });
    }else{
        res.status(error.status || 500).send({
            message: error.message
        });
    }
});

//module export
module.exports = app;