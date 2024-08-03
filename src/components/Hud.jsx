/* eslint-disable react/prop-types */
import jillHealthyImg from "../assets/status/jillHealthy.png"
import jillHealthyImgDev from "../assets/dev/jillHealthy.png"
import jillHurtImg from "../assets/status/jillHurt.png"
import jillHurtImgDev from "../assets/dev/jillHurt.png"

const Hud = ({ options, hudInfo }) => {
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
    </div>
  )
}

export default Hud
