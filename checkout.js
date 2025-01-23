// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  push,
  remove
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs4qjVud0NE6lkf-0GEa6VxFaLUhQGiGM",
  authDomain: "contacttest-b225c.firebaseapp.com",
  projectId: "contacttest-b225c",
  storageBucket: "contacttest-b225c.appspot.com",
  messagingSenderId: "968546523734",
  appId: "1:968546523734:web:01428f94a0d62c66c139f7",
  measurementId: "G-N9265PDPQ4",
  databaseURL: "https://gift-16723-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// Utility functions
const formatPrice = (price) => `${parseFloat(price).toFixed(2)} JD`;

// Auto-fill user data
function autoFillUserData() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    document.getElementById("Name").value = userData.username || "";
    document.getElementById("phone").value = userData.phoneNumber || "";
    document.getElementById("email").value = userData.email || "";
  }
}


// Fetch purchases from Firebase
async function fetchPurchases() {
  const purchasesRef = ref(database, "purchases");
  const snapshot = await get(purchasesRef);

  if (snapshot.exists()) {
    const purchases = [];
    snapshot.forEach((childSnapshot) => {
      const purchase = childSnapshot.val();
      purchases.push({
        id: childSnapshot.key,  // إضافة المفتاح الفريد للعنصر
        name: purchase.name,
        price: parseFloat(purchase.price),
      });
    });
    return purchases;
  } else {
    Swal.fire("No products found!", "No purchases found in the database.", "info");
    return [];
  }
}

// حذف المنتج من Firebase مع تأكيد SweetAlert
async function deleteProduct(productId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You can't undo this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete Product",
    cancelButtonText: "Cancel"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await remove(ref(database, `purchases/${productId}`));
        Swal.fire("Deleted!", "The product has been successfully deleted.", "success");
        renderOrderSummary(); // إعادة تحميل القائمة بعد الحذف
      } catch (error) {
        Swal.fire("ُError", "An error occurred while deleting the product.", "error");
      }
    }
  });
}

// Render order summary
async function renderOrderSummary() {
  const items = await fetchPurchases();
  const productList = document.getElementById("productList");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  // Clear existing content
  productList.innerHTML = "";

  // Render each product with delete button
  items.forEach((item) => {
    const productElement = document.createElement("div");
    productElement.className = "product-item";
    productElement.innerHTML = `
      <div class="product-details">
        <h5>${item.name}</h5>
        <p class="product-price">${formatPrice(item.price)}</p>
      </div>
      <button class="delete-btn" onclick="deleteProduct('${item.id}')"><i class="fa-solid fa-trash"></i></button>
    `;
    productList.appendChild(productElement);
  });

  // Update totals
  const { subtotal, total } = calculateTotals(items);
  subtotalElement.textContent = formatPrice(subtotal);
  totalElement.textContent = formatPrice(total);
}

// Calculate totals
function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = 2.0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

// Create confirmation card
function createConfirmationCard(formData, items) {
  const confirmationCard = document.getElementById("confirmationCard");
  const { subtotal, shipping, total } = calculateTotals(items);

  confirmationCard.innerHTML = `
    <div class="p-4">
      <h4 class="mb-3">Order Confirmation</h4>
      <div class="mb-3">
        <strong>Order Details:</strong>
        <p>Name: ${formData.firstName}</p>
        <p>Email: ${formData.email}</p>
        <p>Shipping to: ${formData.country}</p>
        <p>Payment Method: ${formData.paymentMethod}</p>
      </div>
      <div class="mb-3">
        <strong>Order Summary:</strong>
        <p>Subtotal: ${formatPrice(subtotal)}</p>
        <p>Shipping: ${formatPrice(shipping)}</p>
        <p class="font-weight-bold">Total: ${formatPrice(total)}</p>
      </div>
      <div class="alert alert-success" role="alert">
        Your order has been placed successfully! A confirmation email will be sent to ${formData.email}.
      </div>
    </div>
  `;

  confirmationCard.style.display = "block";
}

// Handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  // Validate form
  const requiredFields = ["Name", "phone", "email", "country", "paymentMethod"];
  let isValid = true;

  requiredFields.forEach((field) => {
    const input = document.getElementById(field);
    if (!input.value.trim()) {
      isValid = false;
      input.style.border = "2px solid red";
    } else {
      input.style.border = "1px solid #ccc";
    }
  });

  if (!isValid) {
    alert("Please fill out all required fields.");
    return;
  }

  // Collect form data
  const formData = {
    firstName: document.getElementById("Name").value.trim(),
    country: document.getElementById("country").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    paymentMethod: document.getElementById("paymentMethod").value.trim(),
    items: await fetchPurchases(),
    orderDate: new Date().toISOString(),
  };

  try {
    // Save to Firebase
    const ordersRef = ref(database, "orders");
    await push(ordersRef, formData);

    // Create confirmation card
    createConfirmationCard(formData, formData.items);

    // Clear cart and disable form
    document.getElementById("billingForm").style.opacity = "0.5";
    document.getElementById("billingForm").style.pointerEvents = "none";

    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Order Placed',
      text: 'Your order was placed successfully!',
    });
    } catch (error) {
    console.error("Error processing order:", error);
    alert("An error occurred while processing your order. Please try again.");
  }
}


// Make deleteProduct function available globally
window.deleteProduct = deleteProduct;

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
  // Auto-fill user data
  autoFillUserData();

  // Render order summary with data from Firebase
  await renderOrderSummary();

  // Set up form submission handler
  const billingForm = document.getElementById("billingForm");
  billingForm.addEventListener("submit", handleFormSubmit);

  // Handle payment method changes
  const paymentMethod = document.getElementById("paymentMethod");
  paymentMethod.addEventListener("change", (e) => {
    console.log("Selected payment method:", e.target.value);
  });
});