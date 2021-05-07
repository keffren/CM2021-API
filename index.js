//imports
var express = require("express");
var path = require("path");
const { json } = require("body-parser");
var Datastore = require('nedb');

//Attributes
const PORT = (process.env.PORT || 1607);

//Inicializar DB antes de arrancar app
var razasDB = new Datastore();

    let initRazasData = require("./razasAPI/razas");
    razasDB.insert(initRazasData, (err, dataAdded) => {
        if(err){
            console.error('--RazasAPI:\n  ERROR : the race hasn´t inserted into DataBase!');
        }else{
            console.log('--RazaAPI:\n  Race inserted into DataBase')
        }
    });

var clasesDB = new Datastore();

    let initClasesData = require("./clasesAPI/clases");
    clasesDB.insert(initClasesData, (err, dataAdded) => {
        if(err){
            console.error('--ClasesAPI:\n  ERROR : the class hasn´t inserted into DataBase!');
        }else{
            console.log('--ClasesAPI:\n  Class inserted into DataBase')
        }
    });

//Start of the application
var app = express();
app.use(express.json());

//Static navigation
app.use("/", express.static(path.join(__dirname + "/public"))); 

//Import API: Razas
var razasAPI = require('./razasAPI');
razasAPI.loadDB(app,razasDB);
razasAPI.httpCRUD(app,razasDB);

//Import API: CLases
var clasesAPI = require("./clasesAPI");

clasesAPI.loadDB(app,clasesDB);
clasesAPI.httpCRUD(app,clasesDB);

//Server running
app.listen(PORT, () =>{
    console.log("Server running at port:" + PORT);
});