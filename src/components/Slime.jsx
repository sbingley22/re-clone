/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useFrame, useLoader } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'
import textureImage from '../assets/textures/slime.png'
import { useEffect, useRef } from 'react'

const Slime = ({ id, position, scale=1, lifeSpan=6, setSlimes, playerRef, inventory, setInventory, inventorySlot }) => {
  const texture = useLoader(THREE.TextureLoader, textureImage)
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.alphaTest = 0.5 

  const group = useRef()
  const material = useRef()
  const lifeTime = useRef(lifeSpan)

  useEffect(()=>{
    if (lifeSpan === -99) {
      lifeTime.current = 5
    }
  }, [lifeSpan])

  const removeSlimeById = (id) => {
    setSlimes((prevSlimes) => {
      return prevSlimes.filter(slime => slime.id !== id)
    })
  }

  // Game loop
  useFrame((state, delta)=>{
    if (!playerRef) return

    if (lifeSpan !== -99) {
      lifeTime.current -= delta
      if (lifeTime.current <= 0) {
        removeSlimeById(id)
      }
    }
    
    if (material.current) {
      material.current.opacity = lifeTime.current / lifeSpan
      if (material.current.opacity < 0.5) material.current.opacity = 0.5
      if (lifeSpan === -99) material.current.opacity = 0.65

      const colValue = 0.25
      material.current.color.r = colValue * 1.0
      material.current.color.g = colValue * 1.5
      material.current.color.b = colValue * 0.1
    }

    const distance = group.current.position.distanceTo(playerRef.current.position)
    if (distance < scale/2.5) {
      const item = inventory[inventorySlot]
      if (item.name === "slime spray") {
        const tempInventory = [...inventory]
        tempInventory[inventorySlot].amount -= 1
        if (tempInventory[inventorySlot].amount <= 0) {
          tempInventory[inventorySlot].name = ""
          tempInventory[inventorySlot].amount = 0
        }
        setInventory(tempInventory)
      }
      else {
        playerRef.current.dmgFlag = {
          dmg: 10,
          position: null,
          range: null,
        }
      }
      removeSlimeById(id)
    }
  })

  const yOffset = ( position[0] + position[1] + position[2] ) / 1000
  return (
    <group
      ref={group}
      position={position}
    >
      <Plane 
        position-y={0.001 + yOffset}
        rotation-x={-Math.PI/2}
        scale={scale}
      >
        <meshBasicMaterial ref={material} attach="material" map={texture} transparent />
      </Plane>
    </group>
  )
}

export default Slime
