import { useState } from "react"
import Game from "./components/Game"
import MainMenu from "./components/MainMenu"

function App() {
  const [mode, setMode] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [options, setOptions] = useState({
    altMode: true,
    defaultRun: true
  })
  const [levelName, setLevelName] = useState("streets-1")
  
  if (mode === 0) return (
    <div className="dynamic-width">
      <MainMenu setMode={setMode} setLevelName={setLevelName} />
    </div>
  )

  return (
    <div className="dynamic-width">
      <Game 
        options={options} 
        levelName={levelName} 
        setLevelName={setLevelName}
      />
    </div>
  ) 
}

export default App
