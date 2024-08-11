import { useEffect, useRef, useState } from "react"
import Game from "./components/Game"
import MainMenu from "./components/MainMenu"
import ScoreScreen from "./components/ScoreScreen"

function App() {
  const [mode, setMode] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [options, setOptions] = useState({
    // altMode: true,
    altMode: false,
    defaultRun: true
  })
  const [levelName, setLevelName] = useState("streets-1")
  // const [levelName, setLevelName] = useState("streets-1")

  const audioPianoRef = useRef()

  const playAudio = (type) => {
    //debugger
    if (type === "piano") {
      if (!audioPianoRef.current) return
      audioPianoRef.current.play()
      audioPianoRef.current.volume = 0.2
    }
  }

  useEffect(()=>{
    if ([0].includes(mode)) {
      score.current = 0
      setLevelName("streets-1")
    }
    else if (mode === 1) {
      playAudio("bgm", 0.9)
    }
  }, [mode])

  const score = useRef(0)
  
  if (mode === 0) return (
    <div className="dynamic-width" onClick={()=>playAudio("piano")}>
      <MainMenu setMode={setMode} setLevelName={setLevelName} />
      <audio ref={audioPianoRef} controls={false}>
        <source src={"./audio/scary-piano.wav"} type="audio/mp4" />
      </audio>
    </div>
  )

  if (mode === 8) return (
    <div className="dynamic-width">
      <ScoreScreen setMode={setMode} endScreen="GAME OVER" score={score} />
    </div>
  )

  if (mode === 9) return (
    <div className="dynamic-width">
      <ScoreScreen setMode={setMode} endScreen="YOU SURVIVED!" score={score} />
    </div>
  )

  return (
    <div className="dynamic-width">
      <Game 
        setMode={setMode}
        options={options} 
        levelName={levelName} 
        setLevelName={setLevelName}
        score={score}
      />
    </div>
  ) 
}

export default App
