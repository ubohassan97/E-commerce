import { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { NewAxios } from "../../../api/CreateAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPen } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { Link, replace } from "react-router-dom";
import { Menu } from "../../../context/MenuContext";
import { WindowSize } from "../../../context/windowSize";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [loading, setloading] = useState(false);
  const [CurrentUser, setCurrentUser] = useState({});
  const [Users, setUsers] = useState([]);
  const menu = useContext(Menu);
  const isopen = menu.isOpen;
  const windowSize = useContext(WindowSize);
  const winsize = windowSize.windsize;
  const [search, setSearch] = useState("");
  const [filterData, setFilter] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setloading(true);
        const response = await NewAxios.get(`/users`);
        setUsers(response.data.data);
        const currentUserResponse = await NewAxios.get(`/user`);
        setCurrentUser(currentUserResponse.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response && err.response.status === 403) {
          navigate("/error403"); // Use navigate to redirect to the 403 page
        }
      } finally {
        setloading(false);
      }
    };

    fetchUsers();
  }, []);

  // search

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search.trim() === "") {
        setFilter(Users); // Show all users if search is empty
      } else {
        const filteredUsers = Users.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilter(filteredUsers); // Store filtered results in state
      }
    }, 800);
  
    return () => clearTimeout(debounce); // Cleanup function
  }, [search, Users]);
  
  function searchData() {
    return Users.filter((item) => 
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search.trim() === "") {
        setFilter(Users); // Reset filter to show all categories when search is empty
      } else {
        searchData();
      }
    }, 800);

    return () => clearTimeout(debounce); // Cleanup function to prevent multiple API calls
  }, [search, Users]);

  function deleteUser(id) {
    if (CurrentUser.id !== id) {
      if (window.confirm("Are you sure you want to delete this user?")) {
        NewAxios.delete(`/user/${id}`)
          .then(() => {
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
          })
          .catch((err) => {
            console.error("Error deleting user:", err);
          });
      }
    }
  }

  const showusers = filterData.map((u, key) => (
    <tr key={key}>
      <td>{key + 1}</td>
      <td>{u.name === CurrentUser.name ? u.name + " (You)" : u.name}</td>
      <td>{u.email}</td>
      <td>
        {u.role === "1995"
          ? "admin"
          : u.role === "2001"
          ? "user"
          : u.role === "1999"
          ? "product manger"
          : "writer"}
      </td>
      <td>
        {CurrentUser.name !== u.name ? (
          <div style={{ display: "flex" }}>
            <Link to={`${u.id}`} aria-label="Edit user">
              <FontAwesomeIcon className="update" icon={faUserPen} />
            </Link>
            <FontAwesomeIcon
              onClick={() => deleteUser(u.id)}
              className="delete"
              icon={faTrash}
              aria-label="Delete user"
              style={{ cursor: "pointer", marginLeft: "10px" }}
            />
          </div>
        ) : (
          ""
        )}
      </td>
    </tr>
  ));

  return (
    <>
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0,0,0, 0.2)",
          display: winsize < 767 ? "block" : "none",
        }}
      ></div>

      <div
        style={{
          marginTop: "100px",
          marginLeft:
            winsize > 567
              ? isopen
                ? "240px"
                : "90px"
              : isopen
              ? "100px"
              : "0px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px",
          }}
        >
          <h1>Users</h1>
          <div className="search-container">
            <input
              className="search-input"
              type="search"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <i className="search-icon fas fa-search"></i>
          </div>
          <Link className="btn btn-primary" to="add">
            Add User
          </Link>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>First Name</th>
              <th>email</th>
              <th>Role</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {Users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No user found
                </td>
              </tr>
            ) : (
              showusers
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}
