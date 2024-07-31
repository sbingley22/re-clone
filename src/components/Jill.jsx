import { useState } from "react"
import Character from "./Character"

const Jill = () => {
  const [visibleNodes, setVisibleNodes] = useState(["Ana", "Pistol", "Shoes-HighTops", "Jacket", "Hair-Parted"])

  return (
    <>
      <Character 
        visibleNodes={visibleNodes}
      />
    </>
  )
}

export default Jill
