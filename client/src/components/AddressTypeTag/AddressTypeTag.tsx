import { AddressType } from "../MomentCard/MomentCard"
import searchSmall from "../../img/searchSmall.svg"
import diceSmall from "../../img/diceSmall.svg"
import style from "./AddressTypeTag.module.css"
export const AddressTypeTag = ({addressType}: {addressType: AddressType}) => {
  const options = {
    [AddressType.Signer]: <>You</>, 
    [AddressType.Owner]: <>Yours</>
  }
  return <span className={style.tag}><span className={style.content}>{options[addressType]}</span></span> 
}