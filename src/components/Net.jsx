/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import Props from "./Props"
import { useFrame } from '@react-three/fiber'

const Net = ({ id, pos=[0,0,0], scale=1, nets, setNets, playerRef, inventory, setInventory, inventorySlot }) => {
  // eslint-disable-next-line no-unused-vars
  const [visibleNodes, setVisibleNodes] = useState(["Net"])
  const group = useRef()

  const yRot = Math.floor((pos[0] + pos[1] + pos[2]) % 4) * (Math.PI/2)

  useEffect(()=>{
    setVisibleNodes(["Net"])
  }, [])

  const removeItem = () => {
    const tempInv = [...inventory]
    tempInv[inventorySlot].amount -= 1
    if (tempInv[inventorySlot].amount <= 0) {
      tempInv[inventorySlot].name = ""
    }
    setInventory(tempInv)
  }

  // eslint-disable-next-line no-unused-vars
  useFrame((state,delta)=>{
    if (!playerRef || !playerRef.current) return
    if (!group || !group.current) return

    const distance = group.current.position.distanceTo(playerRef.current.position)
    if (distance < scale) {
      const item = inventory[inventorySlot]
      if (item.name === "slime spray") {
        // Remove net and reduce item count
        const tempNets = nets.filter((net) => net.id !== id)
        setNets(tempNets)

        removeItem()
      }
      else {
        playerRef.current.groundFlag = "net"
      }
    }
  })

  return (
    <group
      ref={group}
      position={pos}
      scale={[scale, 1, scale]}
      rotation={[0, yRot, 0]}
    >
      <Props
        visibleNodes={visibleNodes} 
      />
    </group>
  )
}

export default Net