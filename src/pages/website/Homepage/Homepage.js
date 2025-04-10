import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Homepage.css";
import { NavLink } from "react-router-dom";
import { NewAxios } from "../../../api/CreateAxios";
import { useNavigate } from "react-router-dom";
import Landing from "./Landing/Landing";
import LastProduct from "../../dashboard/Product/LastProduct";
import Skeleton from "react-loading-skeleton";
import TopRated from "../../dashboard/Product/TopRated";
export default function Homepage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [opencategory, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleCategoryTopBar = function () {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await NewAxios.get(`/categories`);
        setCategory(response.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response && err.response.status === 403) {
          navigate("/error403"); // Use navigate to redirect to the 403 page
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const showcategory = category
    .slice(-7)
    .map((item ,key) => (
      <a key={key} href="http://localhost:3000/dashboard/products" className="category_item">
        {item.title.length > 10 ? item.title.slice(0, 10) + "..." : item.title}
      </a>
    ));

  return (
    <div>
      <Landing />

      <div style={{ padding: "15px" }}>
        {loading ? (
          <Skeleton />
        ) : (
          <div onClick={handleCategoryTopBar} style={{ cursor:"pointer"}}>
            <FontAwesomeIcon icon={faBars} />
            Categories
          </div>
        )}
        <div
          className="category_bar"
          style={{ display: opencategory ? "flex" : "none" }}
        >
          {showcategory}
        </div>
      </div>
      {/* --------------------- */}
      <div className="background">
        <div className="Shampo" style={{ marginLeft: "10px" }}>
          <h1>Shampo </h1>
          <p>shopping with no effort to care with your body </p>
          <NavLink to={"dashboard/products"}>Shop Now</NavLink>
        </div>
      </div>
<div className="row">
      <div className="col-lg-12 col-md-12" style={{ display: "block" }}>
        <TopRated />

        <div className="col-lg-12 col-md-12"  style={{ width: "10%" }}></div>

        <LastProduct   />
      </div>
    </div></div>
  );
}
