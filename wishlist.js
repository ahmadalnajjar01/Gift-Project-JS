import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

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

// جلب بيانات المستخدم من localStorage
const userData = JSON.parse(localStorage.getItem("userData"));
const isNewUser = localStorage.getItem("isNewUser");

// التحقق من حالة تسجيل الدخول
function isUserSignedIn() {
  return userData && userData.email; // تحقق من وجود المستخدم والبريد الإلكتروني
}

// دالة لجلب بيانات المفضلة وعرضها في DOM
async function getFavorites() {
  const favoritesRef = ref(db, "favorites");
  try {
    const snapshot = await get(favoritesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();

      // حاوية العناصر
      const favoritesContainer = document.querySelector(".favorites-container tbody");
      favoritesContainer.innerHTML = ""; // تفريغ المحتوى القديم

      // عرض كل عنصر في DOM
      Object.entries(data).forEach(([key, favorite]) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>
            <img src="${favorite.image}" alt="${favorite.name}" style="width: 60px; height: 60px; border-radius: 5px;">
            ${favorite.name}
          </td>
          <td>${favorite.price}.00JD</td>
          <td>
            <button class="delete-btn" data-id="${key}">
              <i class="fa fa-trash"></i>
            </button>
          </td>
          <td>
            <button class="add-to-cart-btn" data-id="${key}">Proceed</button>
          </td>
        `;

        // إضافة حدث حذف العنصر عند النقر على زر الحذف
        row.querySelector(".delete-btn").addEventListener("click", (e) => {
          const productId = e.target.closest(".delete-btn").getAttribute("data-id");
          removeFromFavorites(productId);
        });

        // إضافة حدث تحقق عند الضغط على زر Proceed
        row.querySelector(".add-to-cart-btn").addEventListener("click", () => {
          if (!isUserSignedIn()) {
            Swal.fire({
              icon: "error",
              title: "Access Denied",
              text: "You must be signed in to proceed to checkout. Redirecting to the signup page...",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.href = "signinup.html"; // إعادة التوجيه إلى صفحة التسجيل
            });
          } else {
            window.location.href = "checkout.html"; // الانتقال إلى صفحة الدفع
          }
        });

        favoritesContainer.appendChild(row);
      });
    } else {
      console.log("No favorite items found.");
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}

// دالة لحذف منتج من المفضلة
function removeFromFavorites(productId) {
  const productRef = ref(db, `favorites/${productId}`);
  remove(productRef)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product removed.",
        confirmButtonText: "OK",
      });
      const rowToRemove = document.querySelector(`button[data-id="${productId}"]`).closest("tr");
      rowToRemove.remove(); // حذف الصف من الجدول
    })
    .catch((error) => {
      console.error("Error removing item:", error);
    });
}

// استدعاء الدالة عند تحميل الصفحة
getFavorites();
