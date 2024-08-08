/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import Props from "./Props"

const Collectables = ({ type }) => {
  const [visibleNodes, setVisibleNodes] = useState([])

  useEffect(()=>{
    if (type === "MedKit") {
      setVisibleNodes(["HealthKit"])
    }
  }, [])
  return (
    <>
      <Props
        visibleNodes={visibleNodes}
      />
    </>
  )
}

export default Collectables
