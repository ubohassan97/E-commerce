import { useContext, useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { NewAxios } from "../../../api/CreateAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Menu } from "../../../context/MenuContext";
import { WindowSize } from "../../../context/windowSize";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../component/dashboard/pagination/Pagination";
import Transformdate from "../../../Auth/Date/Transformdate";
import "../users/index.css"; // Add custom styles if needed

export default function User() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Cat, setCat] = useState([]);
  const menu = useContext(Menu);
  const isopen = menu.isOpen;
  const windowSize = useContext(WindowSize);
  const winsize = windowSize.windsize;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState("");
  const [search, setSearch] = useState("");
  const [filterData, setFilter] = useState([]);
  const itemPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await NewAxios.get(
          `/categories?limit=${itemPerPage}&page=${page}`
        );
        setCat(response.data.data);
        setTotal(response.data.total);
        setFilter(response.data.data); // Use filtered data for rendering
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response && err.response.status === 403) {
          navigate("/error403");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [itemPerPage, page]);

  async function deleteUser(id) {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await NewAxios.delete(`/category/${id}`);
        setFilter(prev => prev.filter(cat => cat.id !== id)); // Remove deleted category from UI
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  }

  async function searchData() {
    try {
      if (search.trim() === "") {
        setFilter(Cat); // Show all categories when search is empty
        return;
      }
      const response = await NewAxios.post(`/category/search?title=${search}`);
      setFilter(response.data);
    } catch (err) {
      console.error("Error searching categories:", err);
    }
  }
  
  useEffect(() => {
    const debounce = setTimeout(() => {
      searchData();
    }, 800);
  
    return () => clearTimeout(debounce);
  }, [search]); // Only include search in dependencies

  return (
    <>
      <div
        style={{
          marginTop: "100px",
          marginLeft: winsize > 567 ? (isopen ? "240px" : "90px") : isopen ? "100px" : "0px",
        }}
      >
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Categories</h1>
            <input
              type="search"
              className="form-control w-25"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Link className="btn btn-primary" to="add">
              Add Category
            </Link>
          </div>

          {loading ? (
            <p>Loading categories...</p>
          ) : filterData.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <Row>
              {filterData.map((cat) => (
                <Col key={cat.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="shadow-sm">
                    {cat.image ? (
                      <Card.Img variant="top" src={cat.image} alt={cat.title} style={{ height: "350px", objectFit: "contain" }} />
                    ) : (
                      <div style={{ height: "200px", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        No Image
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title>
                        {cat.title.length > 10 ? cat.title.slice(0, 10) + "..." : cat.title}
                      </Card.Title>
                      <Card.Text>
                        Updated: {Transformdate(cat.update_at)}
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Link to={`${cat.id}`} className="btn btn-sm btn-outline-primary">
                          <FontAwesomeIcon icon={faUserPen} /> Edit
                        </Link>
                        <Button variant="outline-danger" size="sm" onClick={() => deleteUser(cat.id)}>
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Pagination Component */}
          <Pagination data={Cat} itemsPerPage={itemPerPage} setPage={setPage} total={total} />
        </Container>
      </div>
    </>
  );
}
