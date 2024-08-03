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

const Player = ({ options, arena }) => {
  const [visibleNodes, setVisibleNodes] = useState(["Ana", "Pistol", "Shoes-HighTops", "Jacket", "Hair-Parted"])
  const anim = useRef("Idle")
  const [, getKeys] = useKeyboardControls()
  const group = useRef()
  const jumpForce = useRef(null)
  const moving = useRef("Idle")

  // Alt Mode
  useEffect(()=>{
    if (options.altMode) {
      setVisibleNodes(["AnaGen", "Pistol", "Shoes-HighTops", "Hair-Parted"])
    }
    else {
      setVisibleNodes(["Ana", "Pistol", "Shoes-HighTops", "Jacket", "Hair-Parted"])
    }
  }, [options])

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

  // Game Loop
  // eslint-disable-next-line no-unused-vars
  useFrame((state, delta) => {
    // eslint-disable-next-line no-unused-vars
    const { forward, backward, left, right, jump, interact, inventory, shift, aimUp, aimLeft, aimRight, aimDown } = getKeys()

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
    const shoot = () => {
      if (!isUnskippableAnimation()) {
        anim.current = "Pistol Fire"
      }
    }
    const aim = () => {
      moving.current = "Pistol Aim"
      if (jumpForce.current !== null) return
      let dx = 0
      let dy = 0

      if (aimUp) dy = -1
      else if (aimDown) dy = 1
      if (aimLeft) dx = -1
      else if (aimRight) dx = 1

      rotateToVec(dx, dy)

      if (jump) shoot()
      else {
        if (!isUnskippableAnimation()) {
          anim.current = "Pistol Aim"
        }
      }
    }
    const movement = () => {
      if (!group.current) return
      moving.current = "Idle"
      if (aimDown || aimUp || aimLeft || aimRight) {
        aim()
        return
      }

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
      const runModifier = options.defaultRun === false ? shift : !shift
      const speed = 1.5 * delta * (runModifier? 2 : 1)
      const targetPosition = vec3.set(group.current.position.x + dx * speed, group.current.position.y, group.current.position.z + dy * speed)

      if (targetPosition.x < arena.current.x * -1) targetPosition.x = group.current.position.x
      if (targetPosition.z < arena.current.z * -1) targetPosition.z = group.current.position.z
      if (targetPosition.x > arena.current.x * 1) targetPosition.x =  group.current.position.x
      if (targetPosition.z > arena.current.z * 1) targetPosition.z = group.current.position.z

      if (dx || dy) {
        rotateToVec(dx, dy)

        // Tell mixer character wants to move
        if (runModifier) {
          moving.current = "Jogging"
        }
        else {
          moving.current = "Walking"
        }

        // Apply moving animation only when applicable
        if (!isUnskippableAnimation()) {
          if (runModifier) {
            if (jumpForce.current === null) anim.current = "Jogging"
          }
          else {
            if (jumpForce.current === null) anim.current = "Walking"
          }
        }
      }
      else {
        if (!isUnskippableAnimation() && jumpForce.current === null) {
          anim.current = "Idle"
        }
      }

      group.current.position.x = targetPosition.x
      group.current.position.z = targetPosition.z

    }
    movement()
    const jumping = () => {
      if (jumpForce.current === null) {
        // player is grounded
        if (isUnskippableAnimation()) return
        if (aimDown || aimUp || aimLeft || aimRight) return
        if (jump) {
          jumpForce.current = 0.06
          anim.current = "Jump"
        }
      }
      else {
        // player is jumping
        jumpForce.current -= delta * 0.1
        group.current.position.y += jumpForce.current
        if (group.current.position.y <= 0) {
          // player has landed
          group.current.position.y = 0
          anim.current = "Land"
          jumpForce.current = null
        }
      }
    }
    jumping()

  })

  return (
    <group ref={group}>
      <Character 
        visibleNodes={visibleNodes}
        anim={anim}
        moving={moving}
      />
    </group>
  )
}

export default Player
