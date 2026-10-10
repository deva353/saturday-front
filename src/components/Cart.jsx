function Cart({ cart, onUpdateQuantity, onRemove }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div className="cart-item" key={item._id}>
            <div>
              <h3>{item.name}</h3>
              <p>₹{item.price} each</p>
            </div>

            <button
              onClick={() =>
                onUpdateQuantity(item._id, -1)
              }
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                onUpdateQuantity(item._id, 1)
              }
            >
              +
            </button>

            <button onClick={() => onRemove(item._id)}>
              Remove
            </button>
          </div>
        ))
      )}

      <h3>Total: ₹{total.toFixed(2)}</h3>
    </div>
  );
}

export default Cart;