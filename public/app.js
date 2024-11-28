// public/app.js

// Ensure the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Food Waste Management System - Client Script Loaded!");
  
    // Handle Navbar Toggle for Mobile View
    const menuToggle = document.querySelector("#menu-toggle");
    const navbar = document.querySelector(".navbar");
  
    if (menuToggle && navbar) {
      menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("active");
      });
    }
  
    // Close Notification Alerts
    const notifications = document.querySelectorAll(".notification .close");
    notifications.forEach((btn) => {
      btn.addEventListener("click", () => {
        const notification = btn.closest(".notification");
        notification.remove();
      });
    });
  
    // AJAX Form Submission
    const ajaxForms = document.querySelectorAll(".ajax-form");
    ajaxForms.forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const url = form.action;
  
        try {
          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
  
          if (result.success) {
            alert("Action completed successfully!");
            form.reset();
          } else {
            alert("Error: " + (result.message || "Something went wrong."));
          }
        } catch (err) {
          console.error("Error during form submission:", err);
          alert("An unexpected error occurred.");
        }
      });
    });
  
    // Confirm Delete Action
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const confirmDelete = confirm("Are you sure you want to delete this?");
        if (!confirmDelete) {
          event.preventDefault();
        }
      });
    });
  
    // Dynamic Waste Item Filtering (Example Feature)
    const wasteSearch = document.querySelector("#waste-search");
    const wasteItems = document.querySelectorAll(".waste-item");
  
    if (wasteSearch) {
      wasteSearch.addEventListener("input", () => {
        const query = wasteSearch.value.toLowerCase();
  
        wasteItems.forEach((item) => {
          const itemName = item.querySelector(".item-name").textContent.toLowerCase();
          if (itemName.includes(query)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    }
  
    // Dynamic Dashboard Updates via WebSocket (Optional Example)
    const socket = io(); // Requires Socket.io
    socket.on("update-dashboard", (data) => {
      console.log("Dashboard update received:", data);
      // Update DOM elements dynamically here if needed
    });
  });
  