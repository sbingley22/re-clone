/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useEffect } from "react"
import glb from "../assets/reProps.glb?url"
import { useGLTF } from "@react-three/drei"

const Props = ({ visibleNodes }) => {
  const { scene, nodes } = useGLTF(glb)

  // Initial Setup
  useEffect(() => {
    console.log(nodes)

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh") {
        node.visible = false
        node.castShadow = true
      }
    })
  }, [nodes])

  // Set visible nodes
  useEffect(()=>{
    if (!visibleNodes) return

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh") node.visible = false
    })

    visibleNodes.forEach(vn => {
      const node = nodes[vn]
      if (!node) return

      node.visible = true
      if (node.type === "Group") {
        node.children.forEach(child => {
          child.visible = true
        })
      }
    })
  }, [visibleNodes, nodes])

  return (
    <group>
      <primitive object={scene} />
    </group>
  )
}

export default Props

useGLTF.preload(glb)