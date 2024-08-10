/* eslint-disable react/prop-types */
import jillHealthyImg from "../assets/status/jillHealthy2.png"
import jillHealthyImgDev from "../assets/dev/jillHealthy1.png"
import jillHurtImg from "../assets/status/jillHurt1.png"
import jillHurtImgDev from "../assets/dev/jillHurt2.png"
import { useEffect } from "react"

const Hud = ({ options, hudInfo, inventory, inventorySlot, setHudInfo }) => {
  let hudImg = options.altMode? jillHealthyImgDev : jillHealthyImg 
  let bgCol = "rgba(0,255,0,0.2)"
  if (hudInfo.health < 50) {
    hudImg = options.altMode? jillHurtImgDev : jillHurtImg
    bgCol = "rgba(255,0,0,0.2)"
  }
  else if (hudInfo.health < 75) bgCol = "rgba(133,133,0,0.2)"

  const imgSize = options.altMode ? 256 : 128

  useEffect(()=>{
    const item = inventory[inventorySlot]
    if (item.name === "") return

    let msg = "O/P/D-Up "
    if (item.name === "stun grenade") msg += "to use stun grenade"
    else if (item.name === "health kit") msg += "to use health kit"
    else if (item.name === "slime spray") msg = "use slime spray by walking on slime and recieve no damage"
    else if (item.name === "power ammo") msg = "shoot with power ammo to deal high dmg"

    setHudInfo(prev => ({
      ...prev,
      msg: msg
    }))
  }, [inventory, inventorySlot, setHudInfo])

  return (
    <div className="h-full w-full">
      <img 
        className="absolute bottom-0 right-0 border-black border-4"
        style={{width: imgSize, height: imgSize, backgroundColor: bgCol}}
        src={hudImg} 
      />

      <p className="absolute bottom-0 left-0 m-2 text-green-500">{hudInfo.msg}</p>

      <div className="absolute top-0 left-0 m-0 text-yellow-50 flex w-full box-border justify-center items-center text-center">
        {inventory.map((inv, index) => (
          <p
            key={"inventory"+index}
            className={`${index===inventorySlot? "border-slate-500" : "border-slate-800"} p-1 m-1 bg-slate-950 border-2 inline-block flex-grow`}
          >{`${inv.name !== "" ? inv.name + " x" + inv.amount : ""}`}</p>
        ))}
      </div>
    </div>
  )
}

export default Hud
