
pragma solidity ^0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract momentNFT is ERC721 {
  using SafeMath for uint256;

  uint public tokenCounter; 
  string public svgTop ;
  string public svgBot ; 
  mapping (uint256 => uint8) public timeZone; 

  event CreatedMomentNFT(uint256 indexed tokenId);

  constructor() ERC721 ("Moment NFT", "momentNFT") {
    tokenCounter = 0 ;
    svgTop = ' <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">    <def>      <style>      .minute-arm {        fill: none;        stroke: #A3A3A3;        stroke-width: 6;        stroke-miterlimit: 8;      }      .hour-arm {        fill: none;        stroke: #fff;        stroke-width: 6;        stroke-miterlimit: 8;      }      #minute,#hour {        transform-origin: 200px 200px;      }    </style>    </def>    <rect width="400" height="400" fill="white" />    <circle cx="200" cy="200" r="147" stroke="black" stroke-width="6" />    <circle cx="200" cy="200" r="145" fill="black" stroke="#393939" stroke-width="2" />    <mask id="mask0_7_61" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="61" y="61" width="278" height="278">      <rect x="198" y="61" width="4" height="38" fill="#C4C4C4" />      <rect x="198" y="301" width="4" height="38" fill="#C4C4C4" />      <rect x="61" y="202" width="4" height="38" transform="rotate(-90 61 202)" fill="#C4C4C4" />      <rect x="301" y="202" width="4" height="38" transform="rotate(-90 301 202)" fill="#C4C4C4" />      <rect x="132.232" y="321.378" width="4" height="38" transform="rotate(-150 132.232 321.378)" fill="#C4C4C4" />      <rect x="252.232" y="113.531" width="4" height="38" transform="rotate(-150 252.232 113.531)" fill="#C4C4C4" />      <rect x="80.6224" y="271.232" width="4" height="38" transform="rotate(-120 80.6224 271.232)" fill="#C4C4C4" />      <rect x="288.469" y="151.232" width="4" height="38" transform="rotate(-120 288.469 151.232)" fill="#C4C4C4" />      <rect x="78.6224" y="132.232" width="4" height="38" transform="rotate(-60 78.6224 132.232)" fill="#C4C4C4" />      <rect x="286.469" y="252.232" width="4" height="38" transform="rotate(-60 286.469 252.232)" fill="#C4C4C4" />      <rect x="271.232" y="319.378" width="4" height="38" transform="rotate(150 271.232 319.378)" fill="#C4C4C4" />      <rect x="151.232" y="111.531" width="4" height="38" transform="rotate(150 151.232 111.531)" fill="#C4C4C4" />    </mask>    <g mask="url(#mask0_7_61)">      <mask id="mask1_7_61" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="45" y="41" width="324" height="316">        <rect x="45" y="41" width="324" height="316" fill="url(#paint0_linear_7_61)" />      </mask>      <g mask="url(#mask1_7_61)">        <rect x="13" y="9" width="387" height="359" fill="#F584FF" />        <g filter="url(#filter0_f_7_61)">          <circle cx="82.5" cy="117.5" r="117.5" fill="#FF84CE" />        </g>        <g filter="url(#filter1_f_7_61)">          <circle cx="349.5" cy="239.5" r="117.5" fill="#84A7FF" />        </g>        <g filter="url(#filter2_f_7_61)">          <circle cx="113.5" cy="345.5" r="117.5" fill="#E09191" />        </g>      </g>    </g> ';
    svgBot = '<circle cx="200" cy="200" r="5" fill="white" />    <defs>      <filter id="filter0_f_7_61" x="-135" y="-100" width="435" height="435" filterUnits="userSpaceOnUse"        color-interpolation-filters="sRGB">        <feFlood flood-opacity="0" result="BackgroundImageFix" />        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />        <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_7_61" />      </filter>      <filter id="filter1_f_7_61" x="132" y="22" width="435" height="435" filterUnits="userSpaceOnUse"        color-interpolation-filters="sRGB">        <feFlood flood-opacity="0" result="BackgroundImageFix" />        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />        <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_7_61" />      </filter>      <filter id="filter2_f_7_61" x="-104" y="128" width="435" height="435" filterUnits="userSpaceOnUse"        color-interpolation-filters="sRGB">        <feFlood flood-opacity="0" result="BackgroundImageFix" />        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />        <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_7_61" />      </filter>      <linearGradient id="paint0_linear_7_61" x1="207" y1="41" x2="207" y2="357" gradientUnits="userSpaceOnUse">        <stop stop-color="#FF84CE" />        <stop offset="1" stop-color="#923DFF" />      </linearGradient>    </defs>  </svg>';
  }

  function create(string memory _svg) public {
    _safeMint(msg.sender, tokenCounter);
    emit CreatedMomentNFT(tokenCounter);
    tokenCounter = tokenCounter.add(1) ; 
  }

  function setTimeZone(uint8 _timeZone, uint tokenId) public {
    timeZone[tokenId] = _timeZone ; 
  }

  function svgToImageURI(string memory _svg) public pure returns (string memory){
    string memory baseURI = "data:image/svg+xml;base64,";
    string memory svgBase64Encoded = base64(bytes(string(abi.encodePacked(_svg))))  ; 
    string memory imageURI = string(abi.encodePacked(svgBase64Encoded));
    return imageURI;
  }

  function formatTokenURI(string memory _imageURI)public pure returns(string memory){
    string memory baseURL = "data:application/json;base64,";
    return string(abi.encodePacked(
      
      Base64.encode(
        bytes(abi.encodePacked(
          '{"name":"Moment NFT",',
          '"description": "Fully on-chain clock NFT that shows you the current time",',
          '"time-zone":"",',
          '"image":"',_imageURI,'"}')
        )
      )
    ));
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
    string memory svgMid = ' <g id="minute">      <path class="minute-arm" d="M200 200V78" />      <circle class="sizing-box" cx="200" cy="200" r="130" />    </g>    <g id="hour">      <path class="hour-arm" d="M200 200V140" />      <circle class="sizing-box" cx="200" cy="200" r="130" />    </g>  ';
    string memory svg = string(abi.encodePacked(svgTop, svgMid, svgBot )) ; 
    string memory imageURI = svgToImageURI(svg) ;
    string memory json = base64(bytes(abi.encodePacked('{"name": "Moment NFT", "description": "Fully on-chain clock NFT that shows you the current time.", "image": "data:image/svg+xml;base64,',imageURI ,'"}')));
    return string(abi.encodePacked('data:application/json;base64,', json));
  }

  function base64(bytes memory data) internal pure returns (string memory) {
    bytes memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    uint256 len = data.length;
    if (len == 0) return "";

    // multiply by 4/3 rounded up
    uint256 encodedLen = 4 * ((len + 2) / 3);

    // Add some extra buffer at the end
    bytes memory result = new bytes(encodedLen + 32);

    bytes memory table = TABLE;

    assembly {
      let tablePtr := add(table, 1)
      let resultPtr := add(result, 32)

      for {
        let i := 0
      } lt(i, len) {

      } {
        i := add(i, 3)
        let input := and(mload(add(data, i)), 0xffffff)

        let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
        out := shl(8, out)
        out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
        out := shl(8, out)
        out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
        out := shl(8, out)
        out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
        out := shl(224, out)

        mstore(resultPtr, out)

        resultPtr := add(resultPtr, 4)
      }

      switch mod(len, 3)
      case 1 {
          mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
      }
      case 2 {
          mstore(sub(resultPtr, 1), shl(248, 0x3d))
      }

      mstore(result, encodedLen)
    }

    return string(result);
  }
}