/* eslint-disable react/prop-types */
import jillHealthyImg from "../assets/status/jillHealthy.png"
import jillHealthyImgDev from "../assets/dev/jillHealthy.png"
import jillHurtImg from "../assets/status/jillHurt.png"
import jillHurtImgDev from "../assets/dev/jillHurt.png"

const Hud = ({ options, hudInfo, inventory, inventorySlot }) => {
  let hudImg = options.altMode? jillHealthyImgDev : jillHealthyImg 
  if (hudInfo.health < 50) options.altMode? jillHurtImgDev : jillHurtImg

  let bgCol = "rgba(0,255,0,0.2)"
  if (hudInfo.health < 50) bgCol = "rgba(255,0,0,0.2)"
  else if (hudInfo.health < 75) bgCol = "rgba(133,133,0,0.2)"

  const imgSize = options.altMode ? 256 : 128

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
          >{inv.name} x{inv.amount}</p>
        ))}
      </div>
    </div>
  )
}

export default Hud
