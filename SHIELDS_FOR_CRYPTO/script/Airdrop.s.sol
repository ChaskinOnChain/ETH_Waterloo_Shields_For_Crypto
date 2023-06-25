// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {Airdrop} from "src/Airdrop.sol";

contract DeployAirdrop is Script {
  function run() public {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    Airdrop airdrop = new Airdrop("Shield", "SHIELD");
    console.log("Airdrop Contract deployed at", address(airdrop));
    vm.stopBroadcast();
  }
}
