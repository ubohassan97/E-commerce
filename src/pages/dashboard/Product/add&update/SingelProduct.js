import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { NewAxios } from "../../../../api/CreateAxios";
import "./addproduct.css";
import { Menu } from "../../../../context/MenuContext";
import { WindowSize } from "../../../../context/windowSize";
import { baseURL } from "../../../../api/api";


export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [savedProduct, setSave] = useState();
  const menu = useContext(Menu);
  const isopen = menu.isOpen;
  const windowSize = useContext(WindowSize);
  const winsize = windowSize.windsize;
  const [quantity, setQuantity] = useState(1);
const navigate = useNavigate()
  // Fetch product data
  useEffect(() => {
    NewAxios.get(`/product/${id}`)
      .then((res) => {
        const fetchedProduct = res.data[0];
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        }
      })

      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("product")) || [];
    const existing = cart.find((pro) => pro.id === id);
    if (existing) {
      setQuantity(existing.count);
    }
  }, [id]);
  if (!product) {
    return <p>Loading...</p>;
  }


  // Prepare images for react-image-gallery
  const images = product.images?.map((img) => ({
    original: img.image,
    thumbnail: img.image,
  })) || [
    {
      original: "/placeholder.jpg",
      thumbnail: "/placeholder.jpg",
    },
  ];

  // Save product in cart
  const HandleSave = async () => {
    try {
      const res = await NewAxios.post("/cart", {
        product_id: product.id,
        count: quantity,
      });

      console.log("Cart updated:", res.data);
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }finally{ window.location = `http://localhost:3000/dashboard/products`
    }
  };



  function increaseQuantity(id) {
    setQuantity((prevQty) => prevQty + 1);
  }

  function decreaseQuantity(id) {
    quantity > 1 && setQuantity((prevQty) => prevQty - 1);
  }

  return (
    <div className="row align-items-start">
      {/* Product Section */}
      <div
        className="col-lg-6 col-md-6 col-sm-12"
        style={{
          marginTop: "120px",
          marginLeft:
          winsize > 567
          ? isopen
            ? "290px"
            : "90px"
          : winsize < 567
          ? "20px"
          : isopen
          ? "100px"
          : "0px",
        }}
      >
        <div className="product-container">
          {/* Product Image Gallery */}
          <ImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={false}
          />

          {/* Product Details */}
          <div className="product-details">
            <h1 className="product-title">{product.title}</h1>
            <p className="product-category">{product.category}</p>
            <p className="product-description">{product.description}</p>

            {/* Price Section */}
            <div className="product-pricing">
              <span className="price">${product.price}</span>
              {product.discount > 0 && (
                <span className="discount">{product.discount}% OFF</span>
              )}
            </div>

            {/* Rating Section */}
            <div className="product-rating">⭐ {product.rating} / 5</div>
            <div className="product-stock"> Stock: {product.stock} </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button className="buy-now">Buy Now</button>
              <button
                className="add-to-cart"
                onClick={HandleSave}
                disabled={product.stock === 0}
                style={{background : product.stock ===0 ?"hsl(0, 0%, 50%,0.4)" :"#ffaa00" ,
                  cursor: product.stock === 0 ?"default" : "pointer"
                 }}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                
              </button>
              <button
                onClick={() => decreaseQuantity(product.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => increaseQuantity(product.id)}
                className="px-3 py-1 bg-green-500 text-white rounded-lg"
              >
                +
              </button>
              <span className="ml-2">🛒</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
