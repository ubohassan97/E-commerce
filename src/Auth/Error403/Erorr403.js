import { NavLink } from "react-router-dom";
import "./Erorr403.css"

export default function Error403() {

  return (
    <div className="containers">
      <h1>403</h1>
      <h2>Forbidden</h2>
      <p>Sorry, you dont have permission to access this page.</p>
      <NavLink to="/">Return To The Home Page</NavLink> 
    </div>
  );
}
