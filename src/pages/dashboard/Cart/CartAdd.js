import { useEffect, useState } from "react";
import Slider from "react-slick";
import Landing from "../../website/Homepage/Landing/Landing.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CartAdd.css";
import { NewAxios } from "../../../api/CreateAxios.js";

export default function CartAdd() {
  const [cartItems, setCartItems] = useState([]);
const [Proimage , setPRoimage] =useState()
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
              const proimage = productData.images?.flat() || [];
              // console.log( productData)
          


              return {
                ...item,
                images: proimage, // store as `images`, not `productImage`
                products: productData, // ensure you have access to title, price                
              };
            } catch (err) {
              console.error(`Error fetching product ${item.product_id}:`, err);
              return {
                images: [],
                productImage: "/placeholder.jpg",
              };
            } 
          })
        );
        setCartItems(updatedCartItems);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    }
  
    fetchCartItemsWithImages();
  }, []);





  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <Landing />
      <div className="cart_container">
        {cartItems.length > 0 ? (
          cartItems.map((item, key) => (
            <div key={key} className="cart_item">
              {/* Carousel for Product Images */}
              <Slider {...settings} className="product_slider">
              {item.images.length > 0 ? (
    item.images.map((imG, index) => (
      <div key={index}>
        <img src={imG.image} alt="Product" className="product_image" />
      </div>
    ))
  ) : (
    <div>No images available</div>
  )}
              </Slider>

              {/* Product Details & Submit Button */}
              <div className="row">
                <div className="cart_details left">
                  <h1>{item.products.title}</h1>
                  <h2>${item.products.price}</h2>
                </div>
                <div className="cart_details right">
                  <button className="submit_button">Submit</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 className="empty_cart_message">Your cart is empty!</h2>
        )}
      </div>
    </>
  );
}
