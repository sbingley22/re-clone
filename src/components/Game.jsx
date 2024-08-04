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

const Game = ({ options }) => {
  const containerRef = useRef()
  const arena = useRef({
    x: 4,
    z: 4
  })
  const [hudInfo, setHudInfo] = useState({
    health: 100,
  })
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

  return (
    <div ref={containerRef} className="w-full h-full">
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
            position: [0,3,5],
            fov: 55
          }}
          shadows
        >
          <Suspense>

            <Environment 
              preset="night" 
              environmentIntensity={4} 
              background 
              backgroundIntensity={1} 
              backgroundRotation={[0,4,0]}
              // ground={{
              //   height: 15, // Height of cam (Default: 15)
              //   radius: 50, // Radius (Default 60)
              //   scale: 100, // (Default: 1000)
              // }}
            />

            <ShadowCatcher />
            <directionalLight
              castShadow
              position={[0,10,0]}
              intensity={0.1}
            />

            <Background />
            
            <Player 
              options={options} 
              arena={arena} 
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
