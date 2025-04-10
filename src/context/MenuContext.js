import { createContext, useState } from "react";

// ✅ Create the context outside the function to ensure it’s not recreated on every render
export const Menu = createContext();

export default function MenuContext({ children }) {
  const [isOpen, setOpen] = useState(true);

  // Ensure the value prop is correctly passed
  return (
    <Menu.Provider value={{ isOpen, setOpen }}>
      {children}
    </Menu.Provider>
  );
}
