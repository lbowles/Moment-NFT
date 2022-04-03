import style from "./MomentHeader.module.css"
import neonHeader from'./../../img/NeonHeader.jpg';


export const MomentHeader = () => {
  return <div style={{textAlign: "center"}}>
    <div className={style.cont} >
      <div className={style.mainText}>Moment NFT</div>
      <div className={style.subText}>Your Decentralized Clock</div>

    </div>
  </div>
}

