import { useState } from "react";
import api from "../services/api";

function Checkout({ cart, onOrderPlaced }) {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckout(e) {
    e.preventDefault();
    setMessage("");

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in before checkout.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/orders",
        {
          items: cart.map((item) => ({
            foodId: item._id,
            quantity: item.quantity,
          })),
          deliveryAddress: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `Order placed successfully! Order ID: ${response.data.order._id}`
      );

      onOrderPlaced();
      setAddress("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to place your order."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="checkout">
      <h2>Checkout</h2>

      <form onSubmit={handleCheckout}>
        <label htmlFor="deliveryAddress">
          Delivery address
        </label>

        <textarea
          id="deliveryAddress"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your complete delivery address"
          required
          maxLength={500}
        />

        <button
          type="submit"
          disabled={loading || cart.length === 0}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
    </section>
  );
}

export default Checkout;