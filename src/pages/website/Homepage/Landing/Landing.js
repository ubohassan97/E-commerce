import logo from "../logo.png";
import { faCartShopping, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const [cartCount, setCartCount] = useState(0);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load Cart from LocalStorage
  useEffect(() => {
    const initialCart = JSON.parse(localStorage.getItem("product")) || [];
    const validProducts = initialCart.filter((item) => item !== null && item !== undefined);
    
    setCartItems(validProducts);
    setCartCount(validProducts.length);
  }, []);

  // Log updates when cartItems change
  useEffect(() => {
  }, [cartItems]);

  // Remove Item from Cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem("product", JSON.stringify(updatedCart));
  };

  const goToCart = () => {
    navigate("/cart");
    setShowCartDropdown(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // navigate("/login");
  };

  return (
    <div className="topbar">
      {/* Left: Logo */}
      <div className="logo">
        <img src={logo} alt="Company Logo" />
      </div>

      {/* Center: Search Input */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search..." 
          className="search-input" 
          aria-label="Search products"
        />
      </div>

      {/* Right: Icons */}
      <div className="user-icon" style={{ margin: "10px" }}>
        <FontAwesomeIcon icon={faUser} aria-label="User profile" />
      </div>
      
      {/* Cart Icon with Dropdown */}
      <div 
        className="cart-container"
        onMouseEnter={() => setShowCartDropdown(true)}
        onMouseLeave={() => setShowCartDropdown(false)}
        aria-haspopup="true"
        aria-expanded={showCartDropdown}
      >
        <div className="cart-icon-wrapper">
          <FontAwesomeIcon 
            icon={faCartShopping} 
            className="cart-icon" 
            aria-label="Shopping cart"
          />
          {cartCount > 0 && (
            <span className="cart-badge" aria-label={`${cartCount} items in cart`}>
              {cartCount}
            </span>
          )}
        </div>
        
        {/* Cart Dropdown */}
        {showCartDropdown && (
          <div className="cart-dropdown" role="menu">
            {cartItems.length === 0 ? (
              <p className="empty-cart-message">Your cart is empty</p>
            ) : (
              <>
                <div className="cart-items-list">
                  {cartItems.slice(0, 3).map(item => (
                    <div key={item.id} className="cart-item" role="menuitem">
                      <img 
                        src={item.images?.[0]?.image || logo} 
                        alt={item.title} 
                        className="cart-item-image"
                        onError={(e) => {
                          e.target.src = logo; 
                        }}
                      />
                      <div className="cart-item-details">
                        <h4>{item.title}</h4>
                        <p>${item.price}</p>
                      </div>
                      <button 
                        className="remove-item-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {cartItems.length > 3 && (
                  <p className="more-items">+{cartItems.length - 3} more items</p>
                )}
                <div className="cart-dropdown-footer">
                  <button 
                    className="view-cart-btn" 
                    onClick={goToCart}
                    aria-label="View full cart"
                  >
                    View Cart
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <div 
        className="user-icon" 
        style={{ margin: "10px" }}
        onClick={handleLogout}
        role="button"
        aria-label="Logout"
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
      </div>
    </div>
  );
}
