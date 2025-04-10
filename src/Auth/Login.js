import { useState } from "react";
import { baseURL, LOGIN } from "../api/api";
import axios from "axios";
import { data, replace, useNavigate } from "react-router-dom";
import "./Auth.css";
import "../index.css";
import "../Auth/alert.css";
import Loading from "../component/loading/loading";
import Cookie from "cookie-universal";
import "./google/google.css"
import { NewAxios } from "../api/CreateAxios";

export default function Login() {
  const Navigate = useNavigate()
  //--------------- error
  const [error, setError] = useState(null);
  // --------------loading
  const [loading, setloading] = useState(false);
  // ----------------cookie
  const cookie = Cookie();

  const [form, setForm] = useState({
    name: "",
    password: "",
    email: "",
  });

  function handleForm(e) {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setloading(true);
    try {
      const response = await axios.post(`${baseURL}/${LOGIN}`, form);
      setloading(false);
      const token = response.data.token;
      cookie.set("e-commerce", token);
      window.location.pathname="/dashboard";
    } catch (err) {
      setloading(false);

      if (err.response?.status === 401) {
        setError("The Email or Password incorrect");
      } else setError("Something went wrong");
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="container">
        <div className=" row h-100">
          <form onSubmit={handleSubmit} className="Authform">
            <div className="custome-form">
              <div className="form_controll">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  placeholder="Email"
                  name="email"
                  onChange={handleForm}
                  required
                />
              </div>

              <div className="form_controll">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="password"
                  value={form.password}
                  name="password"
                  onChange={handleForm}
                  required
                  minLength={6}
                />
              </div>

              {error && <span className="error">{error}</span>}

              <button type="submit" className="btn btn-primary">
                Submit
              </button>

              <button className="btn btn-gg"> 
                <div className="btn-google">
                <a href={"http://127.0.0.1:8000/login-google"}>sign with google
                  <div className="google-icon-wrapper">
                    <img
                      className="google-icon"
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="sign in with google"
                    />
                  </div>
                </a>
</div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
