import { useAccount, useProvider, useSigner } from "wagmi"
import { useEffect, useState } from "react"
import deployments from "../../deployments.json"
import { ClaimButton } from "../ClaimButton/ClaimButton"
import { BigNumber, ethers } from "ethers"
import { MomentCardHeader } from "../MomentCardHeader/MomentCardHeader"
import style from "./MomentCard.module.css"
import { NFT } from "../NFT/NFT"

//TODO: add the +min uct time
//TODO: update share on twitter

const {isAddress, getAddress} = ethers.utils
var contractAddress
var momentNFT : any


export enum AddressType {
  Signer,
  Random,
  Owner
}

export const MomentCard = () => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()
  const [UCTOffset, setUCTOffset] = useState <number>((new Date().getTimezoneOffset() / 60)*-1)
  const [tokenClaimed,setTokenClaimed] = useState<boolean>()
  const [tokenId,setTokenId] = useState<BigNumber>()
  const [claimPrice,setClaimPrice] = useState<BigNumber>()

  const [NFTimg,setNFTimg] = useState<string | undefined>("")
  const [currentTx, setCurrentTx] = useState<ethers.providers.TransactionResponse | undefined>()

  const address =  isAddress((account?.address!) ) ? getAddress((account?.address!)) : undefined 

  contractAddress = deployments.contracts.momentNFT.address
  momentNFT = (new ethers.Contract(contractAddress,deployments.contracts.momentNFT.abi,signer))

  useEffect(() => {
    isClaimed()
    getClaimPrice()
  },[signer,provider])

  useEffect(() => {
    if (currentTx) {
      console.log("new tx", currentTx.hash)
      currentTx.wait().then(() => {
        setCurrentTx(undefined)
      })
      console.log("tx done")
    }
  }, [currentTx]) 

  const isClaimed = async () => {
    console.log(account?.address)
    var isclaim = await momentNFT.claimed(account?.address)
    setTokenClaimed(isclaim)
    if (isclaim === true) {
      getTokenURI()
    }
  }

  const getTokenURI = async () => {
    console.log("get token uri")
    const tokenId = await getTokenId()
    var tokenURI = await momentNFT.tokenURI(tokenId)
    tokenURI = window.atob(tokenURI.split(",")[1])
    console.log(JSON.parse(tokenURI).image)
    setNFTimg(JSON.parse(tokenURI).image)
   }

  const getTokenId = async () => {
    console.log("VIEW Token Id")
    const tempId = await momentNFT.getUserNFTTokenId(account?.address)
    setTokenId(tempId.toString())
    return parseInt(tempId.toString())
  }

  const getClaimPrice = async () => {
    const tempClaimPrice = await momentNFT.claimPrice()
    setClaimPrice(tempClaimPrice)
  }

  const onClaim = async () => {
    try { 
      //const ctx = await momentNFT.create(UCTOffset,0,{value: claimPrice}).then(({data: tx}) => setCurrentTx(tx))
      setCurrentTx(await momentNFT.create(UCTOffset,0,{value: claimPrice}))
    } catch (error) {
      console.log(error)
    }
  }

  const onTwitterShare = () => {
    const tweet = encodeURIComponent(`Check out my wa CryptoPunk! @stephancill @npm_luko`)
    const ctaURL = encodeURIComponent(`https://syntheticpunks.com/`)
    const related = encodeURIComponent(`stephancill,npm_luko,larvalabs,lootproject`)
    const intentBaseURL = `https://twitter.com/intent/tweet`
    const intentURL = `${intentBaseURL}?text=${tweet}&url=${ctaURL}&related=${related}`
    window.open(intentURL, "_blank")
  }

  const countries = [
    {name: 'UCT-11', value: -11},{name: 'UCT-10', value: -10},{name: 'UCT-9', value: -9},{name: 'UCT-8', value: -8},{name: 'UCT-7', value: -7},{name: 'UCT-6', value: -6},{name: 'UCT-5', value: -5},{name: 'UCT-4', value: -4},{name: 'UCT-3', value: -3},{name: 'UCT-2', value: -2},{name: 'UCT-1', value: -1},{name: 'UCT+0', value: 0},{name: 'UCT+1', value: 1},{name: 'UCT+2', value: 2},{name: 'UCT+3', value: 3},{name: 'UCT+4', value: 4},{name: 'UCT+5', value: 5},{name: 'UCT+6', value: 6},{name: 'UCT+7', value: 7},{name: 'UCT+8', value: 8},{name: 'UCT+9', value: 9},{name: 'UCT+10', value: 10},{name: 'UCT+11', value: 11}
  ]

  let countriesList = countries.length > 0
    	&& countries.map((item, i) => {
      return (
        <option key={i} value={item.value}>{item.name}</option>
      )
    }, this);


  const UCTSelected = () => {
    const timeZonePicker = document.getElementById("selectTimeZone")
    setUCTOffset(timeZonePicker.value) ;
  }

  return <div style={{width: "90%", maxWidth: "400px"}}>
    <div className={style.momentCard}>
      <div className={style.momentCardContent}>
        <MomentCardHeader address={account?.address as any as string} onTwitterShare={onTwitterShare}/>
        {address && <div>
          {provider && (tokenClaimed) && <div style={{paddingBottom: "6px", marginTop: "20px"}}>
            <img src={NFTimg} style={{width:"340px", marginBottom:"20px"}}></img>
            
            <ClaimButton 
              address={address} 
              claimPrice={claimPrice ? claimPrice as any as BigNumber : undefined}
              claimed={tokenClaimed as any as boolean}
              tokenId={tokenId as any as BigNumber} 
              txHash={currentTx?.hash}
              onClaim={onClaim}
              />
          </div>} 
          {provider && (!tokenClaimed) && <div style={{paddingBottom: "6px", marginTop: "20px"}}>
            <NFT timeZoneHour={UCTOffset}/>
            <select className={style.selectTimeZone} id="selectTimeZone" value={UCTOffset} onChange={()=>{UCTSelected()}}>
              {countriesList}
            </select>
            <ClaimButton 
              address={address} 
              claimPrice={claimPrice ? claimPrice as any as BigNumber : undefined}
              claimed={tokenClaimed as any as boolean}
              tokenId={tokenId as any as BigNumber} 
              txHash={currentTx?.hash}
              onClaim={onClaim}
              />
          </div>}
        </div>}
      </div>
    </div>
  </div>
}