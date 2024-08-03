/* eslint-disable react/prop-types */

const MainMenu = ({ setMode, }) => {
  return (
    <div className="text-white w-full h-full flex flex-col justify-center items-center">
      <h1>RE CLONE</h1>
      <button onClick={()=>setMode(1)}>START</button>
    </div>
  )
}

export default MainMenu
