import style from "./NFT.module.css"

interface NFTProps {
  timeZoneHour : number ;
  timeZoneMin : number ; 
}

const localOffset = new Date().getTimezoneOffset() / 60 

const date = new Date();
let hr = date.getHours() + localOffset;
let min = date.getMinutes();
let sec = date.getSeconds();

let hrPosition = (hr * 360) / 12 + (min * (360 / 60)) / 12;
let minPosition = (min * 360) / 60 + (sec * (360 / 60)) / 60;

const runClock = () => {
  hrPosition = hrPosition + 3 / 360;
  minPosition = minPosition + 6 / 60;
};

// Use the inbuilt setInterval function to invoke the method we created earlier
setInterval(runClock, 1000);



export const NFT = ({timeZoneHour,timeZoneMin}: NFTProps) => {
  return <div className={style.nft}>
    <div className={style.container}>
      <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="white" />
      <circle cx="200" cy="200" r="147" stroke="black" stroke-width="6" />
      <circle cx="200" cy="200" r="145" fill="black" stroke="#393939" stroke-width="2" />
      <mask id="mask0_7_61" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="61" y="61" width="278" height="278">
        <rect x="198" y="61" width="4" height="38" fill="#C4C4C4" />
        <rect x="198" y="301" width="4" height="38" fill="#C4C4C4" />
        <rect x="61" y="202" width="4" height="38" transform="rotate(-90 61 202)" fill="#C4C4C4" />
        <rect x="301" y="202" width="4" height="38" transform="rotate(-90 301 202)" fill="#C4C4C4" />
        <rect x="132.232" y="321.378" width="4" height="38" transform="rotate(-150 132.232 321.378)" fill="#C4C4C4" />
        <rect x="252.232" y="113.531" width="4" height="38" transform="rotate(-150 252.232 113.531)" fill="#C4C4C4" />
        <rect x="80.6224" y="271.232" width="4" height="38" transform="rotate(-120 80.6224 271.232)" fill="#C4C4C4" />
        <rect x="288.469" y="151.232" width="4" height="38" transform="rotate(-120 288.469 151.232)" fill="#C4C4C4" />
        <rect x="78.6224" y="132.232" width="4" height="38" transform="rotate(-60 78.6224 132.232)" fill="#C4C4C4" />
        <rect x="286.469" y="252.232" width="4" height="38" transform="rotate(-60 286.469 252.232)" fill="#C4C4C4" />
        <rect x="271.232" y="319.378" width="4" height="38" transform="rotate(150 271.232 319.378)" fill="#C4C4C4" />
        <rect x="151.232" y="111.531" width="4" height="38" transform="rotate(150 151.232 111.531)" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_7_61)">
        <mask id="mask1_7_61" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="45" y="41" width="324" height="316">
          <rect x="45" y="41" width="324" height="316" fill="url(#paint0_linear_7_61)" />
        </mask>
        <g mask="url(#mask1_7_61)">
          <rect x="13" y="9" width="387" height="359" fill="#F584FF" />
          <g filter="url(#filter0_f_7_61)">
            <circle cx="82.5" cy="117.5" r="117.5" fill="#FF84CE" />
          </g>
          <g filter="url(#filter1_f_7_61)">
            <circle cx="349.5" cy="239.5" r="117.5" fill="#84A7FF" />
          </g>
          <g filter="url(#filter2_f_7_61)">
            <circle cx="113.5" cy="345.5" r="117.5" fill="#E09191" />
          </g>
        </g>
      </g>
      <g id="minute" className={style.minute} style={{transform:"rotate("+minPosition+"deg)"}}>
        <path className={style.minuteArm} d="M200 200V78" />
        <circle className="sizing-box" cx="200" cy="200" r="130" />
      </g>
      <g id="hour" className={style.hour} style={{transform:"rotate("+hrPosition+"deg)"}}>
        <path className={style.hourArm} d="M200 200V140" />
        <circle className="sizing-box" cx="200" cy="200" r="130" />
      </g>
      <circle cx="200" cy="200" r="5" fill="white" />
      <defs>
        <filter id="filter0_f_7_61" x="-135" y="-100" width="435" height="435" filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_7_61" />
        </filter>
        <filter id="filter1_f_7_61" x="132" y="22" width="435" height="435" filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_7_61" />
        </filter>
        <filter id="filter2_f_7_61" x="-104" y="128" width="435" height="435" filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_7_61" />
        </filter>
        <linearGradient id="paint0_linear_7_61" x1="207" y1="41" x2="207" y2="357" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF84CE" />
          <stop offset="1" stop-color="#923DFF" />
        </linearGradient>
      </defs>
    </svg>

    </div>
  </div>
}