
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "base64-sol/base64.sol";

contract momentNFT is ERC721URIStorage {
  using SafeMath for uint256;

  uint public tokenCounter; 

  constructor() ERC721 ("Moment NFT", "momentNFT") {
    tokenCounter = 0 ;
  }

  function create(string memory svg) public {
    _safeMint(msg.sender, tokenCounter);
    string memory imageURI = svgToImageURI(svg);
    tokenCounter = tokenCounter.add(1) ; 
  }

  function svgToImageURI(string memory svg) public pure returns (string memory){
    string memory baseURI = "data:image/svg+xml;base64,";
    string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))))  ; 
    string memory imageURI = string(abi.encodePacked(baseURI,svgBase64Encoded));
    return imageURI;
  }

  
}