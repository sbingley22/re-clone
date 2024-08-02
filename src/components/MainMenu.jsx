/* eslint-disable react/prop-types */

const MainMenu = ({ setMode, }) => {
  return (
    <div>
      <h1>RE CLONE</h1>
      <button onClick={()=>setMode(1)}>START</button>
    </div>
  )
}

export default MainMenu
