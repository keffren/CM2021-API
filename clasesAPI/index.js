const CLASES_API_PATH = "/api/v1/clases";

//Cargar clases

module.exports.loadDB = (app, db) => {
    let initData = require ('./clases');
    
    app.get(CLASES_API_PATH + "/loadInitialData", (req,res) => {

        //In case there are resources
        db.remove({},{ multi: true });

        db.insert(initData, (err, dataAdded) => {
            if(err){
                console.error('--ClasesAPI:\n  ERROR : the class hasn´t inserted into DataBase!');
                res.sendStatus(500);
            }else{
                console.log('--ClasesAPI:\n  Class inserted into DataBase')
                res
                .status(201)
                .json({ message : `<${dataAdded.length}> The class has been inserted into DB`});
            }
        })
    });
};



//Peticiones HTTP
module.exports.httpCRUD = (app,db) => {


    //####################################################    Requests of collection ../clases

    //GET: Colección Clases
    app.get(CLASES_API_PATH, (req,res) => {
        /*
        db.find({}, (err, clases) => {
            if(err){
                console.error('--ClasesAPi:\n  ERROR : accessing DB in GET(../hostelries)');
                res.sendStatus(500);
            }else{
                //res.send(JSON.stringify(resources,null,2));
                var classToSend = clases.map( (c) =>{
                    delete c._id;   //   ==   delete r["_id"];
                    return c;
                });
                res
                .status(200)
                .json(classToSend);
            }
        })
        */
        db.find({}).sort({id : 1}).exec((err,resources) => {
            if(err){
                console.error('--ClasesAPi:\n  ERROR : accessing DB in GET(../hostelries)');
                res.sendStatus(500);
            }else{
                //res.send(JSON.stringify(resources,null,2));
                var classToSend = resources.map( (c) =>{
                    delete c._id;   //   ==   delete r["_id"];
                    return c;
                });
                res
                .status(200)
                .json(classToSend);
            }
        })
    });

    //POST
    app.post(CLASES_API_PATH, (req,res) => {
        var newResource = req.body;

        //check if the resource to add exists
        db.find({nombre : newResource.nombre},
            (err, resourcesInDB) =>{
                if(err){
                    console.error('--ClasesAPI:\n  ERROR : accessing DB in POST');
                    res.sendStatus(500);
                }else{
                    if(Object.keys(resourcesInDB).length == 0){

                        /*
                        if(!newResource.id || !newResource.nombre ||!newResource.proficiencias || !newResource.habilidad_esp
                                || !newResource.equipo_inicial || !newResource.dinero_inicial || !newResource.info_clase
                                
                                
                                || Object.keys(newResource).length != 7){
                        */
                        if(Object.keys(newResource).length != 7){

                                    console.error(`--ClasesAPI:\n  Post fail -> [400]`);
                                    res
                                    .status(400)
                                    .json({message : 'Bad request, check json params.'})
                        }else{
                            console.log(`--ClasesAPI:\n  new resource <${newResource.nombre}> added`);
                            db.insert(newResource);
                            res
                            .status(201)
                            .json(newResource);
                        }                        
                    }else{
                        console.error(`--ClasesAPI:\n  Post fail -> [409]`);
                        res
                        .status(409)
                        .json({message: 'The resource exists!'});
                    }
                }
            }
        );
    });

    //PUT
    app.put(CLASES_API_PATH, (req,res) => {
        console.error('--ClasesAPI:\n  ERROR : Method not allowed');
        res.sendStatus(405);
    });

    //DELETE
    app.delete(CLASES_API_PATH, (req,res) => {
        // Removing all documents with the 'match-all' query
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if(err){
                console.error(`--ClasesAPI:\n  ERROR : <${err}>`);
            }else{
                console.log(`--ClasesAPI:\n  <${numRemoved}> Clases ha sido eliminado`);
                res
                .status(200)
                .json({ message: `<${numRemoved}> Clases ha sido eliminado de la DB`});
            }
        });

    });

    //####################################################################   Request per each resource


    //GET: clase/nombre
    app.get(CLASES_API_PATH + "/:clase_nombre", (req,res) => {
        
        var {clase_nombre} = req.params;        
        
        db.find({nombre : clase_nombre}, (err,clases) =>{
            if(err){
                console.error(`--Clases:\n  ERROR : accessing DB in GET(../clases/${clase_nombre})`);
                res.sendStatus(500);
            }else{
                if(Object.keys(clases).length > 0){
                    var clasesToSend = clases.map( (c) =>{
                        delete c._id;   //   ==   delete r["_id"];
                        return c;
                    });
                    res
                    .status(200)
                    .json(clasesToSend[0]);
                }else{
                    res
                    .status(404)
                    .send('The resource doesn´t exist.');
                }
            }
        })        
    });
    
    //POST
    app.post(CLASES_API_PATH + "/:clase_nombre", (req,res) => {
        console.error('--ClasesAPI:\n  ERROR : Method not allowed');
        res.sendStatus(405);
    });

    app.delete(CLASES_API_PATH + "/:clase_nombre", (req,res) => {
        var {clase_nombre} = req.params;

        db.remove({nombre: clase_nombre}, { multi: true }, (err, numRemoved) => {
            if(err){
                console.error(`--ClasesAPI:\n  ERROR : <${err}>`);
            }else{
                if(numRemoved == 0){
                    res
                    .status(404)
                    .json({ message: `The collection <${clase_nombre}> doesn´t exist`});
                }else{
                    console.log(`--ClasesAPI:\n  <${numRemoved}> Resources has been deleted`);
                    res
                    .status(200)
                    .json({ message: `<${numRemoved}> Resources have been deleted`});
                }
            }
        });
    });

    //Select JSON format in  POSTMAN !!!!!!!!!!
    app.put(CLASES_API_PATH + "/:clase_nombre", (req,res) => {
        var {clase_nombre} = req.params;


        db.update({nombre : clase_nombre},
            {
                /* In case to set all values of the resource
                $set: {district :req.body.district,
                    year : req.body.year,
                    employee_staff: req.body.employee_staff,
                    establishment_open: req.body.establishment_open,
                    traveler_numer: req.body.traveler_numer}
                */
                $set: {proficiencias : req.body.proficiencias, habilidad_esp : req.body.habilidad_esp,
                        equipo_inicial : req.body.equipo_inicial, info_clase : req.body.info_clase}
            },
            {},
            (err, numReplaced) => {
                if(err){
                    console.error(`--ClasesAPI:\n  ERROR : <${err}>`);
                    res.sendStatus(500);
                }else{
                    if(numReplaced == 0){
                        res
                        .status(404)
                        .json({ message: "The resource you are looking for does not exist "});

                    }else if(Object.keys(req.body).length != 7){

                                    console.error(`--ClasesAPI:\n  Put fail -> [400]`);
                                    res
                                    .status(400)
                                    .json({message : 'Bad request, check json params.'});

                    }else if (req.body.nombre != clase_nombre){
                        console.error(`--ClasesAPI:\n  Put fail -> [409]`);
                        res
                        .status(409)
                        .json({message : 'Conflict, check the resource identifier.'});  

                    }else{
                        res
                        .status(200)
                        .json(req.body);
                    }
                }
            }
        );
    });
}