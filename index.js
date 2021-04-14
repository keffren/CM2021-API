//imports
var express = require("express");
var path = require("path");
const { json } = require("body-parser");

//Attributes
const PORT = (process.env.PORT || 1607);



//Start of the application
var app = express();
app.use(express.json());


//Static navigation
app.use("/", express.static(path.join(__dirname + "/public"))); 

//Import API: Razas

//Import API: CLases
var clasesAPI = require("./clasesAPI")
clasesAPI.httpCRUD(app);



//Server running
app.listen(PORT, () =>{
    console.log("Server running at port:" + PORT);
});