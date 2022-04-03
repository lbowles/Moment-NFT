import { useAccount, useContractRead, useContractWrite, useProvider, useSigner } from "wagmi"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useSyntheticPunks } from "../../hooks/useSyntheticPunks"
import { useContractAdapter } from "../../hooks/useContractAdapter"
import { ClaimButton } from "../ClaimButton/ClaimButton"
import { BigNumber, ethers, Wallet } from "ethers"
import { useLocation } from "react-router-dom"
import { PunkCardHeader } from "../PunkCardHeader/PunkCardHeader"
import style from "./MomentCard.module.css"
import { NFT } from "../NFT/NFT"
import { time } from "console"

//TODO: add the +min uct time

const {isAddress, getAddress} = ethers.utils

const claimMessageHash = "0xdf82b3b8802b972d13d60623a6690febbca6142a008135b45c421dd951612158"

export enum AddressType {
  Signer,
  Random,
  Owner
}

export const MomentCard = () => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()
  const [randomWallet, setRandomWallet] = useState<Wallet | undefined>()
  const [UCTOffset, setUCTOffset] = useState <number>((new Date().getTimezoneOffset() / 60)*-1)
  const {address: rawAddress} = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const address = rawAddress ? isAddress(rawAddress.toLowerCase()) ? getAddress(rawAddress.toLowerCase()) : undefined : undefined

  const syntheticPunks = useSyntheticPunks(signer || provider)
  const syntheticPunksConfig = useContractAdapter(syntheticPunks)

  const [currentTx, setCurrentTx] = useState<ethers.providers.TransactionResponse | undefined>()

  const [{ data: tokenClaimed }, readTokenClaimed] = useContractRead(
    syntheticPunksConfig,
    "claimed",
    {args: [address]}
  ) 

  const [{ data: tokenId }, readTokenId] = useContractRead(
    syntheticPunksConfig,
    "getTokenID",
    {args: [address]}
  ) 

  const [{ data: claimPrice }] = useContractRead(
    syntheticPunksConfig,
    "claimPrice",
  ) 

  const [{ data: ownerAddress }, readOwnerAddress] = useContractRead(
    syntheticPunksConfig,
    "ownerOf",
    {args: [tokenId]}
  ) 

  const [, claim] = useContractWrite(
    syntheticPunksConfig,
    "claim",
    {overrides: {value: claimPrice}}
  )

  const [, claimOther] = useContractWrite(
    syntheticPunksConfig,
    "claimOther"
  )

  const signerCanClaim = address === account?.address || address === randomWallet?.address
  const addressType = (account?.address && (account?.address === ownerAddress as any as string)) ? AddressType.Owner : randomWallet?.address === address ? AddressType.Random : account?.address === address ? AddressType.Signer : AddressType.Search

  useEffect(() => {

    readTokenId()
  // eslint-disable-next-line
  }, [address, currentTx, provider])

  useEffect(() => {
    readTokenClaimed()
    readOwnerAddress()
  // eslint-disable-next-line
  }, [tokenId])

  useEffect(() => {
    if (!signer) {
      setRandomWallet(undefined)
    }
  }, [signer])

  useEffect(() => {
    if (currentTx) {
      console.log("new tx", currentTx.hash)
      currentTx.wait().then(() => {
        setCurrentTx(undefined)

      })
      console.log("tx done")
    }
  }, [currentTx]) 

  const onClaim = () => {
    claim().then(({data: tx}) => setCurrentTx(tx))
  }

  const onClaimRandom = () => {
    if (!randomWallet) {
      return
    }
    
    randomWallet.signMessage(ethers.utils.arrayify(claimMessageHash)).then(signature => {
      claimOther({args: [randomWallet.address, signature], overrides: {value: claimPrice}}).then(({data: tx}) => setCurrentTx(tx))
    })    
  }

  const onGenerateRandom = () => {
    const wallet = ethers.Wallet.createRandom()
    setRandomWallet(wallet)
    console.log("navigating to ", wallet.address)
    navigate({pathname: `/address/${wallet.address}`})
  }


  const onTwitterShare = () => {
    const tweet = encodeURIComponent(`Check out my Synthetic CryptoPunk! @stephancill @npm_luko`)
    const ctaURL = encodeURIComponent(`https://syntheticpunks.com/#${location.pathname}`)
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
        <PunkCardHeader address={address} addressType={addressType} ownerAddress={ownerAddress as any as string} onTwitterShare={onTwitterShare}/>
        <NFT timeZoneHour={UCTOffset}/>
        {address && <div>
          {provider && !(!tokenClaimed && !signerCanClaim) && <div style={{paddingBottom: "6px", marginTop: "20px"}}>
            <select className={style.selectTimeZone} id="selectTimeZone" value={UCTOffset} onChange={()=>{UCTSelected()}}>
              {countriesList}
            </select>
            <ClaimButton 
              address={address} 
              claimPrice={claimPrice ? claimPrice as any as BigNumber : undefined}
              isRandom={randomWallet !== undefined}
              signerCanClaim={signerCanClaim} 
              claimed={tokenClaimed as any as boolean}
              tokenId={tokenId as any as BigNumber} 
              txHash={currentTx?.hash}
              onClaim={onClaim}
              onClaimOther={onClaimRandom}
              />
          </div>}
        </div>}
      </div>
    </div>
  </div>
}