// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {ApeCoinNFT} from "src/ApeCoinNFT.sol";

contract DeployApeCoinNFT is Script {
  function run() public {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    ApeCoinNFT apeCoinNFT = new ApeCoinNFT(
      "ipfs://bafybeiecrmg6uhxckqk26pmgea2lgtj2mu5py7kqylo7p6bpfbdrztlwqe/",
      0x0F988cf15c0B090653E8E97ef404a6f758822BC7
    );
    console.log("NFT Contract deployed at", address(apeCoinNFT));
    vm.stopBroadcast();
  }
}
