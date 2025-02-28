const BASE_URL = "https://web1finalprojectbackend.onrender.com/api";
// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await fetch("https://web1finalprojectbackend.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    return response.json();
  } catch (error) {
    throw error;
  }
};

// fetchMenu
export const fetchMenu = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { error: "Unauthorized: Please log in first." };

    const response = await fetch(`${BASE_URL}/menu`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menu. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return { error: "An error occurred while fetching the menu." };
  }
};








//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Add item to basket
export const addToBasket = async (item) => {
  try {
    const response = await fetch(`${BASE_URL}/basket/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return response.json();
  } catch (error) {
    console.error("Error adding to basket:", error);
  }
};

// Fetch basket items
export const fetchBasket = async () => {
  try {
    const response = await fetch(`${BASE_URL}/basket`);
    return response.json();
  } catch (error) {
    console.error("Error fetching basket:", error);
    return [];
  }
};

// Remove item from basket
export const removeFromBasket = async (itemId) => {
  try {
    const response = await fetch(`${BASE_URL}/basket/remove/${itemId}`, {
      method: "DELETE",
    });
    return response.json();
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

// Place order
export const placeOrder = async (orderData) => {
  try {
    const response = await fetch(`${BASE_URL}/order/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData), // Send the order data
    });
    return response.json();
  } catch (error) {
    console.error("Error placing order:", error);
  }
};



// Handle Add to Basket (Frontend)
export const handleAddToBasket = async (item, setBasket) => {
  try {
    const response = await fetch(`${BASE_URL}/basket/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        price: item.price,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setBasket(data.basket); // Update basket with new item
      alert("Item added to basket!");
    } else {
      alert("Failed to add item to basket.");
    }
  } catch (err) {
    console.error("Error adding to basket:", err);
    alert("An error occurred.");
  }
};

// Handle Login (Frontend)
export const handleLogin = async (email, password, navigate) => {
  const response = await fetch("https://web1finalprojectbackend.onrender.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token); // ذخیره توکن
    navigate("/menu");
  } else {
    console.error("Login failed");
  }
};
