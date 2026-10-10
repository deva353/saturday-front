import { useEffect, useState } from "react";
import api from "../services/api";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";

function Home() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await api.get("/api/food");
        setFoods(response.data);
      } catch (err) {
        setError("Unable to load food menu.");
      }
    }

    fetchFoods();
  }, []);

  function addToCart(food) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item._id === food._id
      );

      if (existing) {
        return currentCart.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...food, quantity: 1 }];
    });
  }

  function updateQuantity(id, change) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== id)
    );
  }

  return (
    <main className="app">
      <h1>Food Ordering App</h1>

      {error && <p>{error}</p>}

      <h2>Food Menu</h2>

      <div className="food-grid">
        {foods.map((food) => (
          <article className="food-card" key={food._id}>
            {food.image && (
              <img src={food.image} alt={food.name} />
            )}

            <h3>{food.name}</h3>
            <p>{food.category}</p>
            <p>₹{food.price}</p>

            <button onClick={() => addToCart(food)}>
              Add to Cart
            </button>
          </article>
        ))}
      </div>

      <Cart
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <Checkout
        cart={cart}
        onOrderPlaced={() => setCart([])}
      />
    </main>
  );
}

export default Home;