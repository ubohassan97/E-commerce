import { useEffect, useState } from "react";
import { Button, Card, Carousel, ListGroup } from "react-bootstrap";
import { NewAxios } from "../../../api/CreateAxios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faCartPlus,
  faStar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import Transformdate from "../../../Auth/Date/Transformdate";
import NotFoundImg from "./notfound.jpg";
import "./product.css";
import Skeleton from "react-loading-skeleton";

export default function TopRated() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await NewAxios.get(`/top-rated`);
        setLoading(false); // Set loading to false after data is fetched

        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response && err.response.status === 403) {
          navigate("/error403"); // Use navigate to redirect to the 403 page
        }
      }
    };

    fetchCategories();
  }, [navigate]);

  return (
    <div className="top_container">
      <h1 className="top_rated">Top Rated Product </h1>
      {/* Products Grid */}
      {loading ? (
        <div style={{ display: "block", justifyContent: "space-around" }}>
          <div className=" col-12">
            <Skeleton height={"300px"} width={"80%"} />
          </div>
          <div className="col-12">
            <Skeleton height={"300px"} width={"80%"} />
          </div>
          <div className="col-12">
            <Skeleton height={"300px"} width={"80%"} />
          </div>
          <div className="col-12">
            <Skeleton height={"300px"} width={"80%"} />
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          {product.length > 0 ? (
            product.map((item, key) => {
              const stars = Math.min(item.rating, 5); // Ensure rating is between 0 and 5
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
                <div key={key} className="col-lg-6 col-md-12 top_card">
                  <Card className="shadow-lg border-0 rounded custome-card">
                    {/* Sale Icon */}
                    <div className="award-icon">
                      <FontAwesomeIcon icon={faAward} />
                    </div>

                    <Card.Body>
                      <Card.Title className="text-center fw-bold">
                        {String(item.title).slice(0, 20)}
                        {item.title.length > 19 ? "..." : ""}
                      </Card.Title>
                      {/* Image Slideshow */}
                      <Carousel
                        interval={3000}
                        controls={item.images.length > 1}
                      >
                        {item.images.length > 0 ? (
                          item.images.map((imgObj, index) => (
                            <Carousel.Item key={index}>
                              <div
                                style={{
                                  width: "100%",
                                  height: "200px",
                                  overflow: "hidden",
                                  
                                }}
                              >
                                <img
                                  className="d-block w-100 rounded"
                                  src={imgObj.image}
                                  alt={`Product ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            </Carousel.Item>
                          ))
                        ) : (
                          <Carousel.Item>
                            <img
                              className="d-block w-100 rounded"
                              src={NotFoundImg}
                              alt="Fallback Product"
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "contain",
                              }}
                            />
                          </Carousel.Item>
                        )}
                      </Carousel>
                      <Card.Text className="text-muted text-center mt-3">
                      {String(item.description).slice(0, 35)}
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
