import { useState } from "react";
import { baseURL, REGISTER } from "../api/api";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";
import "./Auth.css";
import "../index.css";
import "../Auth/alert.css";
import Loading from "../component/loading/loading"

export default function Register() {
  const [error, setError] = useState(null);
  const [ loading , setloading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    password: "",
    email: "",
    role:""
  });

  function handleForm(e) {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
    console.log("Submitting Form Data:", form);

  }

  async function handleSubmit(e) {
    e.preventDefault();
    setloading(true)
    try {
      const response = await axios.post(`${baseURL}/${REGISTER}`, form);
      console.log(response)
      setloading(false)
      window.location.pathname = "/login";
    } catch (err) {
      setloading(false)

      if (err.response?.status === 422) {
        setError("this email is taken");
      } else setError("Something went wrong");
    }
    console.log(form)

  }

  return (
    <>
    {loading && <Loading />}
    <div className="container">
      <div className=" row h-100">
        <form onSubmit={handleSubmit} className="Authform">
          <div className="custome-form">
            <div className="form_controll">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                name="name"
                onChange={handleForm}
                required
                minLength={3}
                placeholder="name"
              />
            </div>

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

            <div className="form_controll ">
                <label htmlFor="name" className="form-label">
                  role
                </label>
                <select value={form.role} onChange={handleForm} name="role">
                  <option value="" disabled> select role</option>
                  {/* <option  value="1995"> Admin</option> */}
                  <option value="2001">User</option>
                  <option value="1996">Writer</option>
                  <option  value="1999" > Product Manger</option>

                </select>

             
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
