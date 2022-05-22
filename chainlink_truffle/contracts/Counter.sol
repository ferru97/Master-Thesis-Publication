// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Counter {
  uint256 public count;
  uint256 private countPrivate;
  string public test;


  constructor() public {}

  function increment() public {
    count += 1;
    countPrivate += 1;
  }

  function increment(uint value) public {
    count += value;
    countPrivate += value;
  }

  function setTest(string calldata value) public {
    test = value;
  } 

}
