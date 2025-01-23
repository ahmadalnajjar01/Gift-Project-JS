import { database, ref, set } from "./firebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isNewUser = localStorage.getItem("isNewUser");
  const profileIcon = document.getElementById("profileIcon");
  const profileName = document.getElementById("profileName");
  const logoutButton = document.getElementById("logoutButton");

  if (userData) {
    // Show a welcome message if the user is new
    if (isNewUser === "true") {
      Swal.fire({
        title: `Welcome, ${userData.username || "User"}!`,
        text: "We're glad to have you here.",
        icon: "success",
        confirmButtonText: "Let's Get Started",
      }).then(() => {
        localStorage.setItem("isNewUser", "false");
      });
    }

    // Display username and logout button
    profileName.textContent = userData.username || "User";
    profileIcon.addEventListener("click", () => {
      window.location.href = "./profileuser.html";
    });

    logoutButton.style.display = "inline-block";


    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userData");
      localStorage.removeItem("isNewUser"); // Clear the flag on logout
      window.location.reload(); // Reload the page to update UI
      window.location.href = "./index.html";
    });

    // Populate the user profile form
    document.getElementById("header-name").innerHTML = userData.username || "User";
    document.getElementById("fullName").value = userData.username || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("phone").value = userData.phoneNumber || "";

    // Save Changes (Edit Profile)
    const saveButton = document.getElementById("save");
    saveButton.addEventListener("click", async () => {
      const newFullName = document.getElementById("editFullName").value.trim();
      const newPhone = document.getElementById("editPhone").value.trim();

      if (!newFullName || !/^\w+(\s\w+)*$/.test(newFullName)) {
        Swal.fire({
          title: "Invalid Name",
          text: "Please enter a valid full name.",
          icon: "error",
        });
        return;
      }

      if (!newPhone || !/^07\d{8}$/.test(newPhone)) {
        Swal.fire({
          title: "Invalid Phone",
          text: "Phone number must be 10 digits and start with 07.",
          icon: "error",
        });
        return;
      }

      if (!userData.uid) {
        Swal.fire({
          title: "Error",
          text: "User ID is missing. Please log in again.",
          icon: "error",
        });
        return;
      }

      // Update user data in localStorage and database
      userData.username = newFullName;
      userData.phoneNumber = newPhone;
      localStorage.setItem("userData", JSON.stringify(userData));

      const userRef = ref(database, `users/${userData.uid}`);
      try {
        await set(userRef, {
          username: newFullName,
          phoneNumber: newPhone,
          email: userData.email, // Maintain email as it is
        });
        Swal.fire({
          title: "Profile Updated",
          text: "Your changes have been saved successfully.",
          icon: "success",
        }).then(() => {
          document.getElementById("fullName").value = userData.username;
          document.getElementById("phone").value = userData.phoneNumber;
          document.getElementById("editFullName").value = "";
          document.getElementById("editPhone").value = "";
          document.getElementById("header-name").innerHTML = userData.username;
          profileName.textContent = userData.username;
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update profile. Please try again later.",
          icon: "error",
        });
        console.error("Update Error:", error);
      }
    });
  } else {
    profileName.textContent = "Sign In";
    profileIcon.addEventListener("click", () => {
      window.location.href = "./signinup.html";
    });

    logoutButton.style.display = "none";
  }
});
