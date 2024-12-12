import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles/redeem.css";
import Dailog from "./Dailog";
import Loading from "../Loading"; // Import the Loading component

const Redeem = () => {
  const baseUrl = import.meta.env.VITE_USER_SERVER_BASE_URL;
  const token = localStorage.getItem("authToken");
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDailog, setShowDailog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  // const [inStock, setInStock] = useState(false);

  const closeModel = () => {
    setShowDailog(false);
    setSelectedProduct(null); // Reset selected product when closing the dialog
  };

  const handleRedeemClick = (product) => {
    setSelectedProduct(product); // Set the selected product
    setShowDailog(true); // Show the dialog box
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${baseUrl}/auth`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          setUserData(response.data.user);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }

    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`${baseUrl}/getItems`);

        if (response.data.sucess && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // End loading after products are fetched
      }
    };

    fetchProducts();
  }, [token, baseUrl]);

  const filteredAndSortedProducts = (Array.isArray(products) ? products : [])
    .filter((product) => {
      const productName = product?.itemName ?? "";
      return productName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.itemName ?? "").localeCompare(b.itemName ?? "");
      }
      if (sortBy === "priceLow") return (a.itemPrice ?? 0) - (b.itemPrice ?? 0);
      if (sortBy === "priceHigh")
        return (b.itemPrice ?? 0) - (a.itemPrice ?? 0);
      return 0;
    });

  if (!token) {
    return (
      <>
        <Navbar />
        <center>
          <h1 style={{ color: "brown" }}>
            Alert! Secured Route, Login/Signup to access
          </h1>
          <br />
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "brown",
              fontWeight: "bold",
              marginTop: "10px",
              paddingTop: "10px",
            }}
          >
            Click To Login
          </Link>
        </center>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="redeem-container">
        <h1 className="title">Our Products</h1>

        <div className="controls">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-container">
            <Loading color="brown" size={50} />
          </div>
        ) : (
          <div className="products-grid">
            {filteredAndSortedProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.itemImage}
                  alt={product.itemName}
                  className="product-image"
                />
                <div className="product-info">
                  <h2 className="product-name">{product.itemName}</h2>
                  <span className="product-price">
                    ${Number(product.itemPrice ?? 0)}
                  </span>
                  <p className="product-description">
                    {product.itemDescription}
                  </p>
                  {product.itemQuantity === 0 ? (
                    <p className="product-quantity">
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Out of stock
                      </span>
                    </p>
                  ) : (
                    <>
                      <p className="product-quantity">
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          In Stock
                        </span>
                      </p>
                      <button
                        className="btn"
                        onClick={() => handleRedeemClick(product)}
                      >
                        Redeem
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDailog && selectedProduct && (
        <Dailog
          product={selectedProduct}
          userData={userData}
          closeModel={closeModel}
        />
      )}
    </div>
  );
};

export default Redeem;
