import { useAccount, useProvider, useSigner } from "wagmi"
import { useEffect, useState } from "react"
import deployments from "../../deployments.json"
import { ClaimButton } from "../ClaimButton/ClaimButton"
import { UpdateTimeZoneButton } from "../UpdateTimeZoneButton/UpdateTimeZoneButton"
import { BigNumber, ethers } from "ethers"
import { MomentCardHeader } from "../MomentCardHeader/MomentCardHeader"
import style from "./MomentCard.module.css"
import { NFT } from "../NFT/NFT"

//TODO: update share on twitter
//TODO: reload page when updating timezone

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
  const [UCTOffset, setUCTOffset] = useState<number>((new Date().getTimezoneOffset() / 60)*-1)
  const [tokenClaimed,setTokenClaimed] = useState<boolean>()
  const [tokenId,setTokenId] = useState<BigNumber>()
  const [claimPrice,setClaimPrice] = useState<BigNumber>()
  const [currentTimeZone,setCurrentTimeZone] = useState<number>()
  const [editTimeZone,setEditTimeZone] = useState<Boolean>(false)
  const [updateTimeZone,setUpdateTimeZone] = useState<Boolean>(false)
  const [editTimeZoneBtn,setEditTimeZoneBtn] = useState<string>("Edit Time Zone")

  const [NFTimg,setNFTimg] = useState<string | undefined>("")
  const [currentTx, setCurrentTx] = useState<ethers.providers.TransactionResponse | undefined>()

  const address =  isAddress((account?.address!) ) ? getAddress((account?.address!)) : undefined 

  contractAddress = deployments.contracts.momentNFT.address
  momentNFT = (new ethers.Contract(contractAddress,deployments.contracts.momentNFT.abi,signer))

  useEffect(() => {
    isClaimed()
    getClaimPrice()
    getUCTOffset()
  },[signer,provider])

  useEffect(() => {
    if (currentTx) {
      console.log("new tx", currentTx.hash)
      currentTx.wait().then(() => { 
        setCurrentTx(undefined)
      })
    } else {
      function delay(time:any) {
        return new Promise(resolve => setTimeout(resolve, time));
      }
      delay(3000).then(async() => {
        isClaimed()
        getUCTOffset()
        setUpdateTimeZone(false)
      });
    }
  }, [currentTx]) 

  const isClaimed = async () => {
    console.log(account?.address)
    var isclaim = await momentNFT.claimed(account?.address)
    setTokenClaimed(isclaim)
    if (isclaim === true) {
      getTokenURI()
    }
    return isclaim
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
      setCurrentTx(await momentNFT.create(UCTOffset,+0,{value: claimPrice}))
    } catch (error) {
      console.log(error)
    }
  }

  const getUCTOffset= async ()=> {
    if (await isClaimed()) {
    var tempZone =  parseInt(await momentNFT.getTimeZone(getTokenId()))
    console.log("ssssss" + tempZone)
    await setCurrentTimeZone(tempZone)
    setUCTOffset(tempZone)
    console.log(tempZone)
    getTokenURI()
    return tempZone
    }
  }

  const onUpdateTimeZone = async () => {
    console.log("Update Time Zone")
    try { 
      setCurrentTx(await momentNFT.setTimeZone(UCTOffset,+0,getTokenId()))
    } catch (error) {
      console.log(error)
    }
  }

  //TODO: update this
  const onTwitterShare = () => {
    const tweet = encodeURIComponent(`Check out Moment NFT! It's a new way of telling time on-chain`)
    const ctaURL = encodeURIComponent(`https://momentNFT.luko.co.za/`)
    const related = encodeURIComponent(`npm_luko`)
    const intentBaseURL = `https://twitter.com/intent/tweet`
    const intentURL = `${intentBaseURL}?text=${tweet}&url=${ctaURL}&related=${related}`
    window.open(intentURL, "_blank")
  }

  const countries = [
    {name: 'UTC-11', value: -11},{name: 'UTC-10', value: -10},{name: 'UTC-9', value: -9},{name: 'UTC-8', value: -8},{name: 'UTC-7', value: -7},{name: 'UTC-6', value: -6},{name: 'UTC-5', value: -5},{name: 'UTC-4', value: -4},{name: 'UTC-3', value: -3},{name: 'UTC-2', value: -2},{name: 'UTC-1', value: -1},{name: 'UTC+0', value: 0},{name: 'UTC+1', value: 1},{name: 'UTC+2', value: 2},{name: 'UTC+3', value: 3},{name: 'UTC+4', value: 4},{name: 'UTC+5', value: 5},{name: 'UTC+6', value: 6},{name: 'UTC+7', value: 7},{name: 'UTC+8', value: 8},{name: 'UTC+9', value: 9},{name: 'UTC+10', value: 10},{name: 'UTC+11', value: 11}
  ]

  let countriesList = countries.length > 0
    	&& countries.map((item, i) => {
      return (
        <option key={i} value={item.value}>{item.name}</option>
      )
    }, this);

  const UCTSelected = () => {
    let timeZonePicker = (document.getElementById("selectTimeZone")as HTMLTextAreaElement)
    setUCTOffset(timeZonePicker.value)
  }
  const toggleEditTimeZone = () => {
    getUCTOffset()
    if (editTimeZone === true) {
      setEditTimeZoneBtn("Edit Time Zone") 
    } else {
      setEditTimeZoneBtn("Cancel")
    }
    setEditTimeZone(!editTimeZone)
  }

  const toggleUpdateTimeZoneBtn = () => {
    let timeZonePicker = (document.getElementById("selectUpdateTimeZone")as HTMLTextAreaElement)
    if (parseInt(timeZonePicker.value) != currentTimeZone) {
      setUpdateTimeZone(true) 
    } else {
      setUpdateTimeZone(false)
    }
    setUCTOffset(timeZonePicker.value) ;
  }

  return <div style={{width: "90%", maxWidth: "400px"}}>
    <div className={style.momentCard}>
      <div className={style.momentCardContent}>
        <MomentCardHeader address={account?.address as any as string} onTwitterShare={onTwitterShare}/>
        {address && <div>
          {provider && (tokenClaimed) && <div style={{paddingBottom: "6px", marginTop: "20px"}}>
            <div>
              <img src={NFTimg} style={{width:"100%", marginBottom:"20px"}}></img>
            </div>
            <div style={{display:"flex"}}>
            <button className={style.editTimeZoneBtn} onClick={()=>{toggleEditTimeZone()}}>{editTimeZoneBtn}</button>
            <h3 style={{marginTop:"5px",textAlign:"right",width:"100%"}}>Current Time Zone : UTC {currentTimeZone} </h3>
            </div>
            {editTimeZone && <>
              <select className={style.selectTimeZone} id="selectUpdateTimeZone" value={UCTOffset} onChange={()=>{toggleUpdateTimeZoneBtn()}}>
                {countriesList}
              </select>
              {updateTimeZone && <>
              <UpdateTimeZoneButton 
              txHash={currentTx?.hash}
              onUpdateTimeZone={onUpdateTimeZone}
              />
              </>}
            </>
            }
            <div className={style.divider}></div>
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