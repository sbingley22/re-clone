/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import * as THREE from "three"
import Character from "./Character"
import { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"

// const vec3 = new THREE.Vector3()
const vec3b = new THREE.Vector3()
const vec3c = new THREE.Vector3()
const quat = new THREE.Quaternion()

const Zombie = ({ id, position=[0,0,0], type="ZMale", health=100, playerRef, zombieRefs, setZombies, addSlime }) => {
  const [visibleNodes, setVisibleNodes] = useState(["ZMale"])
  const anim = useRef("Idle")
  const group = useRef()
  const moving = useRef("Idle")
  const attackCoolDown = useRef(0.2)
  const speed = useRef(1)
  const attackRange = useRef(0.95)

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

  // Zombie type
  useEffect(()=>{
    if (type === "ZMale") {
      setVisibleNodes(["ZMale"])
      speed.current = 1
      attackRange.current = 1.0
      attackCoolDown.current = 0.5
    }
    else if (type === "ZFem") {
      setVisibleNodes(["ZFem"])
      speed.current = 1.2
      attackRange.current = 0.8
      attackCoolDown.current = 0.4
    }
  }, [type])

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
    if (a === "Dying") return true
    if (a === "Stunned") return true

    return false
  }
  
  const removeZombieById = (id) => {
    zombieRefs.current = zombieRefs.current.filter(zombie => zombie.current.id !== group.current.id)
    setZombies((prevZombies) => {
      return prevZombies.filter(zombie => zombie.id !== id)
    })
  }
  const zombieDead = () => {
    addSlime(group.current.position.x, group.current.position.z)
    removeZombieById(id)
  }

  const takeDamage = (flag) => {
    if (!group.current) return

    if (flag.pos) {
      if (flag.range) {
        const distance = group.current.position.distanceTo(flag.pos)
        if (distance > flag.range) return
      }
    }
    group.current.health -= flag.dmg

    const chance = Math.random()
    if (chance > 0.8) anim.current = "Stunned"
    else {
      if (anim.current !== "Stunned") anim.current = "Take Damage"
    }

    if (group.current.health <= 0) {
      // zombie dead 
      anim.current = "Dying"
      setTimeout(zombieDead, 1000)
    }
  }

  const kicked = () => {
    let dmg = 1
    let pushBack = 0.5
    if (anim.current === "Stunned") {
      dmg = 50
      pushBack = 1
    }

    takeDamage(dmg)

    // Push zombie back
    const px = playerRef.current.position.x
    const pz = playerRef.current.position.z
    const zx = group.current.position.x
    const zz = group.current.position.z
    const dx = zx - px
    const dz = zz - pz

    const distance = Math.sqrt(dx * dx + dz * dz)
    const ndx = dx / distance
    const ndz = dz / distance

    group.current.position.x += ndx * pushBack
    group.current.position.z += ndz * pushBack
  }

  // Game Loop
  useFrame((state, delta) => {
    if (!group.current) return
    if (!playerRef.current) return
    if (group.current.health <= 0) return

    // Check Flags
    if (group.current.actionFlag) {
      const flag = group.current.actionFlag
      if (flag === "kicked") {
        kicked()
      }

      group.current.actionFlag = null
    }
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
      if (anim.current === "Stunned") return

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
      if (distance < attackRange.current) {
        // Attack player
        attackCoolDown.current -= delta

        if (attackCoolDown.current <= 0) {
          if (!isUnskippableAnimation()) {
            const chance = Math.random()
            anim.current = "Fight Jab"
            if (chance > 0.5) anim.current = "Fight Straight"

            attackCoolDown.current = 1
            setTimeout(()=>{
              playerRef.current.dmgFlag = {
                dmg: 20,
                pos: group.current.position,
                range: 1.0
              }
            }, 250)
          }
        }
        else {
          if (!isUnskippableAnimation()) {
            anim.current = "Fight Stance"
          }
        }
      }
      else {
        if (["Fight Jab", "Fight Straight"].includes(anim.current)) return

        let tempSpeed = speed.current
        if (anim.current === "Take Damage") tempSpeed /= 2
        const tempX = group.current.position.x + tempSpeed * pvx * delta
        const tempZ = group.current.position.z + tempSpeed * pvz * delta
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
            anim.current = "WalkingStagger"
          }
        }
        else {
          if (!isUnskippableAnimation()) {
            anim.current = "Idle"
          }
        }
      }
    }
    logic()

  })

  return (
    <group 
      ref={group}
      name="zombie"
      health={health}
      position={position}
      actionFlag={null}
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
