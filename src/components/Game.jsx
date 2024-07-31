import { Canvas } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import { Environment } from "@react-three/drei"
import Jill from "./Jill"

const Game = () => {
  const containerRef = useRef()

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        camera={{
          position: [0,5,5],
        }}
        shadows
      >
        <Suspense>
          <Environment preset="night" environmentIntensity={1} />
          
          <Jill />

        </Suspense>
      </Canvas>
      
    </div>
  )
}

export default Game
