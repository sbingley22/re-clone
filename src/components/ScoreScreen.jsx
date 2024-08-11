/* eslint-disable react/prop-types */

const ScoreScreen = ({ setMode, endScreen="Game Over", score }) => {
  let still = './imgs/gameOverStill.jpg'
  if (endScreen === "YOU SURVIVED!") still = './imgs/survivorStill.jpg'

  return (
    <div 
      className={`text-white w-full h-full flex flex-col items-center p-12 bg-cover bg-center`}
      style={{backgroundImage: `url(${still})`, backgroundColor: "rgba(0,0,0,0.85)"}}
    >

      <h1 
        className="text-5xl font-serif mb-28"
        style={{backgroundColor: "rgba(0,0,0,0.85)"}}
      >{endScreen}</h1>
        

      <p 
        className="text-3xl font-sans m-28 rounded-lg p-2"
        style={{backgroundColor: "rgba(0,0,0,0.85)"}}
      >SCORE: {score.current}</p>

      <div 
        className="text-3xl border-red-900 hover:border-red-800 border-2 rounded-md p-2 m-4"
        style={{backgroundColor: "rgba(0,0,0,0.85)"}}
      >
        <button onClick={()=>setMode(0)}>RETURN</button>
      </div>

    </div>
  )
}

export default ScoreScreen
