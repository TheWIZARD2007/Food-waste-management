// Frontend JavaScript: form.js

// Base API URL
const API_URL = "http://localhost:5000/api";

// Utility: Fetch data from the API
async function fetchData(endpoint, method = "POST", body = null) {
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
      throw new Error(data.message || "Error submitting form");
    }
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    alert(error.message);
  }
}

// Handle Form Submission
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const form = event.target;

  // Extract form data
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Validate data (optional)
  if (!data.foodType || !data.quantity || !data.expiryDate) {
    alert("Please fill out all required fields.");
    return;
  }

  try {
    // Submit data to the API
    const response = await fetchData("/donations", "POST", data);

    if (response) {
      alert("Form submitted successfully!");
      form.reset(); // Clear the form after successful submission
    }
  } catch (error) {
    alert("Failed to submit the form.");
  }
}

// Validate Inputs
function validateInput(event) {
  const input = event.target;

  // Example: Quantity validation (should be a positive number)
  if (input.name === "quantity" && input.value <= 0) {
    input.setCustomValidity("Quantity must be greater than 0.");
  } else {
    input.setCustomValidity(""); // Clear custom error
  }

  // Show error message if invalid
  input.reportValidity();
}

// Attach Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Attach form submit handler
  const forms = document.querySelectorAll(".form");
  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit);
  });

  // Attach input validation
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", validateInput);
  });
});
