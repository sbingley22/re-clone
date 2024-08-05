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
  const attackCoolDown = useRef(0.2)

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
      const pvx = vx / distance
      const pvz = vz / distance

      // Face Player
      rotateToVec(pvx, pvz)

      // Move to Player
      if (distance < 0.5) {
        // Attack player
        attackCoolDown.current -= delta

        if (attackCoolDown.current <= 0) {
          if (!isUnskippableAnimation()) {
            anim.current = "Fight Jab"
            attackCoolDown.current = 1
            playerRef.current.dmgFlag = 20
          }
        }
        else {
          if (!isUnskippableAnimation()) {
            anim.current = "Fight Stance"
          }
        }
      }
      else {
        const speed = 0.5
        const tempX = group.current.position.x + speed * pvx * delta
        const tempZ = group.current.position.z + speed * pvz * delta
        let canMove = true

        zombieRefs.current.forEach(z => {
          if (group.current.id === z.current.id) return

          const vx = z.current.position.x - group.current.position.x
          const vz = z.current.position.z - group.current.position.z
          const distance = Math.sqrt(vx * vx + vz * vz)
          if (distance < 0.25) {
            const zvx = vx / distance
            const zvz = vz / distance
    
            const dotProduct = pvx * zvx + pvz * zvz
            // Check if angle of direction heading is within
            // 90 degrees of obstruction. (If obstruction is in front.)
            if (dotProduct > 0) { 
              canMove = false
            }
          }
        })

        if (canMove) {
          group.current.position.x = tempX
          group.current.position.z = tempZ

          if (!isUnskippableAnimation()) {
            anim.current = "Walking"
          }
        }
      }
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
