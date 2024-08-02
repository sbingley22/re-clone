import { Plane } from "@react-three/drei"
import { MeshStandardMaterial } from 'three'

const Background = () => {
  const semiTransparentBlackMaterial = new MeshStandardMaterial({
    color: 'black',
    transparent: true,
    opacity: 0.5,
  })

  return (
    <group
      scale={[8,4,8]}
    >
      <Plane
        rotation-y={Math.PI/2}
        position={[-0.5,0.5,0]}
        material={semiTransparentBlackMaterial}
      />
      <Plane
        rotation-y={-Math.PI/2}
        position={[0.5,0.5,0]}
        material={semiTransparentBlackMaterial}
      />
      <Plane
        rotation-x={0}
        position={[0,0.5,-0.5]}
        material={semiTransparentBlackMaterial}
      />
    </group>
  )
}

export default Background
