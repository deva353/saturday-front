import { useState } from "react";
import api from "../services/api";

function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [foods, setFoods] = useState([]);

  // Add food item
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/food",
        {
          name,
          price: Number(price),
          category,
          image,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setDescription("");

      await fetchFoods();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to add food item"
      );
    }
  }

  // Fetch all food items
  async function fetchFoods() {
    try {
      const response = await api.get("/api/food");
      setFoods(response.data);
    } catch {
      setMessage("Unable to load food items");
    }
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <p>Add food items to your restaurant menu.</p>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Food name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="url"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Food</button>
      </form>

      {message && <p role="status">{message}</p>}

      <button type="button" onClick={fetchFoods}>
        Refresh Menu
      </button>

      <h2>Existing Food Items</h2>

     {foods.map((food) => (
  <div key={food._id} className="admin-food">
    <strong>{food.name}</strong>
    <span> — ₹{food.price}</span>
    <span> — {food.category}</span>

    <button
      type="button"
      onClick={() => handleEdit(food)}
    >
      Edit
    </button>

    <button
      type="button"
      onClick={() => handleDelete(food._id)}
    >
      Delete
    </button>
  </div>
))}
    </div>
  );
  async function handleEdit(food) {
  const name = window.prompt("Food name:", food.name);
  if (name === null) return;

  const price = window.prompt("Price:", food.price);
  if (price === null) return;

  const category = window.prompt("Category:", food.category);
  if (category === null) return;

  const numericPrice = Number(price);

  if (
    !name.trim() ||
    !category.trim() ||
    price.trim() === "" ||
    !Number.isFinite(numericPrice) ||
    numericPrice < 0
  ) {
    alert("Enter valid food details.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/api/food/${food._id}`,
      {
        name: name.trim(),
        price: numericPrice,
        category: category.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Food updated successfully");
    await fetchFoods();
  } catch (error) {
    alert(error.response?.data?.message || "Update failed");
  }
}

async function handleDelete(id) {
  if (!window.confirm("Are you sure you want to delete this food?")) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await api.delete(`/api/food/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Food deleted successfully");
    await fetchFoods();
  } catch (error) {
    alert(error.response?.data?.message || "Delete failed");
  }
}
}

export default Admin;