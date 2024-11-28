const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other email services (e.g., SendGrid, Mailgun) here
  auth: {
    user: process.env.EMAIL_USER, // Email address (e.g., your Gmail address)
    pass: process.env.EMAIL_PASSWORD, // Email password or application-specific password
  },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to, // Receiver's email address
    subject, // Email subject
    text, // Plain text body
    html, // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = { sendEmail };
