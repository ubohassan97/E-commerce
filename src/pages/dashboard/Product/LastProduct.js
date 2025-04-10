import { useEffect, useState } from "react";
import { Button, Card, Carousel, ListGroup } from "react-bootstrap";
import { NewAxios } from "../../../api/CreateAxios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faStar,
  faWebAwesome,
} from "@fortawesome/free-solid-svg-icons";
import Transformdate from "../../../Auth/Date/Transformdate";
import NotFoundImg from "./notfound.jpg";
import "./product.css";
import Skeleton from "react-loading-skeleton";

export default function LastProduct() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await NewAxios.get(`/latest`);
        setLoading(false); // Set loading to false after data is fetched

        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response && err.response.status === 403) {
          navigate("/error403"); // Redirect to the 403 page
        }
      }
    };

    fetchCategories();
  }, [navigate]);

  return (
    <div className="top_container">
      <h1 className="most_sale">Latest Sale Product</h1>

      {/* Loading Skeleton */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <Skeleton height={"300px"} width={"200px"} />
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-5 justify-content-center">
          {product.length > 0 ? (
            product.map((item, key) => {
              const stars = Math.min(item.rating, 5);
              const goldStar = Array.from({ length: stars }).map((_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  className="text-warning"
                />
              ));
              const blackStar = Array.from({ length: 5 - stars }).map(
                (_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    className="text-muted"
                  />
                )
              );

              return (
                <div key={key} className="col-lg-4 col-md-6 col-sm-12 g-3 card_container">
                  <Card className="shadow-lg border-0 rounded custome-card">
                    {/* Sale Icon */}
                    <div className="sale-icon">
                    <FontAwesomeIcon icon={faWebAwesome} />                                  </div>

                    <Card.Body>
                      <Card.Title className="text-center fw-bold">
                        {String(item.title).slice(0, 20)}
                        {item.title.length > 19 ? "..." : ""}
                      </Card.Title>

                      {/* Image Slideshow */}
                      <Carousel interval={3000} controls={item.images.length > 1}>
                        {item.images.length > 0 ? (
                          item.images.map((imgObj, index) => (
                            <Carousel.Item key={index}>
                              <img
                                className="d-block w-100 rounded"
                                src={imgObj.image}
                                alt={`Product ${index + 1}`}
                                width={"80px"}
                                height={"150px"}
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

                      <Card.Text className="text-muted text-center mt-3">
                        {String(item.description).slice(0,35)}
                        {item.description.length > 19 ? "..." : ""}
                      </Card.Text>

                      {/* Star Rating */}
                      <div className="star-rating text-center">
                        {goldStar}
                        {blackStar}
                      </div>
                    </Card.Body>

                    <ListGroup className="list-group-flush text-center">
                      <ListGroup.Item className="fw-bold text-primary">
                        ${item.price}
                      </ListGroup.Item>
                      <ListGroup.Item>{item.About}</ListGroup.Item>
                      <ListGroup.Item className="text-danger">
                        {item.discount}% OFF
                      </ListGroup.Item>
                      <ListGroup.Item className="text-primary">
                        {Transformdate(item.updated_at)}
                      </ListGroup.Item>
                    </ListGroup>

                    {/* Add to Cart Button */}
                    <div className="text-center p-3">
                      <Button variant="primary" className="w-100">
                        <FontAwesomeIcon icon={faCartPlus} className="me-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })
          ) : (
            <p className="text-center text-muted">No data found</p>
          )}
        </div>
      )}
    </div>
  );
}
