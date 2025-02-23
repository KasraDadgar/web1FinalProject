import React, { useState, useEffect } from "react";
import DishCard from "../components/DishCard";
import Navbar from '../components/Navbar';
import { fetchMenu } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const MenuPage = () => {
  const [categories, setCategories] = useState({});
  const [basket, setBasket] = useState(() => JSON.parse(localStorage.getItem("basket")) || []);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMenu();

        if (data?.data) {
          setCategories(data.data);
        } else {
          setError("Menu data is invalid or empty.");
        }
      } catch (error) {
        setError("Error fetching menu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToOrder = (dish, quantity) => {
    setBasket((prevBasket) => {
      const updatedBasket = [...prevBasket];
      const currentOrder = updatedBasket.length ? updatedBasket[updatedBasket.length - 1] : { id: Date.now(), items: [] };

      const updatedOrder = {
        ...currentOrder,
        items: currentOrder.items.some((item) => item.id === dish.id)
          ? currentOrder.items.map((item) =>
              item.id === dish.id ? { ...item, quantity: item.quantity + quantity } : item
            )
          : [...currentOrder.items, { ...dish, quantity }],
      };

      if (updatedBasket.length === 0 || updatedBasket[updatedBasket.length - 1].id !== currentOrder.id) {
        updatedBasket.push(updatedOrder);
      } else {
        updatedBasket[updatedBasket.length - 1] = updatedOrder;
      }

      localStorage.setItem("basket", JSON.stringify(updatedBasket));
      return updatedBasket;
    });
  };

  const handleCreateOrder = () => {
    setIsMenuVisible(true);
    const newOrder = { id: Date.now(), items: [] };
    setBasket((prevBasket) => {
      const updatedBasket = [...prevBasket, newOrder];
      localStorage.setItem("basket", JSON.stringify(updatedBasket));
      return updatedBasket;
    });
  };

  return (
    <div className="menu-page-container">
      <Navbar />

      <div className="menu-title-container">
        <h2 className="menu-title">Menu</h2>
        {error && <p className="error-message">{error}</p>}
      </div>

      {!isMenuVisible && (
        <button
          aria-label="Start a new order"
          className="start-order-btn"
          onClick={handleCreateOrder}
        >
          Start a New Order
        </button>
      )}

      {loading ? (
        <div className="loader">Loading menu...</div>
      ) : (
        isMenuVisible && (
          <div className="menu-categories-container">
            <div className="menu-categories">

              {Object.keys(categories).length > 0 ? (
                Object.keys(categories).map((categoryKey, index) => (
                  <div key={categoryKey || index}>
                    <h3 className="category-title">{categoryKey}</h3>
                    <div className="dish-grid">
                      {categories[categoryKey]?.length > 0 ? (
                        categories[categoryKey].map((dish) => (
                          <div key={dish.id}>
                            <DishCard dish={dish} onAddToOrder={handleAddToOrder} />
                          </div>
                        ))
                      ) : (
                        <p>No dishes available in this category.</p>
                      )}
                      
                    </div>
                  </div>
                ))
              ) : (
                <p>No categories available.</p>
              )}
            </div>

            <button
              className="view-basket-btn"
              onClick={() => navigate("/basket")}
            >
              View Basket ({basket.reduce((total, order) => total + (order.items ? order.items.length : 0), 0)})
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default MenuPage;
