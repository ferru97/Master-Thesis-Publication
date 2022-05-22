// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Decode {

  uint256 public value = 222674612520120847769739984565459710017;


  constructor() public {}


  function hash(uint256[] calldata values) public pure returns (uint128) {

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
      uint k = len - 1;
      while (_i != 0) {
          bstr[k--] = byte(uint8(48 + _i % 10));
          _i /= 10;
      }
      return string(bstr);
  }

  function stringConcat(string memory a, string memory b) internal pure returns (string memory) {

    return string(abi.encodePacked(a, b));

  }

}
