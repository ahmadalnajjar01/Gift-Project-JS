import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// إعدادات Firebase
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

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// تحقق من تسجيل دخول المستخدم
function isUserSignedIn() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return userData && userData.email; // تحقق من وجود بيانات المستخدم والبريد الإلكتروني
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const productId = urlParams.get("id");

  if (category && productId) {
    try {
      // جلب بيانات المنتج من Firebase
      const dbRef = ref(db);
      const snapshot = await get(
        child(dbRef, `Products/${category}/${productId}`)
      );

      if (snapshot.exists()) {
        const product = snapshot.val();

        // عرض بيانات المنتج
        document.querySelector(".product-header img").src = product.image;
        document.querySelector(".product-header img").alt = product.nameProduct;
        document.querySelector(".product-header h1").textContent =
          product.nameProduct;
        document.querySelector(".rating").textContent = "★★★★★";
        document.querySelector(
          ".details"
        ).textContent = `Details: ${product.detailsProduct}`;
        document.querySelector(".price").textContent = `${product.price}.00 JD`;

        // إضافة وظيفة زر الشراء
        document
          .getElementById("buyNowBtn")
          .addEventListener("click", async () => {
            if (!isUserSignedIn()) {
              // إذا لم يتم تسجيل الدخول، عرض تنبيه أو توجيه المستخدم لتسجيل الدخول
              Swal.fire({
                icon: "error",
                title: "Login Required",
                text: "You must be signed in to proceed to checkout. Redirecting to the signup page...",
              }).then(() => {
                window.location.href = "signinup.html";
              });
              return; // إيقاف العملية
            }

            try {
              // إرسال البيانات إلى Firebase
              const purchaseRef = ref(db, "purchases");
              await push(purchaseRef, {
                name: product.nameProduct,
                price: product.price,
                image: product.image,
                timestamp: new Date().toISOString(),
              });

              // عرض رسالة نجاح
              Swal.fire({
                icon: "success",
                title: "Purchase Added",
                text: "The product has been added to your cart successfully!",
              });

              // توجيه المستخدم إلى صفحة السلة
              window.location.href = "checkout.html";
            } catch (error) {
              console.error("Error adding purchase:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while adding the product to your cart.",
              });
            }
          });
      } else {
        console.error("Product not found.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  } else {
    console.error("No category or product ID found in URL.");
  }
});

//////////////////////////reviw/////////////////////////////////////

// معالجة إرسال النموذج

document
  .getElementById("reviewForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    if (!isUserSignedIn()) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You must be signed in to submit a review. Redirecting to the signup page...",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "signinup.html"; // إعادة التوجيه إلى صفحة التسجيل
      });
      return;
    }

    const name = document.getElementById("name").value;
    const rating = document.querySelector(
      'input[name="rating"]:checked'
    )?.value;
    const review = document.getElementById("review").value;

    if (name && rating && review) {
      // إرسال البيانات إلى Firebase
      const reviewsRef = ref(db, "reviews");
      push(reviewsRef, {
        name: name,
        rating: rating,
        review: review,
      });

      Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Thank you for your feedback!",
        confirmButtonText: "OK",
      });

      // تنظيف النموذج بعد الإرسال
      document.getElementById("reviewForm").reset();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please enter your name, rating, and review.",
        confirmButtonText: "OK",
      });
    }
  });

// استرجاع التعليقات والتقييمات من Firebase وعرضها في DOM
const reviewsRef = ref(db, "reviews");
onChildAdded(reviewsRef, function (snapshot) {
  const reviewData = snapshot.val();
  const stars = "★".repeat(reviewData.rating);
  const reviewElement = document.createElement("div");
  reviewElement.classList.add("review");
  reviewElement.innerHTML = `
        <p><strong>${reviewData.name}</strong></p>
        <p class="star-rating-display">${stars}</p>
        <p>${reviewData.review}</p>
    `;
  document.getElementById("reviews").appendChild(reviewElement);
});

// الدالة لتحميل المنتجات العشوائية بناءً على الفئة
async function loadRandomProducts(category) {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `Products/${category}`));
    if (snapshot.exists()) {
      const data = snapshot.val();

      // تحويل البيانات إلى مصفوفة
      const productsArray = Object.entries(data).map(([key, product]) => ({
        key,
        ...product,
      }));

      // اختيار 4 منتجات عشوائية
      const randomProducts = productsArray
        .sort(() => 0.5 - Math.random()) // مزج المصفوفة عشوائيًا
        .slice(0, 4); // أخذ أول 4 عناصر

      // حاوية المنتجات
      const productContainer = document.querySelector(".content");
      productContainer.innerHTML = ""; // تفريغ المحتوى القديم

      // عرض المنتجات العشوائية على DOM
      randomProducts.forEach((product) => {
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
                    <p class="price">${product.price}.00 JD</p>
                    <a href="details.html?category=${category}&id=${product.key}" class="more-details">View More</a>
           `;
        productContainer.appendChild(productCard);
      });
    } else {
      console.log("No data available in category:", category);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
// استدعاء الدالة لتحميل المنتجات العشوائية بناءً على الفئة
const categoryFromURL = new URLSearchParams(window.location.search).get(
  "category"
);
if (categoryFromURL) {
  loadRandomProducts(categoryFromURL); // تحميل المنتجات العشوائية بناءً على الفئة
}
