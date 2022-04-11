import { ReactElement, useState } from "react"
import deployments from "../../deployments.json"

interface ISection {
  heading: string
  body: ReactElement
}

//TODO: update polyscan link

export const Copy = () => {
  const sections: ISection[] = [
    {
      heading: "What are Moment NFT's?",
      body: <p><b>Moment NFT's</b> are a simple way of telling the time on-chain.</p>
    },
    {
      heading: "Features",
      body: <p>Each Moment NFT
        <ul>
          <li>Is generated from assets stored <a href={`https://polyscan.com/address/${deployments.contracts.momentNFT.address}`}>fully on-chain</a></li>
          <li>Displays the current time in your selected time zone when the metadata is refreshed</li>
        </ul>
      </p>
    },
    {
      heading: "Why should I claim my Moment NFT?",
      body: <p>Claiming your Moment NFT lets you:
        <ul>
          <li><b>Tell the time</b> on-chain in a decentralized manner.</li>
          <li><b>Supports</b> me in making more projects like this!</li>
        </ul>
      </p>
    }
  ]

  const [expanded, setExpanded] = useState<boolean[]>([...new Array(sections.length)].fill(false))

  return <div style={{width: "90%", maxWidth: "400px",marginBottom:"80px"}}>
    <div style={{marginBottom: "20px"}}>
      <h1 style={{padding: "5px"}}>FAQ</h1>
    </div>
    
    {sections.map((section, index) => {
      return <div key={index} style={{marginBottom: "20px", backgroundColor: "var(--lighter)", padding: "30px", borderRadius: "5px"}}>
        <div style={{display: "flex", margin: "-20px", padding: "20px", cursor: "pointer"}} onClick={() => {
          const expandedCopy = [...expanded]
          expandedCopy[index] = !expandedCopy[index]
          setExpanded(expandedCopy)
        }}>
          <h1 style={{display: "inline-block"}}>{section.heading}</h1> 
          <h1 style={{marginLeft: "auto", display: "inline-block"}}>{expanded[index] ? "–" : "+"}</h1>
        </div>
          {expanded[index] && <div style={{marginTop: "20px"}}>
          {section.body}
        </div>}
      </div>
    })}
  </div>
}