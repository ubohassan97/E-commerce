import { Outlet } from "react-router-dom";
import Sidebar from "../../component/dashboard/Sidebar";
import Topbar from "../../component/dashboard/Topbar";
import "./users/index.css";

export default function Dashboard() {


  

  return (
    <div className="postion-absolute dashboard" >
      <Topbar />
<div >
      <Sidebar /></div>
      <div style={{backgroundColor:"#e3e5e5"}}>
        <Outlet />
      </div>
    </div>
  );
}
