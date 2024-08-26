/* eslint-disable react/prop-types */
import { useState } from "react";

const MainMenu = ({ setMode, setLevelName, options, setOptions }) => {
  const levels = ["streets", "woods", "apartment"]
  const [selectedLevel, setSelectedLevel] = useState(levels[0])

  const handleLevelChange = (level) => {
    setSelectedLevel(level)
    setLevelName(level + "-1")
  }

  const handleOptionChange = (option) => {
    let tempOptions = { ...options }
    tempOptions[option] = !tempOptions[option]
    setOptions(tempOptions)
  }

  return (
    <div 
      className="text-white w-full h-full flex flex-col items-center p-12 bg-cover bg-center bg-[url('./imgs/menuStill.jpg')]"
    >
      <h1 
        className="text-5xl font-serif mb-6 p-4 rounded-lg border-red-900 border-8"
        style={{backgroundColor: "rgba(0,0,0,0.75)"}}
      >RE-VIL SURVIVOR</h1>

      <div className="grid grid-cols-2">
        <div 
          className="flex flex-col m-4 items-center rounded-lg border-red-900 border-2 p-2"
          style={{backgroundColor: "rgba(0,0,0,0.9)"}}
        >
          <h3 className="text-2xl m-2">STAGE</h3>
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
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </label>
          ))}
        </div>

        <div 
          className="flex flex-col m-4 items-center rounded-lg border-red-900 border-2 p-2"
          style={{backgroundColor: "rgba(0,0,0,0.9)"}}
        >
          <h3 className="text-2xl m-2">OPTIONS</h3>
          {Object.keys(options).map((option) => (
            <label key={option} className="mb-2 m-3">
              <input
                type="checkbox"
                name="option"
                checked={options[option]}
                onChange={() => handleOptionChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div 
        className="text-3xl border-red-900 hover:border-red-800 border-2 rounded-md p-2 m-4"
        style={{backgroundColor: "rgba(0,0,0,0.85)"}}
      >
        <button onClick={()=>setMode(1)}>START</button>
      </div>

    </div>
  )
}

export default MainMenu
