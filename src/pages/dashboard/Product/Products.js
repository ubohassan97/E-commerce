import { useContext, useEffect, useState } from "react";
import { NewAxios } from "../../../api/CreateAxios";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Carousel from "react-bootstrap/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePen,
  faStar,
  faStarHalfAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { WindowSize } from "../../../context/windowSize";
import { Menu } from "../../../context/MenuContext";
import NotFoundImg from "./notfound.jpg";
import Pagination from "../../../component/dashboard/pagination/Pagination";
import Transformdate from "../../../Auth/Date/Transformdate";
import "./product.css";
import Form from "react-bootstrap/Form";

export default function Products() {
  const [loading, setLoading] = useState(false);
  const windowSize = useContext(WindowSize);
  const winsize = windowSize.windsize;
  const menu = useContext(Menu);
  const isopen = menu.isOpen;
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [currentItems, setCurrentItems] = useState([]); // State for paginated items
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState("");
  const itemsPerPage = 6; // Number of items per page
  const [searchbyname, setSearch] = useState("");
  const [filterData, setFilter] = useState([]);
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await NewAxios.get(
          `/products?limit=${itemsPerPage}&page=${page}`
        );
        setProduct(response.data.data);
        setTotal(response.data.total);
        setCurrentItems(response.data.data.slice(0, itemsPerPage)); // Initially show the first 6 items
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response && err.response.status === 403) {
          navigate("/error403"); // Use navigate to redirect to the 403 page
        }
      }
    };

    fetchCategories();
  }, [itemsPerPage, page]);

  async function searchData() {
    try {
      const response = await NewAxios.post(
        `/product/search?title=${searchbyname}`
      );
      setFilter(response.data);
    } catch (err) {
      console.error("Error searching users:", err);
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchbyname.trim() === "") {
        setFilter(product); // Reset filter to show all categories when search is empty
      } else {
        searchData();
      }
    }, 800);

    return () => clearTimeout(debounce); // Cleanup function to prevent multiple API calls
  }, [searchbyname, product]); // Now listens to search input and category data

  // search by date
  // Step 1: Start with all products
  let filteredProducts = product;

  // Step 2: Apply search filter if there's a search query
  if (searchbyname.trim().length > 0) {
    filteredProducts = filterData;
  }

  // Step 3: Apply date filter if a date is selected
  if (date.length > 0) {
    filteredProducts = filteredProducts.filter(
      (item) => Transformdate(item.updated_at) === date
    );
  }

  // delete function
  async function handleDelete(id) {
    try {
      const res = await NewAxios.delete(`/product/${id}`);
      setProduct((prevProducts) =>
        prevProducts.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  }

  // update function
  function handleUpdate(id) {
    navigate(`./edit/${id}`);
  }

  // open SingleProduct
  function openProduct(id) {
    navigate(`./${id}`);
  }

  // save product in cart
  const HandleSave = () => {
    const savedProduct = JSON.parse(localStorage.getItem("product")) || [];
    savedProduct.push(Products);
    localStorage.setItem("product", JSON.stringify(savedProduct));
  };

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: "red",
        marginTop: "100px",
        marginLeft:
          winsize > 567
            ? isopen
              ? "240px"
              : "90px"
            : winsize < 567
            ? "20px"
            : isopen
            ? "50px"
            : "0px",
            
            position:"absolute",
            minWidth:"450px"
            
      }}
    >
      {/* Search Container */}
      <div className="search-container mb-4">
        <Form.Control
          className="data"
          onChange={(e) => setDate(e.target.value)}
          type="date"
          placeholder="Search by date"
        />
        <input
          className="search_input"
          type="search"
          placeholder="Search by title"
          value={searchbyname}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      <div className="row g-3 justify-content-center">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item, key) => (
            <div key={key} className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <Card className="shadow-lg border-0 rounded custome-card">
                <Card.Body>
                  {/* Image Slideshow */}
                  <Carousel interval={3000} controls={item.images.length > 1}>
                    {item.images.length > 0 ? (
                      item.images.map((imgObj, index) => (
                        <Carousel.Item key={index}>
                          <img
                            onClick={() => openProduct(item.id)}
                            className="d-block w-100 rounded"
                            src={imgObj.image}
                            alt={`Product ${index + 1}`}
                            width={"80px"}
                            height={"150px"}
                            style={{cursor:"pointer"}}
                          />
                        </Carousel.Item>
                      ))
                    ) : (
                      <Carousel.Item>
                        <img
                          className="d-block w-100 rounded"
                          src={NotFoundImg}
                          alt="Fallback Product"
                          width={"80px"}
                          height={"150px"}
                        />
                      </Carousel.Item>
                    )}
                  </Carousel>
                  <Card.Title
                    className="text-center fw-bold"
                    onClick={() => openProduct(item.id)}
                    style={{cursor:"pointer"}}
                  >
                    {item.title}
                  </Card.Title>
                  <Card.Text
                    className="text-muted text-center mt-3"
                    onClick={() => openProduct(item.id)}
                    style={{cursor:"pointer"}}
                  >
                    {item.description}
                  </Card.Text>
                  {/* Star Rating */}
                  <div className="star-rating text-center">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={i < item.rating ? faStar : faStarHalfAlt} // Use faStar for full, faStarHalfAlt for half
                        className={
                          i < item.rating ? "text-warning" : "text-muted"
                        }
                      />
                    ))}
                  </div>
                </Card.Body>
                <ListGroup className="list-group-flush text-center">
                  <ListGroup.Item className="fw-bold text-primary">
                    ${item.price}
                  </ListGroup.Item>
                  <ListGroup.Item onClick={() => openProduct(item.id)}>
                    {item.About}
                  </ListGroup.Item>
                  <ListGroup.Item className="text-danger">
                    {item.discount}% OFF
                    <ListGroup.Item className="fw-bold text-primary">
                      ${item.price}
                    </ListGroup.Item>
                    <ListGroup.Item className="fw-bold text-primary">
                      Avaliable Stock :{" "}
                      <span style={{ color: "red" }}>{item.stock}</span>
                    </ListGroup.Item>
                  </ListGroup.Item>
                  <ListGroup.Item className="text-primary">
                    {Transformdate(item.updated_at)}
                  </ListGroup.Item>
                  <ListGroup.Item className="fw-bold text-primary">
                    <FontAwesomeIcon
                      icon={faSquarePen}
                      onClick={() => handleUpdate(item.id)}
                      className="text-primary cursor-pointer"
                    />{" "}
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDelete(item.id)}
                      className="text-danger cursor-pointer"
                    />
                  </ListGroup.Item>
                </ListGroup>
                {/* Add to Cart Button */}
                <div className="text-center p-3">
                  <div className="flex items-center space-x-4 border p-2 rounded-lg shadow-md"></div>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No data found</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        data={product}
        itemsPerPage={itemsPerPage}
        setPage={setPage} // Pass setPage to update the current page
        total={total}
      />
    </div>
  );
}
