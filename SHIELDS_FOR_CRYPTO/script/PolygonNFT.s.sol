// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {PolygonNFT} from "src/PolygonNFT.sol";

contract DeployPolygonNFT is Script {
  function run() public {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    PolygonNFT polygonNFT = new PolygonNFT(
      "ipfs://bafybeifgtjzwaomuzchrzqscvvfxmrggmdklacctjcsspwzosozqclrmfa/"
    );
    console.log("NFT Contract deployed at", address(polygonNFT));
    vm.stopBroadcast();
  }
}
