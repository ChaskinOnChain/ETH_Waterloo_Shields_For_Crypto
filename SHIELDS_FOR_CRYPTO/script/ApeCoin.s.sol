// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {ApeCoin} from "src/ApeCoin.sol";

contract DeployApeCoin is Script {
  function run() public {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    ApeCoin apeCoin = new ApeCoin();
    console.log("Contract deployed at", address(apeCoin));
    vm.stopBroadcast();
  }
}
