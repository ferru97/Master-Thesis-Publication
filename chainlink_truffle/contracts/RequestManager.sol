pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;
import "./interfaces/OCRCallback.sol";
import "./interfaces/ResultCallback.sol";
import "./OffchainAggregator.sol";
import "./centralized-oracle-lib/ChainlinkClient.sol";
import "./ocr-lib/LinkTokenInterface.sol";


contract RequestManager is OCRCallbackInterface, ChainlinkClient {

    using Chainlink for Chainlink.Request;

    //Request Type
    enum RequestType{ FUN_CALLS, PAST_VALUE }

    // Struct representing a request
    struct Request{
        // static parameters
        ResultCallbackInterface requester;
        uint128 dataHash; //hash of amount deposited provided by OCR-SC
        uint256 OCRstartTime;
        uint256 OCRendTime;
        uint256 dataReceivedTime;
        address respondingOracle;
        uint256 linkPayed;
        RequestType requestType; //1=FunctionCallsRequest, 2=PastValueRequest
        uint128 chainID; 
    }

    struct FunctionCallsRequest{
        //input
        uint256 fromBlockNumber;
        uint256 toBlockNumber;
        address[] contracts;
        address payable user;
        string functionSignature;
        //output
        uint256[] functionCalls;
    }

    struct PastValueRequest{
        //input
        uint256 blockNumber;
        address referenceContract;
        string propertyType;
        uint128 propertyIndex;
        //output
        string pastValue;
    }
    

    event NewRequest(uint64 rId); //event emitted when OCR-SC start satisfying a new request
    event DataReceived(string msg, uint64 roundID); // event emitted when DR-SC returns a result
  
    //state variables used to manage the requests queue
    uint64 public reqId = 0;
    mapping(uint64 => Request) public requestsQueue;
    mapping(uint64 => FunctionCallsRequest) public functionCallsRequestsQueue;
    mapping(uint64 => PastValueRequest) public pastValueRequestsQueue;
    uint64 private firstReqID = 0;
    uint64 private lastReqID = 0;
    uint256 public maxReqTime;
    uint64 public currReq = 0;
   
    bytes32 public jobID; //jobID related to the work of the DR implemented by the oracles
    uint256 public dataFetchLinkCost; //cost in LINk of the DR job that provides the actual data given the hash
    address public DRcontract; //address of the system DR-SC contract
    OffchainAggregator public OCRcontract; //instance of the system OCR-SC contract
    LinkTokenInterface public link; //instance of the contact managing the LINK token


    /**
   * @notice Modifier usd to allow access to functions only to OCR-SC contract
   */
    modifier OnlyOCR() {
        require(msg.sender==address(OCRcontract), "Only the OCR contract can access this function");
        _;
    }

    /**
   * @notice Modifier usd to allow access to functions only to DR-SC contract
   */
    modifier OnlyDR() {
        require(msg.sender==address(DRcontract), "Only the DR contract can access this function");
        _;
    }

    /**
   * @notice Smart contract constructor 
   * @param _dataFetchLinkCost Cost of requesting the corresponding data of a given hash 
   * @param _DRcontract Address of the Operator.sol contract used to request data on a given hash 
   * @param _jobID JobID specified on the oracle to interact vith the Operator.sol
   * @param _link Link token address
   */
    constructor (uint256 _dataFetchLinkCost, address _DRcontract, bytes32 _jobID, address _link)
    {
        DRcontract = _DRcontract;
        dataFetchLinkCost = _dataFetchLinkCost;
        setChainlinkToken(_link);
        setChainlinkOracle(_DRcontract);
        jobID = _jobID;
        link = LinkTokenInterface(_link);
    }


    function observeFunctioncalls(uint256 fromBlockNumber, uint256 toBlockNumber, address[] calldata contracts, address payable user, string calldata functionSignature, uint128 chainID)
    public
    returns(uint64)
    {
        reqId++;
        lastReqID = reqId;
        Request memory newRequest = Request(ResultCallbackInterface(msg.sender), 0, 0, 0, 0, address(0), 0, RequestType.FUN_CALLS, chainID);
        FunctionCallsRequest memory newFunctionCallsRequest = FunctionCallsRequest(fromBlockNumber, toBlockNumber, contracts, user, functionSignature, new uint256[](0));
        requestsQueue[reqId] = newRequest;
        functionCallsRequestsQueue[reqId] = newFunctionCallsRequest;
        tryNewRound();
        return reqId;
    }

    function observePastValue(uint256 blockNumber, address referenceContract, string calldata propertyType, uint128 propertyIndex, uint128 chainID)
    public
    returns(uint64)
    {
        reqId++;
        lastReqID = reqId;
        Request memory newRequest = Request(ResultCallbackInterface(msg.sender), 0, 0, 0, 0, address(0), 0, RequestType.PAST_VALUE, chainID);
        PastValueRequest memory newPastValueRequest = PastValueRequest(blockNumber, referenceContract, propertyType, propertyIndex, "");
        requestsQueue[reqId] = newRequest;
        pastValueRequestsQueue[reqId] = newPastValueRequest;
        tryNewRound();
        return reqId;
    }

    /**
   * @notice Function called to check if OCR-SC is OCR-SC is available to satisfy a new request, and if it is, notify it of it
   */
    function tryNewRound()
    public
    {
        uint256 _now = block.timestamp;
        if( (currReq==0 || requestsQueue[currReq].OCRstartTime+maxReqTime<_now) && firstReqID<lastReqID ){
            firstReqID++;
            currReq = firstReqID;
            uint256 OCRcost = OCRcontract.maxRequestLinkCost();
            require(link.transferFrom(address(requestsQueue[currReq].requester), address(OCRcontract), OCRcost), 
                "Error: insufficient LINK to fund the OCR job");
            requestsQueue[currReq].linkPayed = OCRcost;
            requestsQueue[currReq].OCRstartTime = _now;
            OCRcontract.requestNewRound(address(requestsQueue[currReq].requester));
            emit NewRequest(firstReqID);
        }
    }



    function hashCallback(uint64 req_id, uint128 data_hash, uint256 link_payed)
    external
    override
    OnlyOCR
    {
       requestsQueue[req_id].dataHash = data_hash;
       requestsQueue[req_id].linkPayed -= link_payed;
       requestsQueue[req_id].OCRendTime = block.timestamp;
       requestActualData(req_id, data_hash); 
       currReq = 0;
       tryNewRound();
    }



    function requestActualData(uint64 req_id, uint128 data_hash) 
    internal
    {
        require(link.transferFrom(address(requestsQueue[req_id].requester), address(this), dataFetchLinkCost), 
            "Error: insufficient LINK to fund the Direct Request job");
        Chainlink.Request memory req = buildChainlinkRequest(jobID, address(this), this.dataCallback.selector);
        req.add("hash",uint2str(data_hash));
        req.add("rid",uint2str(req_id));
        sendChainlinkRequest(req, dataFetchLinkCost);
        requestsQueue[currReq].linkPayed += dataFetchLinkCost;
    }




    function dataCallback(bytes32 requestID, uint256[] calldata functionCalls, string calldata pastValue, address sender, uint64 queueID) 
    public
    OnlyDR
    {        
        require(requestsQueue[queueID].dataReceivedTime==0, "Error: data not needed");
        if(requestsQueue[queueID].requestType == RequestType.FUN_CALLS){
            require(hashResponseArray(functionCalls) == requestsQueue[queueID].dataHash, "Error: received value do not match the hash");
            functionCallsRequestsQueue[queueID].functionCalls = functionCalls;
        }else if (requestsQueue[queueID].requestType == RequestType.PAST_VALUE){
            uint128 dataHash = uint128(bytes16(keccak256(bytes(pastValue))));
            require(dataHash == requestsQueue[queueID].dataHash, "Error: received value do not match the hash");
            pastValueRequestsQueue[queueID].pastValue = pastValue;
        }
        requestsQueue[queueID].dataReceivedTime = block.timestamp;
        requestsQueue[queueID].respondingOracle = sender;
        //requestsQueue[queueID].requester.result(requestsQueue[queueID].user, amount, requestsQueue[currReq].linkPayed);
        emit DataReceived("New data received", queueID);
    }


    function hashResponseArray(uint256[] calldata values) internal pure returns (uint128) {
        string memory data = "";
        for (uint i=0; i<values.length; i++) {
            if (i>0){
            data = stringConcat(data, ",");
            }
            data = stringConcat(data, uint2str(values[i]));
        }
        bytes16 resHash = bytes16(keccak256(bytes(data)));
        return uint128(resHash);
    }


    // A serie of get & set functions

    function getRequest(uint64 _reqID)
    public
    view
    returns(Request memory)
    {
        return requestsQueue[_reqID];
    }

    function getFunctionCallRequest(uint64 _reqID)
    public
    view
    returns(FunctionCallsRequest memory)
    {
        return functionCallsRequestsQueue[_reqID];
    }

    function getFunctionCallResult(uint64 _reqID)
    public
    view
    returns(uint256[] memory)
    {
        return functionCallsRequestsQueue[_reqID].functionCalls;
    }

    function getPastValueRequest(uint64 _reqID)
    public
    view
    returns(PastValueRequest memory)
    {
        return pastValueRequestsQueue[_reqID];
    }


    function setOCRcontract(address addr)
    public
    {
        OCRcontract = OffchainAggregator(addr);
    }
    
    
    function setMaxReqTime(uint256 time)
    public
    {
        maxReqTime = time;
    }


    function ququeSize()
    external
    view
    returns(int)
    {
        return lastReqID - firstReqID;
    }


    function getMaxRequestLINKCost()
    public
    view
    returns(uint256)
    {
        return OCRcontract.maxRequestLinkCost()+dataFetchLinkCost;
    }



    // Utility Functions

    /**
   * @notice Function used to convert a unit to bytes
   * @param x uint number to convert to bytes
   */
    function toBytes(uint256 x) internal returns (bytes memory b) {
        b = new bytes(32);
        assembly { mstore(add(b, 32), x) }
    }


    /**
   * @notice Function used to convert a unit to string
   * @param _i uint number to convert to string
   */
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function stringConcat(string memory a, string memory b) internal pure returns (string memory) {

        return string(abi.encodePacked(a, b));

    }

}
