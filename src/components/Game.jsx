/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import { Environment, KeyboardControls } from "@react-three/drei"
import Player from "./Player"
import ShadowCatcher from "./ShadowCatcher"
import Hud from "./Hud"
import Zombie from "./Zombie"
import { v4 as uuidv4 } from 'uuid'
import Slime from "./Slime"
import { levelData } from "../assets/levels"
import Gamepad from "react-gamepad"

const Game = ({ options, levelName, setLevelName }) => {
  const containerRef = useRef()
  const levels = useRef(levelData)

  const [hudInfo, setHudInfo] = useState({
    health: 100,
  })
  const playerRef = useRef(null)
  const [zombies, setZombies] = useState([
  ])
  const zombieRefs = useRef([])
  const [slimes, setSlimes] = useState([])

  const addSlime = (x, z, lifeSpan = 5) => {
    const tempSlimes = [...slimes]
    tempSlimes.push({
      id: uuidv4(),
      position: [x, 0, z],
      lifeSpan: lifeSpan,
      scale: 1,
    })
    setSlimes(tempSlimes)
  }

  // Change Level
  useEffect(()=>{
    const newLevel = levels.current[levelName]
    if (newLevel.zombies) setZombies(newLevel.zombies)
    else {
      zombieRefs.current = []
      setZombies([])
    }
    if (newLevel.slimes) setSlimes(newLevel.slimes)
    else {
      setSlimes([])
    }
  }, [levelName])

  let camFov = 5
  let camPos = [0, 25, 55]
  if (camFov === 20) camPos = [0,7.5,12]
  else if (camFov === 15) camPos = [0,17,28]
  else if (camFov === 10) camPos = [0,17,28]
  else if (camFov === 5) camPos = [0,25,55]
  else if (camFov === 1) camPos = [0,150,250]

  const gamepad = useRef({
    moveX: 0,
    moveY: 0,
    aimX: 0,
    aimY: 0,
    jump: false,
  })

  const handleGamepadButtonDown = (buttonName) => {
    if (!buttonName) return
    // console.log(`Button ${buttonName} pressed`)
    // Handle button press
    if (buttonName === "A") gamepad.current.jump = true
  }

  const handleGamepadButtonUp = (buttonName) => {
    if (!buttonName) return
    // console.log(`Button ${buttonName} released`)
    // Handle button release
    if (buttonName === "A") gamepad.current.jump = false
  }

  const handleGamepadAxisChange = (axisName, value) => {
    console.log(`${axisName} : ${value}`)
    // Handle axis movement
    if (axisName === "LeftStickX") gamepad.current.moveX = value
    else if (axisName === "LeftStickY") gamepad.current.moveY = value
    else if (axisName === "RightStickX") gamepad.current.aimX = value
    else if (axisName === "RightStickY") gamepad.current.aimY = value
    else if (axisName === "LeftTrigger") {
      if (value > 0.4) gamepad.current.jump = true
      else gamepad.current.jump = false
    }
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{
        backgroundImage: `url(${levels.current[levelName].img}`, 
        backgroundSize: "cover", 
        backgroundPosition: "center"
      }}
    >
      <KeyboardControls
        map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "interact", keys: ["f", "F"] },
        { name: "inventory", keys: ["`"] },
        { name: "shift", keys: ["Shift"] },
        { name: "aimUp", keys: ["i", "I"] },
        { name: "aimDown", keys: ["k", "K"] },
        { name: "aimLeft", keys: ["j", "J"] },
        { name: "aimRight", keys: ["l", "L"] },
        ]}
      >
        <Gamepad
          onButtonDown={handleGamepadButtonDown}
          onButtonUp={handleGamepadButtonUp}
          onAxisChange={handleGamepadAxisChange}
        >
        <Canvas
          camera={{
            position: camPos,
            fov: camFov
          }}
          shadows
        >
          <Suspense>

            <Environment 
              preset="night" 
              environmentIntensity={4} 
            />

            <ShadowCatcher />
            <directionalLight
              castShadow
              position={[0,10,0]}
              intensity={0.1}
            />

            <Player 
              options={options} 
              levels={levels} 
              levelName={levelName}
              setLevelName={setLevelName}
              playerRef={playerRef}
              gamepad={gamepad}
              setHudInfo={setHudInfo} 
              setZombies={setZombies}
              zombieRefs={zombieRefs}
            />

            {zombies.map(zomb => (
              <Zombie 
                key={zomb.id} 
                id={zomb.id}
                position={zomb.position} 
                zombieRefs={zombieRefs}
                playerRef={playerRef}
                setZombies={setZombies}
                addSlime={addSlime}
              />
            ))}
            
            {slimes.map(slime => (
              <Slime 
                key={slime.id} 
                id={slime.id}
                position={slime.position} 
                scale={slime.scale}
                lifeSpan={slime.lifeSpan}
                setSlimes={setSlimes}
                playerRef={playerRef}
              />
            ))}

          </Suspense>
        </Canvas>
        </Gamepad>
      </KeyboardControls>

      <Hud options={options} hudInfo={hudInfo} />

    </div>
  )
}

export default Game
