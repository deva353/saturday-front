import { useEffect, useState } from "react";
import api from "../services/api";

const statuses = [
  "Placed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load orders."
      );
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(orderId, status) {
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/api/orders/admin/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Order status updated.");
      await fetchOrders();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update order."
      );
    }
  }

  return (
    <div className="orders-page">
      <h1>Admin Order Management</h1>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <button onClick={fetchOrders}>
        Refresh Orders
      </button>

      {orders.map((order) => (
        <article className="order-card" key={order._id}>
          <h3>Order #{order._id}</h3>

          <p>
            Customer: {order.user?.name || "Unknown"}
          </p>

          <p>
            Email: {order.user?.email || "Unavailable"}
          </p>

          <p>Total: ₹{order.totalAmount.toFixed(2)}</p>
          <p>Address: {order.deliveryAddress}</p>
          <p>Current status: {order.status}</p>

          <label htmlFor={`status-${order._id}`}>
            Update status
          </label>

          <select
            id={`status-${order._id}`}
            value={order.status}
            onChange={(e) =>
              updateStatus(order._id, e.target.value)
            }
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </article>
      ))}
    </div>
  );
}

export default AdminOrders;