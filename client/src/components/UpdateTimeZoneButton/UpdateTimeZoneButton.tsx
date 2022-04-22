import { BigNumber, ethers } from "ethers"
import deployments from "../../deployments.json"
import style from "./UpdateTimeZoneButton.module.css"
import opensea from "../../img/opensea.svg"


interface IUpdateTimeZoneProps {
  txHash?: string
  onUpdateTimeZone: () => void
}

export const UpdateTimeZoneButton = ({txHash, onUpdateTimeZone}: IUpdateTimeZoneProps) => {
  

  // if there is a transaction hash, open etherscan
  if (txHash) {
    return <a href={`https://polygonscan.com/tx/${txHash}`} target="_blank" rel="noreferrer">
      <button className={style.updateButton}>View pending transaction</button>
    </a> 
  } else {
    return <button className={style.updateButton} onClick={onUpdateTimeZone}>Update Time Zone</button>
  } 
}