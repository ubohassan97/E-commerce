import { useEffect, useRef, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { NewAxios } from "../../../../api/CreateAxios";
import { baseURL } from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import "./addproduct.css"


export default function ProductAdd() {
  const navigate = useNavigate();
  const [images, setImage] = useState([]);
  const [Cat, SetCAt] = useState([]);
  const [loading, setLoading] = useState(false);
  const sentRef = useRef(false); // No re-renders when updated
  const [Error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState({});
  const [id, setId] = useState();
  const ids = useRef([]);
  const [product, setProduct] = useState({
    category: "select category",
    title: "",
    price: "",
    description: "",
    discount: "",
    About: "",
    stock:""
  });

  const dummyProduct = {
    category: "",
    title: "dummy",
    price: 222,
    description: "dummy",
    discount: 0,
    About: "About",
    stock:5
  };

  async function handelDummySubmit() {
    try {
      const response = await NewAxios.post(`${baseURL}/product/add`, dummyProduct);
      setLoading(false);
      setId(response.data.id);

      //   navigate("/dashboard/categories");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }
    console.log(dummyProduct)
console.log(id)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (!sentRef.current) {
      handelDummySubmit();
      sentRef.current = true; // Doesn't trigger re-render
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await NewAxios.post(
        `${baseURL}/product/edit/${id}`,
        product
      );

      setLoading(false);
      setProduct(response.data);

      window.location.pathname = "/dashboard/products";
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  //   show category option
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await NewAxios.get(`/categories`);
        SetCAt(response.data.data);
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

  const ShowData = Cat.map((item, key) => (
    <option key={key} value={item.id}>
      {item.title}
    </option>
  ));
  //  handelImage

  const handelImage = async (e) => {
    setImage((prev) => [...prev, ...e.target.files]);
    const iamgeAsFiles = e.target.files;
    const data = new FormData();
    for (let i = 0; i < iamgeAsFiles.length; i++) {
      data.append("image", iamgeAsFiles[i]);
      data.append("product_id", id);

      try {
        const res = await NewAxios.post("/product-img/add", data);
        ids.current.push(res.data.id);
      } catch (err) {
        console.log(err);
      }
    }

    console.log("Uploaded Image IDs:", ids.current);
  };

  //   show uploded images

  const showimage = images.map((img, key) => (
    <div
      style={{
        border: " 1px solid rgb(87, 87, 87)",
        padding: "10px",
        margin: "5px",
      }}
      key={key}
    >
      <div className="image_load">
        <img src={URL.createObjectURL(img)} width={"120px"}></img>
        <div>
          <div style={{ padding: "10px", display: "block" }}>{img.name}</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="img_size">{Math.round(img.size / 1024)} KB</div>
            <button className="Delete" onClick={() => HandelDeleteImg(img)}>
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="custome_progress">
        <div
          className="inner_progress"
          style={{ width: `${uploadProgress[img.name] || 0}%` }}
        ></div>
      </div>
    </div>
  ));

  // image progress
  const handleUpload = (img) => {
    const fakeUploadTime = Math.random() * 2000 + 1000; // Simulate upload time
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prev) => ({ ...prev, [img.name]: progress }));

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, fakeUploadTime / 10);
  };
  useEffect(() => {
    images.forEach((img) => handleUpload(img));
  }, [images]);

  // Handel Image Delete

  async function HandelDeleteImg(img) {
    const findId = ids.current.find((imgId, index) => images[index] === img); // Find correct ID
    if (!findId) {
      console.error("Image ID not found!");
      return;
    }

    try {
      await NewAxios.delete(`/product-img/${findId}`);
      setImage((prev) => prev.filter((image) => image !== img)); // Remove from state
      ids.current = ids.current.filter((imgId) => imgId !== findId); // Remove from refs
      console.log("Deleted successfully");
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  }

  return (
    <div className="input_form">
      <Form onSubmit={handleSubmit} className="form_body">
        {/* Product Category */}
        <Form.Group className="mb-3">
          <Form.Label>Product Category</Form.Label>
          <Form.Select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option disabled>select category</option>
            {ShowData}
          </Form.Select>
        </Form.Group>

        {/* Product title */}
        <Form.Group className="mb-3">
          <Form.Label>Product Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product Title"
            name="title"
            value={product.title ?? ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Price */}
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            name="price"
            value={product.price ?? ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter product description"
            name="description"
            value={product.description ?? ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Discount */}
        <Form.Group className="mb-3">
          <Form.Label>Discount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter discount"
            name="discount"
            value={product.discount ?? ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* About */}
        <Form.Group className="mb-3">
          <Form.Label>About</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter product About"
            name="About"
            value={product.About ?? ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
  

        {/* Price */}
        <Form.Group className="mb-3">
          <Form.Label>stock</Form.Label>
          <Form.Control
            type="number"
            placeholder="stock"
            name="stock"
            value={product.stock ?? ""}
            onChange={handleChange}
            required
          />

        </Form.Group>
        {/* Image */}
        <Form.Group className="mb-3">
          <Form.Label>Product Image</Form.Label>
          <Form.Control
            multiple
            type="file"
            accept="image/*"
            onChange={handelImage}
            disabled={product.category === "select category"}
          />
        </Form.Group>
        {product.category === "select category" && (
          <div className="text-danger mt-2">
            ⚠ Please select a category first!
          </div>
        )}
        {/*-----------------------*/}
        {showimage}
        {/* Submit Button */}
        <button onClick={handleSubmit}>Send</button>
      </Form>
    </div>
  );
}
