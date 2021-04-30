const RAZAS_API_PATH = "/api/v1/razas";

//Cargar clases

module.exports.loadDB = (app, db) => {
    let initData = require ('./razas');
    
    app.get(RAZAS_API_PATH + "/loadInitialData", (req,res) => {

        //In case there are resources
        db.remove({},{ multi: true });

        db.insert(initData, (err, dataAdded) => {
            if(err){
                console.error('--RazasAPI:\n  ERROR : problema de conexion con la Base de DAtos!');
                res.sendStatus(500);
            }else{
                console.log('--RazasAPI:\n  Raza añadida a la Base de Datos')
                res
                .status(201)
                .json({ message : `<${dataAdded.length}> La razas iniciales han sido añadidas a la DB`});
            }
        })
    });
};

//Peticiones HTTP : Solo un get a la colección  ya que no se hará uso de las demás peticiones CRUD

module.exports.httpCRUD = (app,db) => {

    //GET: Colección Clases
    app.get(RAZAS_API_PATH, (req,res) => {

        db.find({}).sort({id : 1}).exec((err,resources) => {
            if(err){
                console.error('--RazasAPi:\n  ERROR : problema de acceso a la DB con GET(../hostelries)');
                res.sendStatus(500);
            }else{
                //res.send(JSON.stringify(resources,null,2));
                var raceToSend = resources.map( (r) =>{
                    delete r._id;   //   ==   delete r["_id"];
                    return r;
                });
                res
                .status(200)
                .json(raceToSend);
            }
        })
    });
}