import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import deployments from "../deployments.json"
import { SyntheticPunks } from "../../../backend/types"
import { useContract } from "wagmi"

export const useSyntheticPunks = (signerOrProvider: Signer | Provider) => {
  return useContract<SyntheticPunks>({
    addressOrName: deployments.contracts.momentNFT.address,
    contractInterface: deployments.contracts.momentNFT.abi,
    signerOrProvider
  })
}