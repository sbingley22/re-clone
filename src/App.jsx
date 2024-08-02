import { useState } from "react"
import Game from "./components/Game"
import MainMenu from "./components/MainMenu"

function App() {
  const [mode, setMode] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [altMode, setAltMode] = useState(true)
  
  if (mode === 0) return (
    <MainMenu setMode={setMode} />
  )

  return (
    <div className="dynamic-width ">
      <Game altMode={altMode} />
    </div>
  ) 
}

export default App
