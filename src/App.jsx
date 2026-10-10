import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import ProtectedRoute from "./components/ProtectedRoute";

function Navigation() {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.assign("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/">Food App</Link>
      <Link to="/">Menu</Link>

      {token && <Link to="/my-orders">My Orders</Link>}

      {token && user?.role === "admin" && (
        <>
          <Link to="/admin">Admin</Link>
          <Link to="/admin/orders">Manage Orders</Link>
        </>
      )}

      {!token ? (
        <Link to="/login">Login</Link>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;