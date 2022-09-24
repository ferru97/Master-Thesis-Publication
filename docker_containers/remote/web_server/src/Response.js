class Response{

    constructor() {
        this.roundID = 0;
        this.pastValue = ""
        this.dataHash = ""
        this.OCRresponse = ""
        this.functionCalls = []
        this.dataType = 0
    }

    setFunctionCalls(functionCalls){
        this.functionCalls = functionCalls
        this.dataType = 0
    }

    setPastValue(pastValue){
        this.pastValue = pastValue.toString()
        this.dataType = 1
    }

    setDataHash(hash){
        this.dataHash = hash
    }

    setOCRresponse(OCRresponse){
        this.OCRresponse = OCRresponse
    }

    setRoundID(roundID){
        this.roundID = roundID
    }

    getData(){
        switch(this.dataType){
            case 0:
                return this.functionCalls
            case 1:
                return this.pastValue
            default:
                return 0
        }
    }

    getJSONresponse(){
        return JSON.stringify(this)
    }

}

module.exports = Response