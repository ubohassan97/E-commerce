import { createContext, useState, useEffect } from "react";

// ✅ Move `createContext` Outside the Component
export const WindowSize = createContext(null);

export default function Window({ children }) {
  const [windsize, setWindsize] = useState(window.innerWidth);

  useEffect(()=>{
    function setwidth(){
        setWindsize(window.innerWidth)
    }
    window.addEventListener("resize", setwidth)
  },[])

  return (
    <WindowSize.Provider value={{ windsize, setWindsize }}>
      {children}
    </WindowSize.Provider>
  );
}
