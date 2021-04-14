const CLASES_API_PATH = "/api/v1/clases";

//Cargar clases
const clasesJSON = require('./clases.json');
var ls_clases = Object.assign([],clasesJSON);



//Peticiones HTTP
module.exports.httpCRUD = (app) => {

    //GET: Colección Clases
    app.get(CLASES_API_PATH, (req,res) => {
        //res.status(200).send(JSON.stringify(ls_clases,null,2));
        res.status(200).json(ls_clases);

    });

    //GET: clase
    app.get(CLASES_API_PATH + "/:clase_nombre", (req,res) => {
        
        var {clase_nombre} = req.params;
        var claseJSON = {}


        for(var i = 0; i < ls_clases.length; i++){

            if(ls_clases[i].nombre == clase_nombre){
                claseJSON = Object.assign({},ls_clases[i]);
            }
        }

        if(Object.keys(claseJSON).length > 0){

            res.status(200).json(claseJSON);
        }else{
            res
            .status(404)
            .send('La clase no existe.')
        }
        
    });
}