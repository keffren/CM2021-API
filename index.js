//imports
var express = require("express");
var path = require("path");
const { json } = require("body-parser");
var Datastore = require('nedb');

//Attributes
const PORT = (process.env.PORT || 1607);

//Start of the application
var app = express();
app.use(express.json());


//Static navigation
app.use("/", express.static(path.join(__dirname + "/public"))); 

//Import API: Razas
var razasAPI = require('./razasAPI');
var razasDB = new Datastore();
razasAPI.loadDB(app,razasDB);
razasAPI.httpCRUD(app,razasDB);

//Import API: CLases
var clasesAPI = require("./clasesAPI");
var clasesDB = new Datastore();
clasesAPI.loadDB(app,clasesDB);
clasesAPI.httpCRUD(app,clasesDB);



//Server running
app.listen(PORT, () =>{
    console.log("Server running at port:" + PORT);
});