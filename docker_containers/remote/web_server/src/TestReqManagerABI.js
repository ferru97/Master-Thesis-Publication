const ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dataFetchLinkCost",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_DRcontract",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_jobID",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_link",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkFulfilled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "msg",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "roundID",
        "type": "uint64"
      }
    ],
    "name": "DataReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "rId",
        "type": "uint64"
      }
    ],
    "name": "NewRequest",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DRcontract",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "OCRcontract",
    "outputs": [
      {
        "internalType": "contract TestOffchainAggregator",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TestNewRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currReq",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "requestID",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "functionCalls",
        "type": "uint256[]"
      },
      {
        "internalType": "string",
        "name": "pastValue",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "queueID",
        "type": "uint64"
      }
    ],
    "name": "dataCallback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dataFetchLinkCost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "functionCallsRequestsQueue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "fromBlockNumber",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "toBlockNumber",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "functionSignature",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_reqID",
        "type": "uint64"
      }
    ],
    "name": "getFunctionCallRequest",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "fromBlockNumber",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "toBlockNumber",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "contracts",
            "type": "address[]"
          },
          {
            "internalType": "address payable",
            "name": "user",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "functionSignature",
            "type": "string"
          },
          {
            "internalType": "uint256[]",
            "name": "functionCalls",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct TestRequestManager.FunctionCallsRequest",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_reqID",
        "type": "uint64"
      }
    ],
    "name": "getFunctionCallResult",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMaxRequestLINKCost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_reqID",
        "type": "uint64"
      }
    ],
    "name": "getPastValueRequest",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "blockNumber",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "referenceContract",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "propertyType",
            "type": "string"
          },
          {
            "internalType": "uint128",
            "name": "propertyIndex",
            "type": "uint128"
          },
          {
            "internalType": "string",
            "name": "pastValue",
            "type": "string"
          }
        ],
        "internalType": "struct TestRequestManager.PastValueRequest",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_reqID",
        "type": "uint64"
      }
    ],
    "name": "getRequest",
    "outputs": [
      {
        "components": [
          {
            "internalType": "contract ResultCallbackInterface",
            "name": "requester",
            "type": "address"
          },
          {
            "internalType": "uint128",
            "name": "dataHash",
            "type": "uint128"
          },
          {
            "internalType": "uint256",
            "name": "OCRstartTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "OCRendTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "dataReceivedTime",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "respondingOracle",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "linkPayed",
            "type": "uint256"
          },
          {
            "internalType": "enum TestRequestManager.RequestType",
            "name": "requestType",
            "type": "uint8"
          },
          {
            "internalType": "uint128",
            "name": "chainID",
            "type": "uint128"
          }
        ],
        "internalType": "struct TestRequestManager.Request",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "req_id",
        "type": "uint64"
      },
      {
        "internalType": "uint128",
        "name": "data_hash",
        "type": "uint128"
      },
      {
        "internalType": "uint256",
        "name": "link_payed",
        "type": "uint256"
      }
    ],
    "name": "hashCallback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "jobID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "link",
    "outputs": [
      {
        "internalType": "contract LinkTokenInterface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxReqTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fromBlockNumber",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "toBlockNumber",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "contracts",
        "type": "address[]"
      },
      {
        "internalType": "address payable",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "functionSignature",
        "type": "string"
      },
      {
        "internalType": "uint128",
        "name": "chainID",
        "type": "uint128"
      }
    ],
    "name": "observeFunctioncalls",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "referenceContract",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "propertyType",
        "type": "string"
      },
      {
        "internalType": "uint128",
        "name": "propertyIndex",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "chainID",
        "type": "uint128"
      }
    ],
    "name": "observePastValue",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "pastValueRequestsQueue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "referenceContract",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "propertyType",
        "type": "string"
      },
      {
        "internalType": "uint128",
        "name": "propertyIndex",
        "type": "uint128"
      },
      {
        "internalType": "string",
        "name": "pastValue",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ququeSize",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reqId",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "requestsQueue",
    "outputs": [
      {
        "internalType": "contract ResultCallbackInterface",
        "name": "requester",
        "type": "address"
      },
      {
        "internalType": "uint128",
        "name": "dataHash",
        "type": "uint128"
      },
      {
        "internalType": "uint256",
        "name": "OCRstartTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "OCRendTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "dataReceivedTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "respondingOracle",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "linkPayed",
        "type": "uint256"
      },
      {
        "internalType": "enum TestRequestManager.RequestType",
        "name": "requestType",
        "type": "uint8"
      },
      {
        "internalType": "uint128",
        "name": "chainID",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "setMaxReqTime",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "setOCRcontract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tryNewRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

function getABI(){
  return ABI
}

module.exports = {
  getABI: getABI,
}