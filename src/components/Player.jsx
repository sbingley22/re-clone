/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import Character from "./Character"
import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vec3 = new THREE.Vector3()
const vec3b = new THREE.Vector3()
const vec3c = new THREE.Vector3()
const quat = new THREE.Quaternion()

const Player = ({ altMode, arena }) => {
  const [visibleNodes, setVisibleNodes] = useState(["Ana", "Pistol", "Shoes-HighTops", "Jacket", "Hair-Parted"])
  const anim = useRef("Idle")
  const [, getKeys] = useKeyboardControls()
  const group = useRef()

  // Alt Mode
  useEffect(()=>{
    if (altMode) {
      setVisibleNodes(["AnaGen", "Pistol", "Shoes-HighTops", "Hair-Parted"])
    }
    else {
      setVisibleNodes(["Ana", "Pistol", "Shoes-HighTops", "Jacket", "Hair-Parted"])
    }
  }, [altMode])

  // Game Loop
  // eslint-disable-next-line no-unused-vars
  useFrame((state, delta) => {
    // eslint-disable-next-line no-unused-vars
    const { forward, backward, left, right, jump, interact, inventory, shift } = getKeys()

    const movement = () => {
      if (!group.current) return

      let dx = 0
      let dy = 0

      if (forward) dy = -1
      else if (backward) dy = 1
      if (left) dx = -1
      else if (right) dx = 1

      if (dx && dy) {
        dx *= 0.7
        dy *= 0.7
      }

      // check for obstructions
      const runModifier = shift
      const speed = 1.5 * delta * (runModifier? 2 : 1)
      const targetPosition = vec3.set(group.current.position.x + dx * speed, group.current.position.y, group.current.position.z + dy * speed)

      if (targetPosition.x < arena.current.x * -1) targetPosition.x = group.current.position.x
      if (targetPosition.z < arena.current.z * -1) targetPosition.z = group.current.position.z
      if (targetPosition.x > arena.current.x * 1) targetPosition.x =  group.current.position.x
      if (targetPosition.z > arena.current.z * 1) targetPosition.z = group.current.position.z

      if (dx || dy) {
        // Calculate target rotation
        const direction = vec3b.set(dx, 0, dy).normalize()
        const angle = Math.atan2(direction.x, direction.z)

        // Create quaternions for current and target rotations
        const currentQuaternion = group.current.quaternion.clone()
        const targetQuaternion = quat.setFromAxisAngle(vec3c.set(0, 1, 0), angle)

        // Interpolate rotation using slerp
        currentQuaternion.slerp(targetQuaternion, 0.1)
        group.current.quaternion.copy(currentQuaternion)

        anim.current = "Walking"
        if (runModifier) anim.current = "Jogging"
      }
      else anim.current = "Idle"

      group.current.position.x = targetPosition.x
      group.current.position.z = targetPosition.z

    }
    movement()

  })

  return (
    <group ref={group}>
      <Character 
        visibleNodes={visibleNodes}
        anim={anim}
      />
    </group>
  )
}

export default Player
