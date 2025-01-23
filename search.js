import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs4qjVud0NE6lkf-0GEa6VxFaLUhQGiGM",
  authDomain: "contacttest-b225c.firebaseapp.com",
  projectId: "contacttest-b225c",
  storageBucket: "contacttest-b225c.appspot.com",
  messagingSenderId: "968546523734",
  appId: "1:968546523734:web:01428f94a0d62c66c139f7",
  measurementId: "G-N9265PDPQ4",
  databaseURL: "https://gift-16723-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to fetch products from all collections
async function fetchAllProducts() {
  const dbRef = ref(db);
  const collections = [
    "Products/naturalProducts",
    "Products/hairCare",
    "Products/bodyCare",
    "Products/perfumWomen",
    "Products/perfumMen"
  ];
  const allProducts = [];

  try {
    for (const collection of collections) {
      const snapshot = await get(child(dbRef, collection));
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Add the collection name for reference
        Object.entries(data).forEach(([key, product]) => {
          allProducts.push({
            id: key,
            collection,
            ...product
          });
        });
      }
    }
    return allProducts;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Get the search query from the URL
function getSearchQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("query") || "";
}

// Handle the search functionality
async function handleSearch(query) {
  const products = await fetchAllProducts();

  // Filter the products based on the query
  const filteredProducts = products.filter((product) =>
    product.nameProduct.toLowerCase().includes(query.toLowerCase())
  );

  displaySearchResults(filteredProducts);
}

// Display the search results
function displaySearchResults(results) {
  const productContainer = document.querySelector(".product-container");
  productContainer.innerHTML = ""; // Clear existing content

  if (results.length === 0) {
    productContainer.innerHTML = "<p>No matching products found.</p>";
    return;
  }

  results.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "productCard";

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.nameProduct}">
      </div>
      <p class="nameProduct">${product.nameProduct}</p>
      <p class="detailsProduct">${product.detailsProduct}</p>
      <strong class="project-title">
        <span class="rate">
          <i class="fa-solid fa-star" style="color: #b99765;"></i>
          <i class="fa-solid fa-star" style="color: #b99765;"></i>
          <i class="fa-solid fa-star" style="color: #b99765;"></i>
          <i class="fa-solid fa-star" style="color: #b99765;"></i>
          <i class="fa-solid fa-star" style="color: #b99765;"></i>
        </span>
      </strong>
      <p class="price">${product.price}.00JD</p>
    `;

    productContainer.appendChild(productCard);
  });
}

// Main Function
(async function () {
  const query = getSearchQuery();
  if (query) {
    await handleSearch(query);
  } else {
    document.querySelector(".product-container").innerHTML = "<p>No search query provided.</p>";
  }
})();
