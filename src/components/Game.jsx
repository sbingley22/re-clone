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
import BloodManager from "./BloodManager"
import Collectables from "./Collectables"
import Net from "./Net"

const Game = ({ setMode, options, levelName, setLevelName, score }) => {
  const containerRef = useRef()
  const levels = useRef(levelData)

  const playerRef = useRef(null)
  const [zombies, setZombies] = useState([])
  const zombieRefs = useRef([])
  const [slimes, setSlimes] = useState([])
  const [nets, setNets] = useState([])
  const splatterFlag = useRef(null)

  const [collectables, setCollectables] = useState([])
  const [inventory, setInventory] = useState([
    {
      name: "stun grenade",
      amount: 1,
    },
    {name:"",amount:0},
    {name:"",amount:0},
    {name:"",amount:0},
    {name:"",amount:0},
    {name:"",amount:0},
  ])
  const [inventorySlot, setInventorySlot] = useState(0)
  const [hudInfo, setHudInfo] = useState({
    health: 100,
    msg: "",
  })

  const audioBGMRef = useRef()
  const playBGM = (type) => {
    if (type === "scary") {
      if (!audioBGMRef.current) return
      audioBGMRef.current.play()
      audioBGMRef.current.volume = 0.8
    }
  }
  const playAudio = (src, volume=1) => {
    const audio = new Audio(src)
    audio.volume = volume
    audio.play()
  }
  useEffect(()=>{
    playBGM("scary")
  }, [])

  const addSlime = (x, z, lifeSpan = 5, scale = 1) => {
    const tempSlimes = [...slimes]
    tempSlimes.push({
      id: uuidv4(),
      position: [x, 0, z],
      lifeSpan: lifeSpan,
      scale: scale,
    })
    setSlimes(tempSlimes)
  }

  const updateMsg = (msg) => {
    setHudInfo(prev => ({
      ...prev,
      msg: msg,
    }))
  }

  // Level Complete
  useEffect(()=>{
    if (zombies.length > 0) return

    if (levels.current[levelName].next) updateMsg("Next Stage >>")
  }, [levelName, zombies])

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
    if (newLevel.nets) setNets(newLevel.nets)
    else {
      setNets([])
    }
    if (newLevel.collectables) setCollectables(newLevel.collectables)
    else {
      setCollectables([])
    }

    updateMsg("")
    score.current += 100

  }, [levelName, score])

  let camSetup = 1
  let camFov = 5
  let camPos = [0, 25, 55]
  if (camSetup === 1) {
    camPos = [0,35,70]
    camFov = 5
  }

  const gamepad = useRef({
    moveX: 0,
    moveY: 0,
    aimX: 0,
    aimY: 0,
    jump: false,
    interact: false,
    inventoryLeft: false,
    inventoryRight: false,
    inventoryUse: false,
  })

  const handleGamepadButtonDown = (buttonName) => {
    if (!buttonName) return
    console.log(`Button ${buttonName} pressed`)
    // Handle button press
    if (buttonName === "A") gamepad.current.jump = true
    else if (buttonName === "X") gamepad.current.interact = true
    else if (buttonName === "DPadLeft") gamepad.current.inventoryLeft = true
    else if (buttonName === "DPadRight") gamepad.current.inventoryRight = true
    else if (buttonName === "DPadUp") gamepad.current.inventoryUse = true
  }

  const handleGamepadButtonUp = (buttonName) => {
    if (!buttonName) return
    // console.log(`Button ${buttonName} released`)
    // Handle button release
    if (buttonName === "A") playAudio("./audio/pistol-gunshot.wav")
    if (buttonName === "A") gamepad.current.jump = false
    else if (buttonName === "X") gamepad.current.interact = false
    else if (buttonName === "DPadLeft") gamepad.current.inventoryLeft = false
    else if (buttonName === "DPadRight") gamepad.current.inventoryRight = false
    else if (buttonName === "DPadUp") gamepad.current.inventoryUse = false
  }

  const handleGamepadAxisChange = (axisName, value) => {
    // console.log(`${axisName} : ${value}`)
    // Handle axis movement
    if (axisName === "LeftStickX") gamepad.current.moveX = value
    else if (axisName === "LeftStickY") gamepad.current.moveY = value
    else if (axisName === "RightStickX") gamepad.current.aimX = value
    else if (axisName === "RightStickY") gamepad.current.aimY = value
    else if (axisName === "LeftTrigger") {
      if (value > 0.4) gamepad.current.jump = true
      else gamepad.current.jump = false
    }else if (axisName === "RightTrigger") {
      if (value > 0.4) gamepad.current.jump = true
      else gamepad.current.jump = false
    }
  }
  
  const handleConnect = (gamepadIndex) => {
    console.log(`Gamepad ${gamepadIndex} connected!`)
  }
  const handleDisconnect = (gamepadIndex) => {
    console.log(`Gamepad ${gamepadIndex} disconnected!`)
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
        { name: "interact", keys: ["f", "F", "E", "e", "h", "H", "u", "U"] },
        { name: "inventoryLeft", keys: ["[", "1"] },
        { name: "inventoryRight", keys: ["]", "2"] },
        { name: "inventoryUse", keys: ["p", "o", "P", "O", "q", "Q"] },
        { name: "shift", keys: ["Shift"] },
        { name: "aimUp", keys: ["i", "I"] },
        { name: "aimDown", keys: ["k", "K"] },
        { name: "aimLeft", keys: ["j", "J"] },
        { name: "aimRight", keys: ["l", "L"] },
        ]}
      >
        <Gamepad
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
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

            <ShadowCatcher scale={2} />
            <directionalLight
              castShadow
              position={[0,10,0]}
              intensity={0.1}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />

            <Player 
              setMode={setMode}
              options={options} 
              levels={levels} 
              levelName={levelName}
              setLevelName={setLevelName}
              playerRef={playerRef}
              gamepad={gamepad}
              setHudInfo={setHudInfo} 
              setZombies={setZombies}
              zombieRefs={zombieRefs}
              splatterFlag={splatterFlag}
              inventory={inventory}
              setInventory={setInventory}
              inventorySlot={inventorySlot}
              setInventorySlot={setInventorySlot}
              playAudio={playAudio}
            />

            {zombies.map(zomb => (
              <Zombie 
                key={zomb.id} 
                id={zomb.id}
                position={zomb.position} 
                type={zomb.type}
                health={zomb.health}
                zombieRefs={zombieRefs}
                playerRef={playerRef}
                setZombies={setZombies}
                addSlime={addSlime}
                splatterFlag={splatterFlag}
                score={score}
                options={options} 
                playAudio={playAudio}
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
                inventory={inventory}
                setInventory={setInventory}
                inventorySlot={inventorySlot}
              />
            ))}

            {nets.map(net => (
              <Net 
                key={net.id} 
                id={net.id}
                pos={net.position} 
                scale={net.scale}
                nets={nets}
                setNets={setNets}
                playerRef={playerRef}
                inventory={inventory}
                setInventory={setInventory}
                inventorySlot={inventorySlot}
              />
            ))}

            {collectables.map(collectable=> (
              <Collectables
                key={collectable.id}
                id={collectable.id}
                name={collectable.name}
                type={collectable.type}
                pos={collectable.pos}
                amount={collectable.amount}
                playerRef={playerRef}
                gamepad={gamepad}
                collectables={collectables}
                setCollectables={setCollectables}
                inventory={inventory}
                setInventory={setInventory}
                setHudInfo={setHudInfo}
              />
            ))}

            <BloodManager splatterFlag={splatterFlag} />

          </Suspense>
        </Canvas>
        </Gamepad>
      </KeyboardControls>

      <Hud 
        options={options} 
        hudInfo={hudInfo} 
        setHudInfo={setHudInfo}
        inventory={inventory}
        inventorySlot={inventorySlot}
      />

      <audio ref={audioBGMRef} controls={false}>
        <source src={"./audio/creepy-music.wav"} type="audio/wav" />
      </audio>
    </div>
  )
}

export default Game
