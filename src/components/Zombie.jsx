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

const Zombie = ({ id, position, playerRef, zombieRefs, setZombies, addSlime }) => {
  const [visibleNodes, setVisibleNodes] = useState(["ZMale"])
  const anim = useRef("Idle")
  const group = useRef()
  const moving = useRef("Idle")

  // Set Zombie ref
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
  
  const removeZombieById = (id) => {
    zombieRefs.current = zombieRefs.current.filter(zombie => zombie.current.id !== group.current.id)
    setZombies((prevZombies) => {
      return prevZombies.filter(zombie => zombie.id !== id)
    })
  }

  const takeDamage = (dmg) => {
    if (!group.current) return

    group.current.health -= dmg

    anim.current = "Take Damage"

    if (group.current.health <= 0) {
      // zombie dead 
      addSlime(group.current.position.x, group.current.position.z)
      removeZombieById(id)
    }
  }

  // Game Loop
  useFrame((state, delta) => {
    if (!group.current) return
    if (!playerRef.current) return

    // Check Flags
    if (group.current.dmgFlag) {
      takeDamage(group.current.dmgFlag)
      group.current.dmgFlag = null
    }

    const rotateToVec = (dx, dy) => {
      // Calculate target rotation
      const direction = vec3b.set(dx, 0, dy).normalize()
      const angle = Math.atan2(direction.x, direction.z)

      // Create quaternions for current and target rotations
      const currentQuaternion = group.current.quaternion.clone()
      const targetQuaternion = quat.setFromAxisAngle(vec3c.set(0, 1, 0), angle)

      // Interpolate rotation using slerp
      currentQuaternion.slerp(targetQuaternion, 0.1)
      group.current.quaternion.copy(currentQuaternion)
    }

    // Enemy AI
    const logic = () => {
      // Get player position etc
      const px = playerRef.current.position.x
      const pz = playerRef.current.position.z
      const vx = px - group.current.position.x
      const vz = pz - group.current.position.z
      // Calculate distance to player
      const distance = Math.sqrt(vx * vx + vz * vz)

      // Normalize the vector to the player
      const lenPlayer = Math.sqrt(vx * vx + vz * vz)
      const pvx = vx / lenPlayer
      const pvz = vz / lenPlayer

      // Face Player
      rotateToVec(pvx, pvz)


    }
    logic()

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
