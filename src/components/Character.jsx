/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useEffect, useRef } from "react"
import glb from "../assets/reCharacters.glb?url"
import { useSkinnedMeshClone } from "./SkinnedMeshClone"
import { useAnimations } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

const Character = ({ visibleNodes, anim, moving = "Idle" }) => {
  const { scene, nodes, animations } = useSkinnedMeshClone(glb)
  const { mixer, actions } = useAnimations(animations, scene)
  const lastAnim = useRef(anim.current)

  // Initial Setup
  useEffect(()=>{
    console.log(nodes, actions)

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh" || node.type === "SkinnedMesh") { 
        node.visible = false
        node.castShadow = true
      }
    })

    if (actions["Idle"]) {
      actions["Idle"].play()
    }

  },[nodes, actions])

  // Set visible nodes
  useEffect(()=>{
    if (!visibleNodes) return

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh" || node.type === "SkinnedMesh") node.visible = false
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

  // Mixer Settings
  useEffect(()=>{
    if (!mixer) return

    const oneShotAnims = ["Fight Jab", "Fight Roundhouse", "Fight Straight", "Jump", "Land", "Pistol Fire", "Take Damage"]
    oneShotAnims.forEach(osa => {
      actions[osa].clampWhenFinished = true
      actions[osa].repetitions = 1
    })

    mixer.addEventListener("finished", (e) => {
      //console.log(anim.current, lastAnim.current, e)
      if (lastAnim.current === "Pistol Fire") {
        anim.current = "Pistol Aim"
        return
      }
      if (lastAnim.current === "Jump") {
        anim.current = "Fall"
        return
      }
      if (lastAnim.current === "Land") {
        anim.current = moving.current 
        console.log(moving.current)
        return
      }
      anim.current = "Idle"
    })

    return mixer.removeEventListener("finished")
  }, [mixer, actions, anim, moving])


  // Update Animations
  const updateAnimations = () => {
    if (anim.current === lastAnim.current) return

    actions[lastAnim.current].fadeOut(0.25)
    actions[anim.current].reset().fadeIn(0.25).play()

    lastAnim.current = anim.current
  }

  // Game Loop
  // eslint-disable-next-line no-unused-vars
  useFrame((state, delta) => {
    updateAnimations()
  })

  
  return (
    <>
      <primitive object={scene} />
    </>
  )
}

export default Character
