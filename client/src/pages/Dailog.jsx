import { useState, useEffect } from "react";
import React from "react";
import "./styles/dailog.css"; // Import the dialog styles
import axios from "axios";

const Dailog = ({ product, closeModel, userData }) => {
  const [enoughCoins, setEnoughCoins] = useState(false);
  const [email, setEmail] = useState("");
  const [userOtp, setEnteredOtp] = useState("");
  const [Otp, setOtp] = useState("");
  const [emailMatched, setEmailMatched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const baseUrl = import.meta.env.VITE_USER_SERVER_BASE_URL;

  useEffect(() => {
    setEnoughCoins(userData.codeCoins >= product.itemPrice);
  }, [userData, product]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOtpChange = (event) => {
    setEnteredOtp(event.target.value);
  };

  const handleConfirmOrder = async () => {
    if (email) {
      if (email !== userData.email) {
        setEmailError("Entered email doesn't match with the database.");
      } else {
        setEmailMatched(true);
        setEmailError(""); // Clear previous errors

        try {
          const res = await axios.post(`${baseUrl}/redeemOtp`, {
            email: email,
          });
          if (res.status === 200) {
            setOtp(res.data.data);
            console.log("OTP sent:", res.data.data);
          } else {
            console.log(res.message);
          }
        } catch (error) {
          console.error("Error sending OTP:", error.response.data);
        }
      }
    } else {
      setEmailError("Please enter the email address");
    }
  };

  const handleOtpSubmission = async () => {
    const validOtp = Otp === userOtp;

    if (!validOtp) {
      console.error("Invalid OTP");
      return; // Exit if OTP is invalid
    }

    try {
      const coinsToDeduct = product.itemPrice; // Amount to deduct based on product price
      const response = await axios.put(`${baseUrl}/deductCoins`, {
        email,
        coinsToDeduct,
      });
      console.log(response.data);
      // Handle the response (e.g., display success message)
    } catch (error) {
      console.error("Error deducting coins:", error.response.data);
      // Handle the error (e.g., display an error message)
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2 className="dialog-title">Redeem Product</h2>
        <img src={product.itemImage} alt={product.itemName} />
        <p>
          <strong>Product Name:</strong> {product.itemName}
        </p>
        <p>
          <strong>Price:</strong> ${product.itemPrice}
        </p>
        {emailMatched ? (
          <p>To place your order, enter your OTP sent to your email</p>
        ) : (
          <p>{Otp && `OTP sent to ${email}`}</p>
        )}

        {enoughCoins ? (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              style={{ margin: "10px 0", padding: "8px", width: "100%" }}
            />

            {emailMatched && (
              <input
                type="text" // Keep as text for OTP
                placeholder="Enter your OTP"
                value={userOtp}
                onChange={handleOtpChange}
                style={{ margin: "10px 0", padding: "8px", width: "100%" }}
              />
            )}
            <button
              onClick={emailMatched ? handleOtpSubmission : handleConfirmOrder}
              className="close-button"
            >
              {emailMatched ? "Submit OTP" : "Send OTP"}
            </button>
            <button onClick={closeModel} className="close-button">
              Close
            </button>
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          </div>
        ) : (
          <>
            <p style={{ color: "red", fontWeight: "bold" }}>
              YOU DON'T HAVE ENOUGH CODE COINS
            </p>
            <button onClick={closeModel} className="close-button">
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dailog;
