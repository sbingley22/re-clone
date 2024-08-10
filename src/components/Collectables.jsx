/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import Props from "./Props"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"

const Collectables = ({ id, name, type, pos, amount, playerRef, gamepad, collectables, setCollectables, inventory, setInventory, setHudInfo }) => {
  const group = useRef()
  const [visibleNodes, setVisibleNodes] = useState([])
  const [, getKeys] = useKeyboardControls()

  useEffect(()=>{
    if (type === "HealthKit") {
      setVisibleNodes(["HealthKit"])
    }
    else if (type === "Spray") {
      setVisibleNodes(["Spray"])
    }
    else if (type === "Grenade") {
      setVisibleNodes(["Grenade"])
    }
    else if (type === "Ammo") {
      setVisibleNodes(["Ammo"])
    }
  }, [type])

  const pickupItem = () => {
    const temp = collectables.filter((col)=> col.id !== id)
    setCollectables(temp)

    const tempInventory = [...inventory]
    // check if already contains same item type
    let emptyIndex = null
    for (let index = 0; index < tempInventory.length; index++) {
      const element = tempInventory[index]
      if (element.name === name) {
        element.amount += amount
        setInventory(tempInventory)
        return
      }
      else if (emptyIndex === null && element.name === "") emptyIndex=index
    }

    // put item in first empty index
    if (emptyIndex != null) {
      tempInventory[emptyIndex].name = name
      tempInventory[emptyIndex].amount = amount
      setInventory(tempInventory)
      return
    }

    setHudInfo(prev => ({
      ...prev,
      msg: "Inventory Full"
    }))
  }

  useFrame(()=>{
    if (!group.current) return
    if (!playerRef.current) return

    const { interact } = getKeys()

    const dist = group.current.position.distanceTo(playerRef.current.position)
    if (dist < 0.75) {
      setHudInfo(prev => ({
        ...prev,
        msg: "E/X to pickup item"
      }))
      if (interact || gamepad.current.interact) {
        pickupItem()
      }
    }
  })

  return (
    <group 
      ref={group}
      position={pos}
    >
      <Props
        visibleNodes={visibleNodes}
      />
    </group>
  )
}

export default Collectables
