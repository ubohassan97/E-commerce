import "./bar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartShopping,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Menu } from "../../context/MenuContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import Cookie from "cookie-universal";
import { NewAxios } from "../../api/CreateAxios";

export default function Topbar() {
  const [loading, setLoading] = useState(false);
  const menu = useContext(Menu);
  const setOpen = menu.setOpen;
  const navigate = useNavigate();
  const cookie = Cookie();
  const token = cookie.get("e-commerce");
  const [user, setUser] = useState({ name: "" });
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [id, setId] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const userResponse = await axios.get(`${baseURL}/user`, {
          headers: { authorization: "Bearer " + token },
        });
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    async function fetchCartItemsWithImages() {
      try {
        const res = await NewAxios.get("/cart");
        const cartItems = res.data;
  
        // Fetch images for each product in the cart
        const updatedCartItems = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const productRes = await NewAxios.get(`/product/${item.product_id}`);
              const productData = productRes.data[0];
              const image = productData.images?.[0]?.image || "/placeholder.jpg";
  
              return {
                ...item,
                productImage: image,
              };
            } catch (err) {
              console.error(`Error fetching product ${item.product_id}:`, err);
              return {
                ...item,
                productImage: "/placeholder.jpg",
              };
            } 
          })
        );
  
        setCartItems(updatedCartItems);
        setCartCount(updatedCartItems.length);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    }
  
    fetchCartItemsWithImages();
  }, []);
  

  // Logout Function
  async function handleLogOut() {
    setLoading(true);
    try {
      await NewAxios.get(`/logout`);
      cookie.remove("e-commerce");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="top-bar d-flex align-items-center justify-content-between p-3">
      <div className="topbar-left">
        <h3 className="logo">E-Commerce</h3>
        <FontAwesomeIcon
          icon={faBars}
          className="menu-icon"
          onClick={() => setOpen((prev) => !prev)}
        />
      </div>

      {/* Center - User Name */}
      <h3 className="username">{user.name || "Guest"}</h3>

      <div className="topbar-right d-flex">
        {/* User Icon */}
        <div className="user-container">
          <FontAwesomeIcon icon={faUser} />
        </div>

        <div
          className="cart-container"
          onMouseEnter={() => setShowCartDropdown(true)}
          onMouseLeave={() => setShowCartDropdown(false)}
        >
          <FontAwesomeIcon icon={faCartShopping} className="cart-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}

          {/* Cart Dropdown */} 
          {showCartDropdown && (
            <div className="cart-dropdown">
              {cartCount === 0 ? (
                <p className="empty-cart-message">Your cart is empty</p>
              ) : (
                <>
                  <div className="cart-items-list">
                    {cartItems.slice(0, 5).map((item) => (
                    
                      <div key={item.id} className="cart-item">
                        <img
                        src={item.productImage}
                        alt={item.products.title}
                          className="cart-item-image"
                        />
                        <div className="cart-item-details">
                          <h4>{item.products.title}</h4>
                          <p>
                            ${item.products.price}{" "}
                            <span style={{ fontSize: "12px", color: "grey" }}>
                              {" "}
                              count:({item.count})
                            </span>{" "}
                          </p>
                        </div>
                        <button
                          className="remove-item-btn"
                        
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>


                  {cartItems.length > 3 && (
                    <p className="more-items">
                      +{cartItems.length - 3} more items
                    </p>
                  )}
                  <div className="cart-dropdown-footer">
                    <button
                      className="view-cart-btn"
                      onClick={() => navigate("/cart")}
                    >
                      View Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          className="logout-btn"
          onClick={handleLogOut}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="logout-icon" />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
