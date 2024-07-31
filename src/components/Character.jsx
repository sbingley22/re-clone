/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useEffect } from "react"
import glb from "../assets/reCharacters.glb?url"
import { useSkinnedMeshClone } from "./SkinnedMeshClone"
import { useAnimations } from "@react-three/drei"

const Character = ({ visibleNodes, }) => {
  const { scene, nodes, animations } = useSkinnedMeshClone(glb)
  const { mixer, actions } = useAnimations(animations, scene)

  useEffect(()=>{
    console.log(nodes, actions)

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh" || node.type === "SkinnedMesh") node.visible = false
    })
  },[nodes, actions])

  useEffect(()=>{
    if (!visibleNodes) return

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
    <>
      <primitive object={scene} />
    </>
  )
}

export default Character
