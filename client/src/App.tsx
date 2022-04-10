import './App.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { ConnectButton } from './components/ConnectButton/ConnectButton';
import { useAccount, useNetwork } from 'wagmi';
import { MomentHeader } from './components/MomentHeader/MomentHeader';
import { MomentCard } from './components/MomentCard/MomentCard';
import { useEffect } from 'react';
import deployments from "./deployments.json"
import { Copy } from "./components/Copy/Copy"
import opensea from "./img/opensea.svg"
import github from "./img/github.svg"
import etherscan from "./img/etherscan.svg"

const deploymentChain = parseInt(deployments.chainId)

//TODO: Change onpensea link
//TODO: Change polyscan link

function App() {
  const [{data: account}] = useAccount()
  const navigate = useNavigate()
  const location = useLocation()
  const [{data: network}, switchNetwork] = useNetwork()

  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  useEffect(() => {
    if (account && location.pathname === "/") {
      navigate(`/address/${account.address}`)
    }
  }, [account, location.pathname, navigate])

  return (
    <div className="App">
      <MomentHeader></MomentHeader>
      <div className="linksContainer" style={{display: "flex"}}>
        <a href="https://opensea.io/collection/synthetic-cryptopunks" target="_blank" rel="noopener noreferrer"><img src={opensea} alt="OpenSea"/></a>
        <a href="https://github.com/lbowles/On-Chain-Clock-NFT" target="_blank" rel="noopener noreferrer"><img src={github} alt="GitHub"/></a>
        <a href={`https://polygonscan.com/address/${deployments.contracts.momentNFT.address}`} target="_blank" rel="noopener noreferrer"><img src={etherscan} alt="Polyscan"/></a>
      </div>
      
      {isSafari && <div>
        Note: Safari is not supported. Please try a different browser!
      </div>}

      <div style={{marginTop: "40px", marginBottom: "40px", width: "90%", maxWidth: "400px", display: "flex", justifyContent: "center"}}>
        <ConnectButton/>
      </div>
      
      {network && switchNetwork && network.chain?.id !== deploymentChain 
      ?
        <div style={{marginBottom:"30px",width: "90%",textAlign:"center"}}>
          <button className="switchNetworkBtn" onClick={() => switchNetwork(deploymentChain)}>Switch to {deployments.name}</button>
        </div>
      :<>
        {account && 
         <MomentCard/>
        }
        </>
      }
      <Copy/>
      <footer style={{marginBottom: "20px"}}>
        Created by <a href="https://twitter.com/stephancill" target="_blank" rel="noopener noreferrer">@stephancill</a> and <a href="https://twitter.com/npm_luko" target="_blank" rel="noopener noreferrer">@npm_luko</a>
      </footer>
    </div>
  );
}

export default App;
