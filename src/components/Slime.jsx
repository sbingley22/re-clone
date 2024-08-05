/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useFrame, useLoader } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'
import textureImage from '../assets/textures/slime.png'
import { useRef } from 'react'

const Slime = ({ id, position, setSlimes, playerRef }) => {
  const texture = useLoader(THREE.TextureLoader, textureImage)
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.alphaTest = 0.5 

  const group = useRef()
  const material = useRef()
  const lifeTime = useRef(10)

  const removeSlimeById = (id) => {
    setSlimes((prevSlimes) => {
      return prevSlimes.filter(slime => slime.id !== id)
    })
  }

  // Game loop
  useFrame((state, delta)=>{
    if (!playerRef) return

    lifeTime.current -= delta
    if (lifeTime.current <= 0) {
      removeSlimeById(id)
    }
    if (material.current) {
      material.current.opacity = lifeTime.current/20 + 0.5
    }

    const distance = group.current.position.distanceTo(playerRef.current.position)
    if (distance < 0.75) {
      playerRef.current.dmgFlag = 10
      removeSlimeById(id)
    }
  })

  return (
    <group
      ref={group}
      position={position}
    >
      <Plane 
        position-y={0.001}
        rotation-x={-Math.PI/2}
        scale={1.5}
      >
        <meshBasicMaterial ref={material} attach="material" map={texture} transparent />
      </Plane>
    </group>
  )
}

export default Slime
