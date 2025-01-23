import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const collections = ["PerfumeW", "bodyCare", "hairCare", "natural", "perfumeM"];

async function fetchBestSellers() {
  const productContainer = document.querySelector(".content"); 
  productContainer.innerHTML = ""; // Clear existing content

  try {
    for (const collection of collections) {
      const collectionRef = ref(db, `Products/${collection}`);
      const snapshot = await get(collectionRef);

      if (snapshot.exists()) {
        const products = snapshot.val();

        for (const productId in products) {
          const product = products[productId];

          if (product.price > 50) {
            const productCard = `
              <div class="productCard">
                <div class="product-image">
                  <img src="${product.image || './default-image.jpg'}" alt="${product.name}" />
                </div>
                <div class="project-info">
                  <p class="nameProduct">${product.nameProduct}</p>
                  <p class="detailsProduct">${product.detailsProduct || 'No description available'}</p>
                  <div class="project-title">
                    <p class="price">${product.price}.00JD</p>
                  </div>
                </div>
              </div>
            `;

            productContainer.innerHTML += productCard;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchBestSellers();
