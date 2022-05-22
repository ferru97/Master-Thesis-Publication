const Web3 = require('web3');
const reqManagerABI = require('./ReqManagerABI.js');
const keccak256 = require('keccak256')
const Response = require('./Response')

//const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/99b562d80026460c830b5b4e853be5a1"));
const web3_1337 = new Web3(new Web3.providers.HttpProvider(process.env.CHAIN_1337));
const web3_1338 = new Web3(new Web3.providers.HttpProvider(process.env.CHAIN_1338));  


function setWeb3(chainID){
    switch(chainID) {
        case "1337":
          return web3_1337
        case "1338":
          return web3_1338
        default:
          throw new Error('Unsupported chain id');
    }
}



async function getDataHash(req_manager, res){
    var response = new Response();
    try{
        const managerContract = await new web3.eth.Contract(reqManagerABI.getABI(), req_manager)
        const currReq = await managerContract.methods.currReq.call().call()
        if(currReq == "0"){
            throw new Error("No requests available");
        }
             
        const request = await managerContract.methods.getRequest(currReq).call()
        const requestType = request.requestType;
        const chainID = request.chainID;
        const web3 = setWeb3(chainID)

        var result;
        if(requestType == 0){
            const functionCallsrequest = await managerContract.methods.getFunctionCallRequest(currReq).call()
            const user = functionCallsrequest.user
            const contracts = (functionCallsrequest.contracts).map(c => c.toString())
            const fromBlockNumber = functionCallsrequest.fromBlockNumber
            const toBlockNumber = functionCallsrequest.toBlockNumber
            const functionSignature = functionCallsrequest.functionSignature
            result = await countFunctionsCalls(fromBlockNumber, toBlockNumber, user, contracts, functionSignature, web3)
            response.setFunctionCalls(result)
        } else if(requestType == 1){
            const pastValuerequest = await managerContract.methods.getPastValueRequest(currReq).call()
            const blockNumber = pastValuerequest.blockNumber
            const contract = pastValuerequest.referenceContract
            const propertyIndex = pastValuerequest.propertyIndex
            const propertyType = pastValuerequest.propertyType
            result = await checkPastValue(contract, blockNumber, propertyType, propertyIndex, web3)
            response.setPastValue(result)
        } else {
            throw new Error('Unsupported Type');
        }

        var dataHash = keccak256(result.toString()).toString('hex')
        var dataHash128 = BigInt('0x' + dataHash.substring(0,32));
        var OCRresponse = (BigInt(currReq)*(BigInt(2)**BigInt(128)))+dataHash128

        response.setRoundID(currReq)
        response.setDataHash(dataHash128.toString())
        response.setOCRresponse(OCRresponse.toString())
        return response
        
    }catch(error){
        console.log(error)
        response.setRoundID(0)
        return response; 
    }
}


async function countFunctionsCalls(fromBlockNumber, toBlockNumber, user, contracts, functionSignature, web3){
    var encodedFunctionSignature = web3.eth.abi.encodeFunctionSignature(functionSignature);
    var output = new Array(contracts.length).fill(0);
    var block = await web3.eth.getBlock(fromBlockNumber)
    while(block.number <= toBlockNumber){
        for (let i = 0; i < block.transactions.length; i++) {
            let transaction = await web3.eth.getTransaction(block.transactions[i])
            if(transaction.from == user && isPresent(contracts, transaction.to) 
                && transaction.input.toString().startsWith(encodedFunctionSignature)){
                    output[contracts.indexOf(transaction.to)] += 1
            }
        }
        block = await web3.eth.getBlock(block.number + 1)
    }
    return output
}


async function checkPastValue(contract, blockNumber, type, index, web3){
    var value = await web3.eth.getStorageAt(contract, index, blockNumber)
    console.log(value)
    switch(type) {
        case "string":
          return web3.utils.toAscii(value)
        case "number":
          return web3.utils.toDecimal(value)
        default:
          throw new Error('Unsupported type');
    }
}


function isPresent(array_val, value){
    for (let i = 0; i < array_val.length; i++) {
        if(array_val[i] == value)
            return true
    }
    return false
}



module.exports = {
    getDataHash: getDataHash,
 }
