import "./bar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu } from "../../context/MenuContext";
import { useContext, useEffect, useState } from "react";
import { WindowSize } from "../../context/windowSize";
import { NewAxios } from "../../api/CreateAxios";
import { NavLinks } from "./NavLink";

export default function Sidebar() {
  const menu = useContext(Menu);
  const isopen = menu.isOpen;

  const windowContext = useContext(WindowSize);
  const Winsize = windowContext.windsize;
  const [User, SetUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await NewAxios.get(`/user`);
        SetUser(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response && err.response.status === 403) {
        }
      }
    };
    fetchUser();
  }, []);

  console.log("Window width:", window.innerWidth);

  return (
<div
  className="side-bar"
  style={{
    left: Winsize < 767 ? (isopen ? 0 : "-100%") : 0,
    width: Winsize < 925 && isopen ? "100%" : isopen ? "240px" : "fit-content",
    position: Winsize < 925 && isopen ? "static" : "fixed",
    
  }}
>

      <h3 style={{ display: isopen ? "block" : "none" }}>Dashboard</h3>

      {NavLinks.map((link ,key) => (
        link.role.includes(User.role)&&(
        <NavLink
        
        key={key}
          to={link.path}
          className="d-flex align-items-center mt-3 side_bar_link"
        >
          <FontAwesomeIcon
            icon={link.icon}
            className="d-flex align-items-center m-2 gap-2"
          />
          {isopen && <h3 className="nav-link">{link.name}</h3>}
        </NavLink>)
      ))}
    </div>
  );
}
