import { useEffect, useState } from "react";
import api from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load orders. Please log in."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <article className="order-card" key={order._id}>
          <h3>Order #{order._id}</h3>

          <p>
            Status: <strong>{order.status}</strong>
          </p>

          <p>
            Total: ₹{order.totalAmount.toFixed(2)}
          </p>

          <p>Delivery address: {order.deliveryAddress}</p>

          <h4>Items</h4>

          {order.items.map((item, index) => (
            <p key={`${order._id}-${index}`}>
              {item.name} × {item.quantity} — ₹
              {(item.price * item.quantity).toFixed(2)}
            </p>
          ))}

          <small>
            Ordered: {new Date(order.createdAt).toLocaleString()}
          </small>
        </article>
      ))}
    </div>
  );
}

export default MyOrders;