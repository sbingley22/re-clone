/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Canvas } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import { Environment, KeyboardControls } from "@react-three/drei"
import Player from "./Player"
import ShadowCatcher from "./ShadowCatcher"
import Background from "./Background"

const Game = ({ altMode }) => {
  const containerRef = useRef()

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
        ]}
      >
        <Canvas
          camera={{
            position: [0,3,5],
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
              position={[0,10,0]}
              intensity={0.1}
              castShadow
            />

            <Background />
            
            <Player altMode={altMode} />

          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  )
}

export default Game