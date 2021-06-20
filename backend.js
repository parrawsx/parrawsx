/*———— Imports ————*/
//express
const express = require("express");
const myConection = require('express-myconnection');  

const app = express();
//body parser
const bodyParser = require("body-parser");
//mysql
const mysql = require('mysql');
//path
const path = require('path');
//rutas 
const v1 = require("./src/routes/v1");
//logger
const logger = require("./src/utils/logger");
//morgan
const morgan = require("morgan");
//moment-timezone
const moment = require("moment-timezone");

// Paquete HTTP & HTTPS
const http = require('http');
const https = require('https');
// Paquete FileSystem
const fs = require('fs');

// Certificados
const privateKey = fs.readFileSync('./certs/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./certs/cert.pem', 'utf8');
const ca = fs.readFileSync('./certs/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

/*————Conexion BD————*/
app.use(myConection(mysql, {
    host: "127.0.0.1",     
    port: '3306',  
    user: "root", 
    password: "1QAws3ED_", 
    database: "proyecto_tienda"
  },'single'));
  app.use (express.urlencoded({extended:true}));

/*———— Morgan Timezone ————*/
morgan.token("date", (req, res, tz) => {
    return moment().tz(tz).format();
});
morgan.format(
    "idamFormat",
    ':remote-addr [:date[Europe/Madrid]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
);


/*———— API Logger ————*/
app.use(morgan("idamFormat", { stream: logger.morgan }));


/*———— API acepta JSON y RAW ————*/
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.raw({ type: "images/*"}));
app.use (bodyParser.urlencoded ({extended: true}));


/*———— API archivos estaticos del servidor ————*/
app.use('/public', express.static('public'));


/*———— API CORS permitidas ————*/
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, Content-type, Authorization");
    next();
});

/*———— API rutas ————*/
app.use("/", v1);

/*———— API manejo de rutas indefinidas ————*/
app.all("*", (req, res) => res.status(404).json({ success: false, message: "Lost much?" }));


/*———— API manejo de errores de rutas ————*/
app.use(function (err, req, res, next) {
    res.status(err.statusCode || 500).send(err.json || { success: false, message: "Something went wrong" });
    logger.error(
        "%s - %s - %s - %s - %s: \n %O",
        err.statusCode || 500,
        err.json ? err.json.message : err.message,
        req.originalUrl,
        req.method,
        req.ip,
        err
    );
});

/*———— API Servidor web ————*/
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(80);
httpsServer.listen(443);
