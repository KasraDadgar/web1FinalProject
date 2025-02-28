import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import "../styles.css";

const AdminPage = () => {
  const [menu, setMenu] = useState({});
  const [newDish, setNewDish] = useState({ name: "", price: "", category: "" });
  const [editingDish, setEditingDish] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch the menu on component mount
  const fetchMenu = () => {
    fetch("https://web1finalprojectbackend.onrender.com/api/menu", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Access Denied. No token provided") {
          setError("Unauthorized access. Please log in again.");
          navigate("/login");
        } else {
          setMenu(data.data || {});
        }
      })
      .catch((error) => {
        console.log("Error fetching menu:", error);
        setError("An error occurred while fetching the menu.");
      });
  };

  useEffect(() => {
    fetchMenu();
  }, [navigate]);

  const handleAddDish = () => {
    if (!newDish.name || !newDish.price || !newDish.category) {
      setError("All fields are required.");
      return;
    }

    fetch("https://web1finalprojectbackend.onrender.com/api/admin/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newDish),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setNewDish({ name: "", price: "", category: "" });
          setError("");
          fetchMenu();
        } else {
          setError(data.message || "Failed to add the dish.");
        }
      })
      .catch((error) => {
        console.log("Error adding dish:", error);
        setError("An error occurred while adding the dish.");
      });
  };

  // Edit an existing dish
  const handleEditDish = (dish) => {
    setEditingDish(dish);
    setNewDish({
      name: dish.name || "",
      price: dish.price || "",
      category: dish.category || "",
    });
  };

  // Save edited dish
  const handleSaveEdit = () => {
    if (!newDish.name || !newDish.price || !newDish.category) {
      setError("All fields must be filled.");
      return;
    }

    fetch(`https://web1finalprojectbackend.onrender.com/api/admin/menu/${editingDish.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newDish),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setNewDish({ name: "", price: "", category: "" });
          setEditingDish(null);
          setError("");
          fetchMenu();
        } else {
          setError(data.message || "Failed to update the dish.");
        }
      })
      .catch((error) => {
        console.log("Error editing dish:", error);
        setError("An error occurred while updating the dish.");
      });
  };

  // Delete a dish
  const handleDeleteDish = (dishId, category) => {
    fetch(`https://web1finalprojectbackend.onrender.com/api/admin/menu/${dishId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetchMenu(); 
          setError("");
        } else {
          setError(data.message || "Failed to delete the dish.");
        }
      })
      .catch((error) => {
        console.log("Error deleting dish:", error);
        setError("An error occurred while deleting the dish.");
      });
  };

  return (
    <div className="adminPage">
      <Navbar />
      <h2>Admin Menu Management</h2>

      {error && <div className="error-message">{error}</div>}

      <h3>{editingDish ? "Edit Dish" : "Add New Dish"}</h3>
      <input
        type="text"
        placeholder="Dish Name"
        value={newDish.name}
        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newDish.price}
        onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
      />
      <input
        type="text"
        placeholder="Category"
        value={newDish.category}
        onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
      />
      <button onClick={editingDish ? handleSaveEdit : handleAddDish}>
        {editingDish ? "Save Changes" : "Add Dish"}
      </button>

      <h3>Menu</h3>
      <ul>
        {menu && Object.keys(menu).length > 0 ? (
          Object.keys(menu).map((category, index) => (
            <li key={index}>
              <h4>{category}</h4>
              <ul>
                {menu[category] && menu[category].length > 0 ? (
                  menu[category].map((dish) => (
                    <li key={dish.id}>
                      {dish.name} - ${dish.price}
                      <button onClick={() => handleEditDish(dish)}>Edit</button>
                      <button onClick={() => handleDeleteDish(dish.id, category)}>
                        Delete
                      </button>
                    </li>
                  ))
                ) : (
                  <li>No dishes in this category.</li>
                )}
              </ul>
            </li>
          ))
        ) : (
          <li>No dishes available</li>
        )}
      </ul>
    </div>
  );
};

export default AdminPage;

