import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/website/Homepage/Homepage";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import User from "./pages/dashboard/users/User.js";
import "./App.css";
import "./index.css";
import Callback from "./Auth/google/Callback";
import Dashboard from "./pages/dashboard/Dashboard";
import RequireAuth from "./Auth/RequireAuth.js";
import UserUpdate from "./pages/dashboard/users/UserUpdate.js";
import AddUser from "./pages/dashboard/users/AddUser.js";
import Error403 from "./Auth/Error403/Erorr403.js";
import Writer from "./Auth/Writer/Writer.js";
import Error404 from "./Auth/Error404/Error404.js";
import RequireBack from "./Auth/ReqiureBack.js";
import Categories from "./pages/dashboard/Categories/Categories.js";
import AddCategory from "./pages/dashboard/Categories/AddCategory.js";
import UpdateCategory from "./pages/dashboard/Categories/UpdateCategory.js";
import Products from "./pages/dashboard/Product/Products.js";
import UpdateProduct from "./pages/dashboard/Product/add&update/UpdateProduct.js";
import ProductAdd from "./pages/dashboard/Product/add&update/ProductAdd.js";
import SingelProduct from "./pages/dashboard/Product/add&update/SingelProduct.js";
import CartAdd from "./pages/dashboard/Cart/CartAdd.js";


 function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/cart" element={<CartAdd />} />
        {/* RequireBack  */}
        <Route element={<RequireBack />}>
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/auth/google/callback" element={<Callback />} />
        <Route path="error403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
        {/* Authentication  */}
        <Route element={<RequireAuth AllowedRole={["1995", "1996","1999","2001"]} />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route element={<RequireAuth AllowedRole={["1995"]} />}>
              <Route path="user" element={<User />} />
              <Route path="user/:id" element={<UserUpdate />} />
              <Route path="user/add" element={<AddUser />} />
            </Route>
            <Route element={<RequireAuth AllowedRole={["1995","1999","2001"]} />}>
              <Route path="categories" element={<Categories />} />
              <Route path="categories/add" element={<AddCategory /> } />
              <Route path="categories/:id" element={<UpdateCategory /> } />


            </Route>

            <Route element={<RequireAuth AllowedRole={["1995", "1996","2001"]} />}>
              <Route path="writer" element={<Writer />} />
            </Route>

            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<ProductAdd />}/>
            <Route path="products/edit/:id" element={<UpdateProduct />}/>
            <Route path="products/:id" element={<SingelProduct />} />

          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
