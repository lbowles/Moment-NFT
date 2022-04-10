import { BigNumber, ethers } from "ethers"
import deployments from "../../deployments.json"
import style from "./ClaimButton.module.css"
import opensea from "../../img/opensea.svg"

//TODO: check opensea link works

interface IClaimedButtonProps {
  address: string
  claimPrice?: BigNumber
  tokenId?: BigNumber
  claimed?: boolean
  txHash?: string
  onClaim: () => void
}

export const ClaimButton = ({claimed, tokenId, txHash, claimPrice, onClaim}: IClaimedButtonProps) => {
  
  // if claimed, view on opensea
  if (claimed && tokenId) {
    return <a href={`https://opensea.io/assets/${deployments.contracts.momentNFT.address}/${tokenId.toString()}`}
    target="_blank" rel="noreferrer"><button className={style.claimButton}>View on marketplace <img style={{height: "20px", marginLeft: "10px"}} src={opensea} alt=""/></button></a> 
  }

  // if there is a transaction hash, open polygonscan
  if (txHash) {
    return <a href={`https://polygonscan.com/tx/${txHash}`} target="_blank" rel="noreferrer">
      <button className={style.claimButton}>View pending transaction</button>
    </a> 
  }

  // if not claimed and claimable, claim
  if (!claimed) {
    if (!claimPrice) {
      return <button className={style.claimButton} disabled={true}>Loading...</button>
    } else {
      return <button className={style.claimButton} onClick={() => onClaim()}>Mint {ethers.utils.formatEther(claimPrice)} Matic</button>
    }
  }

  return <></>
  
}