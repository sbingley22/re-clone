/* eslint-disable react/no-unknown-property */
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

const Player = ({ setMode, options, levels, levelName, setLevelName, setHudInfo, playerRef, gamepad, zombieRefs, splatterFlag, inventory, setInventory, inventorySlot, setInventorySlot, playAudio }) => {
  const [visibleNodes, setVisibleNodes] = useState(["Ana", "Pistol", "Shoes-HighTops", "Jacket", "Hair-Parted"])
  const anim = useRef("Idle")
  const [, getKeys] = useKeyboardControls()
  const group = useRef()
  const jumpForce = useRef(null)
  const moving = useRef("Idle")
  const targetedEnemy = useRef(null)
  const inventoryHeld = useRef(false)
  const inventoryUseHeld = useRef(false)

  // Level change
  useEffect(()=>{
    const arena = levels.current[levelName].arena
    group.current.position.x = arena.x1 + 1
    if (group.current.position.z < arena.z1) group.current.position.z = arena.z1 + 0.5
    if (group.current.position.z > arena.z2) group.current.position.z = arena.z2 - 0.5
  }, [levelName, levels])

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
    if (a === "Dying") return true
    if (a === "Stunned") return true

    return false
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

    anim.current = "Take Damage"

    splatterFlag.current = {
      pos: group.current.position,
      color: 0x772211,
    }

    playAudio("./audio/f-hurt.ogg", 0.7)

    if (group.current.health <= 0) {
      // game over
      anim.current = "Dying"
      setTimeout(()=>{
        setMode(8)
      }, 1000)
    }

    setHudInfo(prev => ({
      ...prev,
      health: group.current.health
    }))
  }

  // Game Loop
  // eslint-disable-next-line no-unused-vars
  useFrame((state, delta) => {
    if (!group.current) return
    if (!playerRef.current) {
      playerRef.current = group.current
    }
    if (group.current.health <= 0) return

    // eslint-disable-next-line no-unused-vars
    const { forward, backward, left, right, jump, interact, inventoryLeft, inventoryRight, inventoryUse, shift, aimUp, aimLeft, aimRight, aimDown } = getKeys()
    

    // Check Flags
    if (group.current.actionFlag) {
      group.current.actionFlag = null
    }
    if (group.current.dmgFlag) {
      takeDamage(group.current.dmgFlag)
      group.current.dmgFlag = null
    }

    // Inventory
    if (inventoryLeft || inventoryRight || gamepad.current.inventoryLeft || gamepad.current.inventoryRight) {
      if (inventoryHeld.current === false) {
        let dir = 0
        if (inventoryLeft || gamepad.current.inventoryLeft) dir = -1
        if (inventoryRight || gamepad.current.inventoryRight) dir = 1

        let tempSlot = inventorySlot + dir
        if (tempSlot < 0) tempSlot = inventory.length-1
        else if (tempSlot >= inventory.length) tempSlot = 0
        setInventorySlot(tempSlot)
      }
      inventoryHeld.current = true
    } else inventoryHeld.current = false

    if ((inventoryUse || gamepad.current.inventoryUse) && !inventoryUseHeld.current) {
      const removeItem = () => {
        const tempInv = [...inventory]
        tempInv[inventorySlot].amount -= 1
        if (tempInv[inventorySlot].amount <= 0) {
          tempInv[inventorySlot].name = "" 
        }
        setInventory(tempInv)
      }

      inventoryUseHeld.current = true
      const item = inventory[inventorySlot]

      if (item && item.name!=="") {
        if (item.name === "stun grenade") {
          zombieRefs.current.forEach((z)=>{
            z.current.actionFlag = "Stunned"
          })
          removeItem()
          playAudio("./audio/gun-cocking.wav", 0.9)
        }
        else if (item.name === "health kit") {
          group.current.health += 50
          if (group.current.health > 100) group.current.health = 100
          setHudInfo(prev => ({
            ...prev,
            health: group.current.health
          }))
          removeItem()
        }
      }
    } else inventoryUseHeld.current = false

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
    const kick = () => {
      let canKick = true
      if (isUnskippableAnimation()) canKick = false
      if (anim.current === "Pistol Fire") canKick = true

      if (!canKick) return

      if (targetedEnemy.current) {
        const zombie = zombieRefs.current.find(z => z.current.id === targetedEnemy.current)
        if (zombie.current.position.distanceTo(group.current.position) < 2.0) { 
          setTimeout(() => { 
            zombie.current.actionFlag = "kicked"
          }, 350)
        }
      }

      anim.current = "Fight Roundhouse"
    }
    const shoot = () => {
      if (isUnskippableAnimation()) return
      // console.log(anim.current)
      anim.current = "Pistol Fire"

      if (targetedEnemy.current) {
        let dmg = 20
        if (inventory[inventorySlot].name === "power ammo") {
          dmg *= 4
          const tempInventory = [...inventory]
          tempInventory[inventorySlot].amount -= 1
          if (tempInventory[inventorySlot].amount <= 0) {
            tempInventory[inventorySlot].name = ""
            tempInventory[inventorySlot].amount = 0
          }
          setInventory(tempInventory)
          playAudio("./audio/pistol-gunshot.wav", 0.25)
        }
        else {
          playAudio("./audio/pistol-gunshot.wav", 0.14)
        }

        const zombie = zombieRefs.current.find(z => z.current.id === targetedEnemy.current)
        zombie.current.dmgFlag = {
          dmg: dmg,
          position: group.current.position,
          range: null,
        }

      }
    }
    const lockOnEnemy = (dx, dy) => {
      let closestEnemy = null;
      let closestDistance = Infinity;
      let closestAngle = Infinity;
      targetedEnemy.current = null

      // Loop through all enemies to find the closest one in the direction the player is facing
      zombieRefs.current.forEach(e => {
        if (!e.current) return

        const enemy = e.current
        if (enemy.health <= 0) return
        
        // Get enemy position
        const ex = enemy.position.x;
        const ez = enemy.position.z;

        // Calculate vector from player to enemy
        const vx = ex - group.current.position.x;
        const vz = ez - group.current.position.z;

        // Calculate distance to enemy
        const distance = Math.sqrt(vx * vx + vz * vz);

        // Normalize the direction vector the player is facing
        const len = Math.sqrt(dx * dx + dy * dy);
        const ndx = dx / len;
        const ndy = dy / len;

        // Normalize the vector to the enemy
        const lenEnemy = Math.sqrt(vx * vx + vz * vz);
        const evx = vx / lenEnemy;
        const evz = vz / lenEnemy;

        // Calculate the angle between the player's direction and the vector to the enemy
        const dotProduct = ndx * evx + ndy * evz;
        const angle = Math.acos(dotProduct);

        // Check if this enemy is the closest in the direction the player is facing
        if (angle < Math.PI / 4 && distance < closestDistance && angle < closestAngle) { // You can adjust the angle threshold (Math.PI / 4) as needed
          closestEnemy = { x: vx, y: vz };
          closestDistance = distance;
          closestAngle = angle;
          targetedEnemy.current = enemy.id
        }
      });

      // If no enemy is close enough in the direction, return the original direction
      if (!closestEnemy) {
        return { x: dx, y: dy }
      }

      return closestEnemy
    }
    const aim = () => {
      // console.log("aiming")
      moving.current = "Pistol Aim"
      if (jumpForce.current !== null) return
      let dx = 0
      let dy = 0

      if (aimUp) dy = -1
      else if (aimDown) dy = 1
      if (aimLeft) dx = -1
      else if (aimRight) dx = 1
      if (gamepad.current.aimX) dx = gamepad.current.aimX
      if (gamepad.current.aimY) dy = gamepad.current.aimY * -1

      const eLock = lockOnEnemy(dx, dy)
      dx = eLock.x
      dy = eLock.y

      rotateToVec(dx, dy)

      // console.log(targetedEnemy.current)
      if (targetedEnemy.current) {
        if (jump || gamepad.current.jump) {
          // console.log("kicking")
          kick()
        } else {
          // console.log("shooting")
          shoot()
        }
      } 
      else {
        if (!isUnskippableAnimation()) {
          // console.log("aiming")
          anim.current = "Pistol Aim"
        }
      }
    }
    const movement = () => {
      if (!group.current) return
      moving.current = "Idle"
      if (aimDown || aimUp || aimLeft || aimRight || Math.abs(gamepad.current.aimX) > 0.4 || Math.abs(gamepad.current.aimY) > 0.4) {
        aim()
        return
      }
      if (anim.current === "Fight Roundhouse") return

      let dx = 0
      let dy = 0

      // keyboard
      if (forward) dy = -1
      else if (backward) dy = 1
      if (left) dx = -1
      else if (right) dx = 1
      if (dx && dy) {
        dx *= 0.7
        dy *= 0.7
      }
      // gamepad
      const gpmx = gamepad.current.moveX
      const gpmy = gamepad.current.moveY
      const moveDeadZone = 0.3
      if (Math.abs(gpmx) > moveDeadZone) dx = gpmx
      if (Math.abs(gpmy) > moveDeadZone) dy = gpmy * -1


      // check for obstructions
      let runModifier = options.defaultRun === false ? shift : !shift
      if (Math.abs(gpmx) > moveDeadZone || Math.abs(gpmy) > moveDeadZone) {
        if (Math.abs(gpmx) > 0.8 || Math.abs(gpmy) > 0.8) runModifier = true
        else runModifier = false
      }
      const lowHealth = group.current.health < 50
      if (lowHealth) runModifier = false
      const speed = 1.5 * delta * (runModifier? 2 : 1)
      const targetPosition = vec3.set(group.current.position.x + dx * speed, group.current.position.y, group.current.position.z + dy * speed)

      const arena = levels.current[levelName].arena
      if (targetPosition.z < arena.z1) targetPosition.z = group.current.position.z
      if (targetPosition.z > arena.z2) targetPosition.z = group.current.position.z
      if (targetPosition.x < arena.x1) targetPosition.x = group.current.position.x
      if (targetPosition.x > arena.x2) {
        // Stop player from moving
        targetPosition.x =  group.current.position.x
        // Go to next level?
        if (zombieRefs.current.length < 1) {
          const nextLevel = levels.current[levelName].next
          if (nextLevel) {
            setLevelName(nextLevel)
          }  
          else {
            setMode(9)
          }
        }
      }

      if (dx || dy) {
        rotateToVec(dx, dy)

        // Tell mixer character wants to move
        if (runModifier) {
          moving.current = "Jogging"
        }
        else {
          moving.current = "Walking"
          if (lowHealth) moving.current = "WalkingHurt"
        }

        // Apply moving animation only when applicable
        if (!isUnskippableAnimation()) {
          if (runModifier) {
            if (jumpForce.current === null) anim.current = "Jogging"
          }
          else {
            if (jumpForce.current === null) {
              anim.current = "Walking"
              if (lowHealth) anim.current = "WalkingHurt"
            }
          }
        }
      }
      else {
        if (!isUnskippableAnimation() && jumpForce.current === null) {
          anim.current = "Idle"
          if (lowHealth) anim.current = "IdleHurt"
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
        if (jump || gamepad.current.jump) {
          jumpForce.current = 0.08
          anim.current = "Jump"
        }
      }
      else {
        // player is jumping
        jumpForce.current -= delta * 0.15
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
    <group 
      ref={group}
      health={100}
      actionFlag={null}
      dmgFlag={null}
      positionFlag={null}
    >
      <Character 
        visibleNodes={visibleNodes}
        anim={anim}
        moving={moving}
      />
    </group>
  )
}

export default Player
