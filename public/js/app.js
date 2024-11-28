// Frontend JavaScript: app.js

// Base API URL (adjust based on your environment)
const API_URL = "http://localhost:5000/api";

// Utility: Fetch data from the API
async function fetchData(endpoint, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error fetching data");
    }
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    alert(error.message);
  }
}

// Example: Fetch and display recent donations
async function loadRecentDonations() {
  const donationsContainer = document.querySelector("#donations-list");

  try {
    const data = await fetchData("/donations/recent");
    if (data && data.donations) {
      donationsContainer.innerHTML = data.donations
        .map(
          (donation) => `
        <li>
          <strong>${donation.foodType}</strong>: ${donation.quantity} kg 
          (Expires: ${donation.expiryDate})
        </li>
      `
        )
        .join("");
    } else {
      donationsContainer.innerHTML = "<li>No recent donations found.</li>";
    }
  } catch (err) {
    donationsContainer.innerHTML = "<li>Error loading donations.</li>";
  }
}

// Example: Handle form submission for donations
async function handleDonationFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  const form = event.target;
  const foodType = form.foodType.value;
  const quantity = form.quantity.value;
  const expiryDate = form.expiryDate.value;

  try {
    const response = await fetchData("/donations", "POST", {
      foodType,
      quantity,
      expiryDate,
    });

    if (response) {
      alert("Donation added successfully!");
      form.reset();
      loadRecentDonations(); // Reload the recent donations
    }
  } catch (error) {
    alert("Failed to add donation.");
  }
}

// Attach Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load initial data
  loadRecentDonations();

  // Add event listener to donation form (if present)
  const donationForm = document.querySelector("#donation-form");
  if (donationForm) {
    donationForm.addEventListener("submit", handleDonationFormSubmit);
  }
});
