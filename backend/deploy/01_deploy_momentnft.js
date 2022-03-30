const fs = require("fs")

module.exports = async({
  getNamedAccounts,
  deployments,
  getChainId
}) => {
  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = await getChainId()

  log("[][][]][][][][][][][][][][][][][][]")
  const momentNFT = await deploy("momentNFT", {
    from: deployer,
    log: true 
  })
  log('You have deployed the contract to ' +momentNFT.address )
  let file = "./img/clock.svg"
  let svg = fs.readFileSync(file, {encoding:"utf-8"})

  const momentNFTContract = await ethers.getContractFactory("momentNFT")

}