import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import "../styles.css";

const BasketPage = () => {
  const [basket, setBasket] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedBasket = JSON.parse(localStorage.getItem("basket")) || [];
    const filteredBasket = savedBasket.filter((order) => order.items?.length > 0);
    setBasket(filteredBasket);
  }, []);

  const calculateTotal = (items) => {
    return items.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const handleQuantityChange = (orderId, itemId, quantity) => {
    const updatedBasket = [...basket];
    const order = updatedBasket.find((order) => order.id === orderId);
    const item = order.items.find((item) => item.id === itemId);
    item.quantity = quantity > 0 ? quantity : 1;
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  const handleRemoveItem = (orderId, itemId) => {
    const updatedBasket = [...basket];
    const order = updatedBasket.find((order) => order.id === orderId);
    order.items = order.items.filter((item) => item.id !== itemId);
    if (order.items.length === 0) {
      updatedBasket.splice(updatedBasket.indexOf(order), 1); // Remove the entire order if no items left
    }
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  const handleRemoveOrder = (orderId) => {
    const updatedBasket = basket.filter((order) => order.id !== orderId);
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  // Handle submitting an order
  const handleSubmitOrder = async (orderId) => {
    const orderToSubmit = basket.find((order) => order.id === orderId);
    if (!orderToSubmit || orderToSubmit.items.length === 0) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to place an order!");
      navigate("/login");
      return;
    }

    const payload = {
      items: orderToSubmit.items,
      totalPrice: calculateTotal(orderToSubmit.items),
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Order placed successfully!");
        const updatedBasket = basket.filter((order) => order.id !== orderId);
        setBasket(updatedBasket);
        localStorage.setItem("basket", JSON.stringify(updatedBasket)); 
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.message}`);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="basket-container">
      <Navbar />
      <h2>Your Basket</h2>
      {basket.length > 0 ? (
        <div>

          {basket.map((order) => (
            <div key={order.id} className="order-container">
              <h3>Order {order.id}</h3>
              <ul className="basket-list">

                {order.items.map((item) => (
                  <li key={item.id} className="basket-item">
                    <span>{item.name} - ${(item.price || 0).toLocaleString()} x </span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || 1}
                      onChange={(e) =>
                        handleQuantityChange(order.id, item.id, parseInt(e.target.value))
                      }
                      className="quantity-input"
                    />
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(order.id, item.id)}
                    >
                      ❌
                    </button>
                  </li>
                ))}

              </ul>
              <h4>Total: ${(calculateTotal(order.items)).toLocaleString()}</h4>
              <button className="checkout-button" onClick={() => handleSubmitOrder(order.id)}>
                Submit Order
              </button>
              <button className="remove-order-button" onClick={() => handleRemoveOrder(order.id)}>
                Remove Order
              </button>
              
            </div>
          ))}
        </div>
      ) : (
        <p>Basket is empty</p>
      )}
      <button className="back-button" onClick={() => navigate("/menu")}>
        Back to Menu
      </button>
    </div>
  );
};

export default BasketPage;
