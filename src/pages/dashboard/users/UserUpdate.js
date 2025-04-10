import { useContext, useEffect, useState } from "react";
import { NewAxios } from "../../../api/CreateAxios";
import { useNavigate } from "react-router-dom";
import Loading from "../../../component/loading/loading";
import { useParams } from "react-router-dom";
import { WindowSize } from "../../../context/windowSize";
import { Menu } from "../../../context/MenuContext";

export default function UserUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
   const windowSize = useContext(WindowSize);
    const winsize = windowSize.windsize;
    const menu = useContext(Menu);
    const isopen = menu.isOpen;
  const [form, setForm] = useState({
    name: "",
    password: "",
    email: "",
    role: "",
  });

  // Fetch user data when component mounts
  useEffect(() => {
    NewAxios.get(`user/${id}`)
      .then((response) => {
        setForm({
          name: response.data.name,
          email: response.data.email,
          password: "", // Do not pre-fill password for security reasons
          role: response.data.role,
        });
      })
      .then(setloading(true))
      .catch((err) => {
        setloading(true);

        if (err.response?.status === 404) {
          console.log("Navigating to /error404");
          navigate("/error404", { replace: true });
        }
      })
      .finally(setloading(false));
  }, [id]);

  function handleForm(e) {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent page reload
    setloading(true);

    try {
      const res = await NewAxios.post(`user/edit/${id}`, {
        name: form.name,
        email: form.email,
        password: form.password || undefined, // Don't send empty password
        role: form.role,
      });
      navigate("/dashboard/user");
    } catch (err) {
      console.error("Error Response:", err.response); // Debugging
      navigate("/error404", { replace: true });
    } finally {
      setloading(false);
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="container justify-content-center align-items-center"     style={{
        backgroundColor: "white",
        marginTop: "100px",
        marginLeft:
          winsize > 567
            ? isopen
              ? "240px"
              : "90px"
            : isopen
            ? "100px"
            : "0px",
      }}>
        <h1>Update User</h1>
        <div className="row">
          <form
            className="Authform"
            onSubmit={handleSubmit}
            style={{ marginTop: "70px", width: "70%" }}
          >
            <div className="custome-form w-100">
              <div className="form_controll">
                <div className="form_controll w-100">
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
                  minLength={6}
                />
              </div>

              <div className="form_controll ">
                <label htmlFor="name" className="form-label">
                  role
                </label>
                <select value={form.role} onChange={handleForm} name="role">
                  <option disabled> select role</option>
                  <option value="1995"> Admin</option>
                  <option value="2001"> user</option>
                  <option value="1996"> writer</option>
                  <option value="1999"> Product Manger</option>
                </select>
              </div>

              {error && <span className="error">{error}</span>}

              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
