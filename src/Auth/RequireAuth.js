import { Outlet, Navigate, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../api/api";
import Loading from "../component/loading/loading";

export default function RequireAuth({ AllowedRole }) {
  const navigate = useNavigate();
  const cookie = Cookie();
  const token = cookie.get("e-commerce");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${baseURL}/user`, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/login", { replace: true });
      });
  }, [token, navigate]);

  if (loading) {
    return <Loading />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/error403" replace />;
  }

  if (!AllowedRole) {
    return <Navigate to="/error403" replace />;
  }

  if (AllowedRole.includes(user.role)) {
    return <Outlet />;
  }

  return <Navigate to="/error403" replace />;
}
