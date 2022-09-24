const express = require('express');
const keccak256 = require('keccak256')
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const bc = require('./bc_api');
const Response = require('./Response');

const config = {
    name: 'sample-express-app',
    port: 3000,
    host: '0.0.0.0',
};

const app = express();
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: false }));

let oraclesSavedData = new Map(); //<rid,Map<oid,Response>>
function saveOracleData(oid, response){
    if(oraclesSavedData[response.roundID]==undefined)
        oraclesSavedData[response.roundID] = new Map()

    var roundMap = oraclesSavedData[response.roundID]
    roundMap[oid] = response

    console.log("\nNew data saved:\n\tOracle: "+oid
                        +"\n\tRound: "+response.roundID
                        +"\n\tData hash: "+response.dataHash
                        +"\n\tData: "+response.getData())
}


function getSavedData(rid, oid, hash){
    if(oraclesSavedData[rid]==undefined || (oraclesSavedData[rid])[oid]==undefined){
        throw new Error('Value not set');
    }
    var oracleResponse = (oraclesSavedData[rid])[oid]
    if(oracleResponse.dataHash == hash){
        //return oracleResponse.getData()
        return oracleResponse.getJSONresponse()
    } else {
        throw new Error('Hash does not match: expected='+hash+" found="+oracleResponse.dataHash); 
    }

}



app.get('/getDataHash', (req, res)=>{

    oid = req.query.oid;
    req_manager = req.query.reqmanager;
    
    if(req_manager==undefined || oid==undefined){
        res.status(404).send('Error 1: incorrect parameters');
        return
    }

    bc.getDataHash(req_manager, res).then(response => {
        if(response.roundID != 0){
            saveOracleData(oid, response)
            res.status(200).send(response.OCRresponse);
        }
        else{
            res.status(400).send('Error 2: Bad response');
        }
    })
    
})


app.post('/getSavedData', (req, res)=>{

    hash = req.body.hash
    oid = req.body.oid
    rid = req.body.rid
    if(oid==undefined || rid==undefined || hash==undefined){
        res.status(404).send('Error 3: incorrect parameters');
        return
    }

    try{
        var value = getSavedData(rid, oid, hash)
        console.log("\n"+oid+' successfully retreived data for round '+rid+": "+value)
        res.set('Content-Type', 'application/json');
        res.status(200).send(value)
    } catch(e){
        res.status(404).send(e.toString())
    }

})

app.get('/test', (req, res)=>{
    res.status(200).send("ok")
})





app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
