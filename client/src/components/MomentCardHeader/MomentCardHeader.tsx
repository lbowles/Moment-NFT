import twitter from "../../img/twitter.svg"
import style from "./MomentCardHeader.module.css"
import { truncateAddress } from "../../utilities"
import { useEnsLookup } from "wagmi"

interface MomentCardHeaderProps {
  address?: string
  onTwitterShare: () => void
}
const copyAddress = (address: string | undefined) => {
  if (address) {
    navigator.clipboard.writeText(address);
  }
}
export const MomentCardHeader = ({address, onTwitterShare}: MomentCardHeaderProps) => {
  const [{ data: ensName }] = useEnsLookup({address})

  return <div>
    <div style={{display: "flex"}}>
      
      <h1  onClick={()=> copyAddress(address)} title={address} style={{display: "inline-block",cursor:"copy"}}>{ensName ? ensName : address ? truncateAddress(address) : ""}</h1>
      <button className={style.twitterButton} onClick={onTwitterShare} ><img src={twitter} alt="Twitter"></img></button>
    </div>
  </div> 
}