import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, child ,push} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// إعدادات Firebase
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

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// دالة لإضافة منتج إلى المفضلة باستخدام معرف فريد
function addToFavorites(product) {
  const favoritesRef = ref(db, "favorites");
  push(favoritesRef, {
    id: product.id, // يمكن تخزين معرف المنتج هنا للتعرف عليه لاحقًا
    name: product.name,
    image: product.image,
    price: product.price,
    details: product.details,
  })
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product added to wishlist',
        confirmButtonText: 'OK'
      });
    })
    .catch((error) => {
      console.error("Error adding to favorites:", error);
      alert("Failed to add product to favorites.");
    });
}


// الدالة لجلب البيانات وعرضها على DOM
async function getPerfumeMenItems() {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, "Products/PerfumeW"));
    if (snapshot.exists()) {
      const data = snapshot.val();

      // حاوية المنتجات
      const productContainer = document.querySelector(".product-container");
      productContainer.innerHTML = ""; // تفريغ المحتوى القديم

      // عرض كل منتج على DOM
      Object.entries(data).forEach(([key, perfume]) => {
        const productCard = document.createElement("div");
        productCard.className = "productCard";
        let category = "";
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${perfume.image}" alt="${perfume.name}">
            </div>
            <p class="nameProduct">${perfume.nameProduct}</p>
            <p class="detailsProduct">${perfume.detailsProduct}</p>
            <strong class="project-title">
                <span class="rate">
                    <i class="fa-solid fa-star" style="color: #b99765;"></i>
                    <i class="fa-solid fa-star" style="color: #b99765;"></i>
                    <i class="fa-solid fa-star" style="color: #b99765;"></i>
                    <i class="fa-solid fa-star" style="color: #b99765;"></i>
                    <i class="fa-solid fa-star" style="color: #b99765;"></i>
                </span>
            </strong>
            <p class="price">${perfume.price}.00JD</p>
          <div class="button-container">
            <a href="details.html?category=PerfumeW&id=${key}" class="more-details">View More</a>
                <button class="add-to-favorites" 
                    data-id="${key}" 
                    data-name="${perfume.nameProduct}" 
                    data-image="${perfume.image}" 
                    data-price="${perfume.price}" 
                    data-details="${perfume.detailsProduct}">
                    <span><i class="fa-solid fa-heart" style="color: #ed4040;"></i></span>
                </button>
            </div>
            `;

        // إضافة حدث النقر للزر "Add to Favorites"
        productCard.querySelector(".add-to-favorites").addEventListener("click", (e) => {
          const button = e.currentTarget; // استخدم e.currentTarget بدلاً من e.target
          const product = {
            id: button.getAttribute("data-id"),
            name: button.getAttribute("data-name"),
            image: button.getAttribute("data-image"),
            price: button.getAttribute("data-price"),
            details: button.getAttribute("data-details"),
          };
          addToFavorites(product);
        });

        productContainer.appendChild(productCard);
      });
    } else {
      console.log("No data available in perfumeMen");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// استدعاء الدالة
getPerfumeMenItems();
