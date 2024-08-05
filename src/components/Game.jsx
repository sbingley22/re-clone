/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Canvas } from "@react-three/fiber"
import { Suspense, useRef, useState } from "react"
import { Environment, KeyboardControls } from "@react-three/drei"
import Player from "./Player"
import ShadowCatcher from "./ShadowCatcher"
import Background from "./Background"
import Hud from "./Hud"
import Zombie from "./Zombie"
import { v4 as uuidv4 } from 'uuid'
import Slime from "./Slime"
import bgStreets from "../assets/bgs/streets.jpg"

const Game = ({ options }) => {
  const containerRef = useRef()
  const arena = useRef({
    x1: -4,
    x2: 4,
    z1: -3,
    z2: 6
  })
  const [hudInfo, setHudInfo] = useState({
    health: 100,
  })
  const playerRef = useRef(null)
  const [zombies, setZombies] = useState([
    {
      id: uuidv4(),
      position: [2,0,2]
    },
    {
      id: uuidv4(),
      position: [-2,0,2]
    },
  ])
  const zombieRefs = useRef([])
  const [slimes, setSlimes] = useState([
    {
      id: uuidv4(),
      position: [-2, 0, -2],
    }
  ])

  const addSlime = (x, z) => {
    const tempSlimes = [...slimes]
    tempSlimes.push({
      id: uuidv4(),
      position: [x, 0, z]
    })
    setSlimes(tempSlimes)
  }

  let camFov = 5
  let camPos = [0, 25, 55]
  if (camFov === 20) camPos = [0,7.5,12]
  else if (camFov === 15) camPos = [0,17,28]
  else if (camFov === 10) camPos = [0,17,28]
  else if (camFov === 5) camPos = [0,25,55]
  else if (camFov === 1) camPos = [0,150,250]

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{
        backgroundImage: `url(${bgStreets}`, 
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
              //background 
              backgroundIntensity={5} 
              backgroundRotation={[0,4,0]}
              // ground={{
              //   height: 15, // Height of cam (Default: 15)
              //   radius: 50, // Radius (Default 60)
              //   scale: 100, // (Default: 1000)
              // }}
              //files={bgStreets}
            />

            <ShadowCatcher />
            <directionalLight
              castShadow
              position={[0,10,0]}
              intensity={0.1}
            />

            {/* <Background /> */}
            
            <Player 
              options={options} 
              arena={arena} 
              playerRef={playerRef}
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
                setSlimes={setSlimes}
                playerRef={playerRef}
              />
            ))}

          </Suspense>
        </Canvas>
      </KeyboardControls>

      <Hud options={options} hudInfo={hudInfo} />

    </div>
  )
}

export default Game
