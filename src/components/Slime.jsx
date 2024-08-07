/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useFrame, useLoader } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'
import textureImage from '../assets/textures/slime.png'
import { useEffect, useRef } from 'react'

const Slime = ({ id, position, scale=1, lifeSpan=6, setSlimes, playerRef }) => {
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
      lifeTime.current = 10
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
      material.current.opacity = lifeTime.current/20 + 0.5
      const colValue = 0.75
      material.current.color.r = colValue
      material.current.color.g = colValue / 2
      material.current.color.b = colValue
    }

    const distance = group.current.position.distanceTo(playerRef.current.position)
    if (distance < 0.5) {
      playerRef.current.dmgFlag = {
        dmg: 10,
        position: null,
        range: null,
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
