const fs = require("fs")
const {networkConfig} = require("../helper-hardhat-config.js")
// const { ethers } = require("hardhat")
// const { hrtime } = require("process")

module.exports = async({
  getNamedAccounts,
  deployments,
  getChainId
}) => {

  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = await getChainId()

  log("[][][]][][][][][][][][][][][][][][]")
  const MOMENTNFT = await deploy("momentNFT", {
    from: deployer,
    log: true 
  })

  log('You have deployed the contract to ' +MOMENTNFT.address )
  const momentNFTContract = await ethers.getContractFactory("momentNFT")
  const accounts = await hre.ethers.getSigners()
  const signer = accounts[0]
  const momentSVG = new ethers.Contract(MOMENTNFT.address, momentNFTContract.interface, signer)
  const networkName = networkConfig[chainId]['name']
  log("Veryify with:  \n npx hardhat verify --network "+networkName+" "+momentSVG.address)

  // let tx = await momentSVG.create(0,0)
  // let receipt = await tx.wait(1)
  // log("NFT Minted")
  // log("View tokenURI: "+ await momentSVG.tokenURI(0))
}