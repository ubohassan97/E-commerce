import axios from "axios";
import { baseURL , GOOGLE_AUTH } from "../../api/api";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Cookie from  "cookie-universal"

export default function Callback() {
  const location = useLocation();

  useEffect(() => {
    const cookie =Cookie()
    async function Call() {
      try {
      const res =  await axios.get(`${baseURL}/${GOOGLE_AUTH }${location.search}`);
        console.log(res)
        const token = res.data.access_token
        cookie.set("e-commerce", token )
      } catch (err) {
        
        console.log(err);
        
      }
    }
    Call();
    
  }, []);

  return <div>Callback</div>;
}
