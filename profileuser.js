// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, get, update, remove } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// // إعدادات Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyAs4qjVud0NE6lkf-0GEa6VxFaLUhQGiGM",
//   authDomain: "contacttest-b225c.firebaseapp.com",
//   projectId: "contacttest-b225c",
//   storageBucket: "contacttest-b225c.appspot.com",
//   messagingSenderId: "968546523734",
//   appId: "1:968546523734:web:01428f94a0d62c66c139f7",
//   measurementId: "G-N9265PDPQ4",
//   databaseURL: "https://contacttest-b225c-default-rtdb.firebaseio.com",
// };

// // تهيئة Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const auth = getAuth();


//   // تحقق من المستخدم الحالي عند تحميل الصفة
//   onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       // جلب بيانات المستخدم من Firebase Realtime Database
//       try {
//         const userRef = ref(database, `users/${user.uid}`);
//         const snapshot = await get(userRef);
  
//         if (snapshot.exists()) {
//           const userData = snapshot.val();
  
//           // تعبئة البيانات في الحقول
//           document.getElementById("fullName").value =
//             userData.username || "No Name Provided";
//           document.getElementById("email").value =
//             userData.email || "No Email Provided";
//           document.getElementById("phone").value =
//             userData.phone || "No Phone Provided";
  
//           // تعبئة حقول التعديل في النافذة المنبثقة
//           document.getElementById("editFullName").value = userData.username || "";
//           document.getElementById("editPhone").value = userData.phone || "";
//         } else {
//           console.log("No data found for this user.");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     } else {
//       // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجلاً الدخول
//       window.location.href = "./login.html";
//     }
//   });
  


// استيراد وظائف Firebase
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, child, get, update, remove, getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
// import { getDatabase, ref, push} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
// إعدادات Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyAs4qjVud0NE6lkf-0GEa6VxFaLUhQGiGM",
//   authDomain: "contacttest-b225c.firebaseapp.com",
//   projectId: "contacttest-b225c",
//   storageBucket: "contacttest-b225c.appspot.com",
//   messagingSenderId: "968546523734",
//   appId: "1:968546523734:web:01428f94a0d62c66c139f7",
//   measurementId: "G-N9265PDPQ4",
//   databaseURL: "https://gift-16723-default-rtdb.firebaseio.com"  // تأكد من الرابط الصحيح
// };

// // تهيئة Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// const auth = getAuth();

// // Wait for the DOM to load
// document.addEventListener("DOMContentLoaded", () => {
//   // Retrieve user data from localStorage
//   const userDataString = localStorage.getItem("userData");

//   if (userDataString) {
//     const userData = JSON.parse(userDataString);

//     // Populate form fields with user data
//     document.getElementById("fullName").value = userData.username || "";
//     document.getElementById("email").value = userData.email || "";
//     document.getElementById("phone").value = userData.phoneNumber || "";
//   } else {
//     console.warn("No user data found. Please log in first.");
//   }
// });



  // تحقق من المستخدم الحالي عند تحميل الصفة
  // onAuthStateChanged(auth, async (user) => {
  //   if (user) {
  //     // جلب بيانات المستخدم من Firebase Realtime Database
  //     try {
  //       const userRef = ref(database, `users/${user.uid}`);
  //       const snapshot = await get(userRef);
  
  //       if (snapshot.exists()) {
  //         const userData = snapshot.val();
  
  //         // تعبئة البيانات في الحقول
  //         document.getElementById("fullName").value =
  //           userData.username || "No Name Provided";
  //         document.getElementById("email").value =
  //           userData.email || "No Email Provided";
  //         document.getElementById("phone").value =
  //           userData.phone || "No Phone Provided";
  
  //         // تعبئة حقول التعديل في النافذة المنبثقة
  //         document.getElementById("editFullName").value = userData.username || "";
  //         document.getElementById("editPhone").value = userData.phone || "";
  //       } else {
  //         console.log("No data found for this user.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   }
  //   })
    // // استرجاع بيانات المستخدم وملء الحقول
// const userId = "USER_ID"; // يجب تعيين userId للمستخدم الحالي
// const dbRef = ref(db);

// get(child(dbRef, `users/${userId}`))
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       const userData = snapshot.val();
//       document.getElementById("fullName").value = userData.fullName || "";
//       document.getElementById("phone").value = userData.phone || "";
//       document.getElementById("email").textContent = userData.email || "undefined";
//     } else {
//       console.log("No data available");
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// حفظ التعديلات
// document.getElementById("save").addEventListener("click", () => {
//   const updatedData = {
//     fullName: document.getElementById("fullName").value,
//     phone: document.getElementById("phone").value,
//   };

//   update(ref(db, `users/${userId}`), updatedData)
//     .then(() => {
//       alert("تم حفظ التعديلات بنجاح!");
//     })
//     .catch((error) => {
//       console.error(error);
//       alert("حدث خطأ أثناء حفظ التعديلات.");
//     });
// });

// // حذف الحساب
// document.querySelector(".btn-danger").addEventListener("click", () => {
//   const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف حسابك؟");
//   if (confirmDelete) {
//     remove(ref(db, `users/${userId}`))
//       .then(() => {
//         alert("تم حذف الحساب بنجاح.");
//         // إعادة التوجيه أو إخفاء واجهة المستخدم
//       })
//       .catch((error) => {
//         console.error(error);
//         alert("حدث خطأ أثناء حذف الحساب.");
//       });
//   }
// });