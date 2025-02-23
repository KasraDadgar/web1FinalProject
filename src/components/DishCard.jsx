import React from 'react';
import '../styles.css'; 

const DishCard = ({ dish, onAddToOrder }) => (
  <div className="dish-card">
    <div className="dish-image">
      <h3 className="dish-name">{dish.name}</h3>
    </div>
    <p className="dish-price">{`$${dish.price}`}</p>
    
    <div className="dish-actions">
      <input
        type="number"
        min="1"
        defaultValue="1"
        id={`quantity-${dish.id}`}
        className="dish-quantity"
      />
      <button
        className="dish-button"
        onClick={() => {
          const quantity = parseInt(document.getElementById(`quantity-${dish.id}`).value);
          onAddToOrder(dish, quantity);
        }}
      >
        Add to Order
      </button>
    </div>
  </div>
);

export default DishCard;

