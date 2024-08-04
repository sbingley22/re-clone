/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import * as THREE from "three"
import Character from "./Character"
import { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"

const vec3 = new THREE.Vector3()
const vec3b = new THREE.Vector3()
const vec3c = new THREE.Vector3()
const quat = new THREE.Quaternion()

const Zombie = ({ id, position, zombieRefs }) => {
  const [visibleNodes, setVisibleNodes] = useState(["ZMale"])
  const anim = useRef("Idle")
  const group = useRef()
  const moving = useRef("Idle")

  useEffect(()=>{
    if (!group.current) {
      console.log("Failed setting zombie ref")
      return
    }
    
    const exists = zombieRefs.current.some(zombie => zombie.current.id === group.current.id)
    
    if (!exists) {
      zombieRefs.current.push(group)
    } 
    else console.log("Zombie Exists")

    //console.log(zombieRefs.current)
  }, [group, id, zombieRefs])

  const isUnskippableAnimation = () => {
    const a = anim.current
    if (a === "Fall") return true
    if (a === "Fight Jab") return true
    if (a === "Fight Roundhouse") return true
    if (a === "Fight Straight") return true
    if (a === "Jump") return true
    if (a === "Land") return true
    if (a === "Pistol Fire") return true
    if (a === "Take Damage") return true

    return false
  }

  const takeDamage = (dmg) => {
    if (!group.current) return

    group.current.health -= dmg
    //console.log(group.current.health)

    anim.current = "Take Damage"

    if (group.current.health <= 0) {
      // zombie dead 

    }
  }

  // Game Loop
  useFrame((state, delta) => {
    if (!group.current) return

    if (group.current.dmgFlag) {
      takeDamage(group.current.dmgFlag)
      group.current.dmgFlag = null
    }
  })

  return (
    <group 
      ref={group}
      health={100}
      position={position}
      dmgFlag={null}
    >
      <Character 
        visibleNodes={visibleNodes}
        anim={anim}
        moving={moving}
      />
    </group>
  )
}

export default Zombie
