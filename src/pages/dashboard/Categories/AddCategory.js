import { useEffect, useRef, useState } from "react";
import { baseURL } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import "./cat.css";
import Loading from "../../../component/loading/loading";
import { NewAxios } from "../../../api/CreateAxios";

export default function AddCategory() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title,setTitle]= useState("")
  const [image,setImage]= useState("")
const focus = useRef("")


useEffect(()=>{
  focus.current.focus()
},[])

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image); // Append file

    try {
      const response = await NewAxios.post(`${baseURL}/category/add`, formData, 
      );

      setLoading(false);
      console.log(response);
      navigate("/dashboard/categories");
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 422) {
        setError("This category title is already taken.");
      } else setError("Something went wrong");
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="category-container">
        <div className="row h-100">
          <form onSubmit={handleSubmit} style={{ width: "60%" }}>
            <div className="custom-for w-80">
              {/* Form Group for Title */}
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  ref={focus}
                  value={title}
                  name="title"
                  onChange={(e)=> setTitle(e.target.value)}
                  required
                  minLength={3}
                  placeholder="Enter category title"
                />
              </div>

              {/* Form Group for Image Upload */}
              <div className="form-group">
                <label htmlFor="image" className="form-label">
                  Upload Image
                </label>
                <input
                   type="file"
                   id="image"
                   className="form-control"
                   name="image"
                   onChange={(e) => setImage(e.target.files[0])} // Corrected here
                   accept="image/*"
                   required
                />
              </div>

              {error && <span className="error">{error}</span>}

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
