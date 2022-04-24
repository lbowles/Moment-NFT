
pragma solidity ^0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract momentNFT is ERC721 {

  uint256 public immutable claimPrice = 1 ether; 
  address public immutable withdrawAddress = 0x245E32DbA4E30b483F618A3940309236AaEbBbC5 ;
  uint public tokenCounter; 
  uint32 constant SECONDS_PER_DAY = 24 * 60 * 60;
  uint16 constant SECONDS_PER_HOUR = 60 * 60;
  uint8 constant SECONDS_PER_MINUTE = 60;
  string constant svgTop =' <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">    <def>      <style>      .minute-arm {        fill: none;        stroke: #A3A3A3;        stroke-width: 6;        stroke-miterlimit: 8;      }      .hour-arm {        fill: none;        stroke: #fff;        stroke-width: 6;        stroke-miterlimit: 8;      }      #minute,#hour {        transform-origin: 200px 200px;      }    </style>    </def>    <rect width="400" height="400" fill="white" />    <circle cx="200" cy="200" r="147" stroke="black" stroke-width="6" />    <circle cx="200" cy="200" r="145" fill="black" stroke="#393939" stroke-width="2" />    <mask id="mask0_7_61" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="61" y="61" width="278" height="278">      <rect x="198" y="61" width="4" height="38" fill="#C4C4C4" />      <rect x="198" y="301" width="4" height="38" fill="#C4C4C4" />      <rect x="61" y="202" width="4" height="38" transform="rotate(-90 61 202)" fill="#C4C4C4" />      <rect x="301" y="202" width="4" height="38" transform="rotate(-90 301 202)" fill="#C4C4C4" />      <rect x="132.232" y="321.378" width="4" height="38" transform="rotate(-150 132.232 321.378)" fill="#C4C4C4" />      <rect x="252.232" y="113.531" width="4" height="38" transform="rotate(-150 252.232 113.531)" fill="#C4C4C4" />      <rect x="80.6224" y="271.232" width="4" height="38" transform="rotate(-120 80.6224 271.232)" fill="#C4C4C4" />      <rect x="288.469" y="151.232" width="4" height="38" transform="rotate(-120 288.469 151.232)" fill="#C4C4C4" />      <rect x="78.6224" y="132.232" width="4" height="38" transform="rotate(-60 78.6224 132.232)" fill="#C4C4C4" />      <rect x="286.469" y="252.232" width="4" height="38" transform="rotate(-60 286.469 252.232)" fill="#C4C4C4" />      <rect x="271.232" y="319.378" width="4" height="38" transform="rotate(150 271.232 319.378)" fill="#C4C4C4" />      <rect x="151.232" y="111.531" width="4" height="38" transform="rotate(150 151.232 111.531)" fill="#C4C4C4" />    </mask>    <g mask="url(#mask0_7_61)">      <mask id="mask1_7_61" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="45" y="41" width="324" height="316">        <rect x="45" y="41" width="324" height="316" fill="url(#paint0_linear_7_61)" />      </mask>      <g mask="url(#mask1_7_61)">        <rect x="13" y="9" width="387" height="359" fill="#F584FF" />        <g filter="url(#filter0_f_7_61)">          <circle cx="82.5" cy="117.5" r="117.5" fill="#FF84CE" />        </g>        <g filter="url(#filter1_f_7_61)">          <circle cx="349.5" cy="239.5" r="117.5" fill="#84A7FF" />        </g>        <g filter="url(#filter2_f_7_61)">          <circle cx="113.5" cy="345.5" r="117.5" fill="#E09191" />        </g>      </g>    </g> ';
  string constant svgBot ='<circle cx="200" cy="200" r="5" fill="white" />    <defs>      <filter id="filter0_f_7_61" x="-135" y="-100" width="435" height="435" filterUnits="userSpaceOnUse"        color-interpolation-filters="sRGB">        <feFlood flood-opacity="0" result="BackgroundImageFix" />        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />        <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_7_61" />      </filter>      <filter id="filter1_f_7_61" x="132" y="22" width="435" height="435" filterUnits="userSpaceOnUse"        color-interpolation-filters="sRGB">        <feFlood flood-opacity="0" result="BackgroundImageFix" />        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />        <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_7_61" />      </filter>      <filter id="filter2_f_7_61" x="-104" y="128" width="435" height="435" filterUnits="userSpaceOnUse"        color-interpolation-filters="sRGB">        <feFlood flood-opacity="0" result="BackgroundImageFix" />        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />        <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_7_61" />      </filter>      <linearGradient id="paint0_linear_7_61" x1="207" y1="41" x2="207" y2="357" gradientUnits="userSpaceOnUse">        <stop stop-color="#FF84CE" />        <stop offset="1" stop-color="#923DFF" />      </linearGradient>    </defs>  </svg>'; 
  
  mapping(address => bool) public claimed;
  mapping (uint256 => int8) public timeZoneHour; 
  mapping (uint256 => int8) public timeZoneMin;
  mapping (address => uint256) public TokenIDOfAddress;

  event CreatedMomentNFT(uint256 indexed tokenId);

  constructor() ERC721 ("Moment-NFT", "Moment-NFT") {
    tokenCounter = 0 ;
   }

  function create(int8 _timeZoneHour, int8 _timeZoneMin) public payable {
    require(msg.value >= claimPrice, "Insufficient payment");
    require(claimed[msg.sender] == false, "Already Claimed");
    _safeMint(msg.sender, tokenCounter);
    setTimeZone(_timeZoneHour,_timeZoneMin,tokenCounter) ; 
    claimed[msg.sender] = true;
    TokenIDOfAddress[msg.sender] = tokenCounter;
    emit CreatedMomentNFT(tokenCounter);
    tokenCounter = tokenCounter + 1 ; 
    uint256 refund = msg.value - claimPrice;
    if (refund > 0) {
      payable(msg.sender).transfer(refund);
    }
  }

  function withdraw() public {
    payable(withdrawAddress).transfer(address(this).balance);
  }

  function setTimeZone(int8 _timeZoneHour,int8 _timeZoneMin, uint _id) public{
    timeZoneHour[_id] = _timeZoneHour ;
    timeZoneMin[_id] = _timeZoneMin ;  
  }

  function getTimeZone(uint256 _id) public view returns (int8 UCThourOffset, int8 UCTMinOffset){
    return (timeZoneHour[_id] ,  timeZoneMin[_id]) ;
  }

  function abs(int a) internal pure returns (uint){
        return a >= 0 ? uint(a) : uint(0-a);
    }

  function tokenURI(uint256 _id) public view override returns (string memory) {
    int hr = int(getHour(block.timestamp)) + timeZoneHour[_id] + (timeZoneMin[_id] /60) ; 
    if (hr<0) {
      hr = 24+hr;
    }
    int min = int(getMinute(block.timestamp)) + timeZoneMin[_id];
    int sec = int(getSecond(block.timestamp)) ;
    int hrPosition = (hr * 360) / 12 + (min * (360 / 60)) / 12 ;
    int minPosition = (min * 360) / 60 + (sec * (360 / 60)) / 60;
    string memory sHrPosition = Strings.toString(uint(hrPosition)) ; 
    string memory sMinPosition = Strings.toString(uint(minPosition)) ; 

    string memory sTokenId = Strings.toString(_id) ;  
    string memory sTimeZoneHour = Strings.toString(uint(abs(timeZoneHour[_id]))) ; 
    string memory sTimeZoneHourSign ;
    if (timeZoneHour[_id]>0) {
      sTimeZoneHourSign = "+"; 
    } else {
      sTimeZoneHourSign = "-"; 
    }

    string memory svgMid = string(abi.encodePacked(' <g id="minute" transform = "rotate(',sMinPosition,'  )">      <path class="minute-arm" d="M200 200V78" />      <circle class="sizing-box" cx="200" cy="200" r="130" />    </g>    <g id="hour" transform = "rotate(',sHrPosition,'  )">      <path class="hour-arm" d="M200 200V140" />      <circle class="sizing-box" cx="200" cy="200" r="130" />    </g>  '));
    string memory svg = string(abi.encodePacked(svgTop, svgMid, svgBot )) ; 
    string memory json = base64(bytes(abi.encodePacked('{"name": "MomentNFT ',sTokenId,'", "description": "Fully on-chain clock NFT that shows you the current time. Time zone set to UTC',sTimeZoneHourSign,sTimeZoneHour,'", "image": "data:image/svg+xml;base64,',base64(bytes(svg)) ,'"}')));
    return string(abi.encodePacked('data:application/json;base64,', json));
  }

  function getHour(uint timestamp) internal pure returns (uint hour) {
        uint secs = timestamp % SECONDS_PER_DAY;
        hour = secs / SECONDS_PER_HOUR;
    }

  function getMinute(uint timestamp) internal pure returns (uint minute) {
        uint secs = timestamp % SECONDS_PER_HOUR;
        minute = secs / SECONDS_PER_MINUTE;
    }

  function getSecond(uint timestamp) internal pure returns (uint second) {
        second = timestamp % SECONDS_PER_MINUTE;
    }

  function safeTransferFrom(address _from, address _to, uint256 _tokenId)  public override{
    require(1==2);
  }
  function transferFrom(address _from, address _to, uint256 _tokenId) public override{
    require(1==2);
  }


  function base64(bytes memory data) internal pure returns (string memory) {
    bytes memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    uint256 len = data.length;
    if (len == 0) return "";

    uint256 encodedLen = 4 * ((len + 2) / 3);

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