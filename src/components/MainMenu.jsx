/* eslint-disable react/prop-types */

const MainMenu = ({ setMode, }) => {
  return (
    <div className="text-white w-full h-full flex flex-col items-center p-12">
      <h1 className="text-5xl font-serif mb-56">RE CLONE</h1>
      <div className="text-3xl border-red-900 hover:border-red-800 border-2 rounded-md p-2 m-4">
        <button onClick={()=>setMode(1)}>START</button>
      </div>
    </div>
  )
}

export default MainMenu
