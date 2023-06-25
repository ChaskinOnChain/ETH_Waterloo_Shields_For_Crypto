// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {GnosisNFT} from "src/GnosisNFT.sol";

contract DeployGnosisNFT is Script {
  function run() public {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    GnosisNFT GnosisNFT = new GnosisNFT(
      "ipfs://bafybeifdifn5dmxlpwa5ilay7ghvxirbtgfd2q66p7lsm7hxschyi3otzq/"
    );
    console.log("NFT Contract deployed at", address(GnosisNFT));
    vm.stopBroadcast();
  }
}
