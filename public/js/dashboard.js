// Frontend JavaScript: dashboard.js

// Base API URL
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

// Load Dashboard Summary Data
async function loadDashboardSummary() {
  try {
    const data = await fetchData("/dashboard/summary");

    // Update Summary Cards
    document.querySelector("#total-donations").textContent = data.totalDonations || 0;
    document.querySelector("#total-waste-reduced").textContent = data.totalWasteReduced || 0;
    document.querySelector("#active-ngos").textContent = data.activeNGOs || 0;

    // Render the chart with updated data
    renderWasteChart(data.wasteData);
  } catch (err) {
    console.error("Failed to load dashboard summary:", err);
  }
}

// Render Chart for Food Waste Statistics
function renderWasteChart(wasteData) {
  const ctx = document.getElementById("wasteChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: wasteData.map((item) => item.label),
      datasets: [
        {
          label: "Waste (kg)",
          data: wasteData.map((item) => item.value),
          backgroundColor: "#4CAF50",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

// Load Recent Donations
async function loadRecentDonations() {
  const donationsContainer = document.querySelector("#recent-donations");

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

// Attach Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardSummary();
  loadRecentDonations();
});
