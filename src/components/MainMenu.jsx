/* eslint-disable react/prop-types */

import { useState } from "react";

const MainMenu = ({ setMode, setLevelName }) => {
  const levels = ["streets", "woods"]
  const [selectedLevel, setSelectedLevel] = useState(levels[0])

  const handleLevelChange = (level) => {
    setSelectedLevel(level)
    setLevelName(level)
    setLevelName(level + "-1")
  }

  return (
    <div className="text-white w-full h-full flex flex-col items-center p-12">

      <h1 className="text-5xl font-serif mb-56">RE CLONE</h1>

      <div className="text-3xl border-red-900 hover:border-red-800 border-2 rounded-md p-2 m-4">
        <button onClick={()=>setMode(1)}>START</button>
      </div>

      <div className="flex flex-col m-20 justify-center items-center">
        <h3 className="text-2xl m-5">STAGE</h3>
        {levels.map((level) => (
          <label key={level} className="mb-2 m-3">
            <input
              type="radio"
              name="level"
              value={level}
              checked={selectedLevel === level}
              onChange={() => handleLevelChange(level)}
              className="mr-2"
            />
            {level}
          </label>
        ))}
      </div>

    </div>
  )
}

export default MainMenu
