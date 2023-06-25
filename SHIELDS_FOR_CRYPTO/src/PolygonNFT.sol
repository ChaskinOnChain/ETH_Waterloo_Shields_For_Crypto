// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "sismo-connect-solidity/SismoLib.sol"; // <--- add a Sismo Connect import

contract PolygonNFT is ERC721, SismoConnect {
  error PolygonNFT__PaymentNotMet();
  using SismoConnectHelper for SismoConnectVerifiedResult;

  // add your appId as a constant
  bytes16 public constant APP_ID = 0x20b63fa47a248243eb4a4b3b6e893d67;
  // use impersonated mode for testing
  bool public constant IS_IMPERSONATION_MODE = true;

  bytes16 public constant COINBASE_SHIELD_HOLDER = 0x842e4d1671d72526762a77ade9feb49a;

  uint256 private _tokenId;
  string private _baseTokenURI;

  constructor(
    string memory baseTokenURI
  )
    ERC721("PolygonStandsWithCrypto", "PSWC")
    SismoConnect(buildConfig(APP_ID, IS_IMPERSONATION_MODE)) // <--- Sismo Connect constructor
  {
    _baseTokenURI = baseTokenURI;
  }

  function claimWithSismo(bytes memory response) public payable {
    if (msg.value < 0.01 ether) {
      revert PolygonNFT__PaymentNotMet();
    }
    SismoConnectVerifiedResult memory result = verify({
      responseBytes: response,
      // we want the user to prove that he owns a Sismo Vault
      // we are recreating the auth request made in the frontend to be sure that
      // the proofs provided in the response are valid with respect to this auth request
      auth: buildAuth({authType: AuthType.VAULT}),
      claim: buildClaim({groupId: COINBASE_SHIELD_HOLDER, claimType: ClaimType.GTE}),
      // we also want to check if the signed message provided in the response is the signature of the user's address
      signature: buildSignature({message: abi.encode(msg.sender)})
    });

    _safeMint(msg.sender, _tokenId);
    _tokenId++;
  }

  function _baseURI() internal view override returns (string memory) {
    return _baseTokenURI;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    _requireMinted(tokenId);
    return _baseTokenURI;
  }
}
