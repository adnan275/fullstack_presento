import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (user && token) {
      fetchAddresses();
    }
  }, [user, token]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/login", { replace: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      setError("All fields are required");
      return;
    }

    try {
      if (editingAddress) {
        await axios.put(
          `http://localhost:4000/api/addresses/${editingAddress.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:4000/api/addresses", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (err) {
      setError("Failed to save address");
      console.error(err);
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      email: addr.email,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setShowAddressForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <h1>My Profile</h1>
        {user ? (
          <div className="profile-info">
            <h3>Welcome, {user.name || "User"}!</h3>
            <p>{user.email}</p>
            <button
              className="btn-primary"
              onClick={handleLogout}
              style={{ marginTop: "1rem" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </section>

      <section className="profile-addresses">
        <div className="profile-section-header">
          <h2>Saved Addresses</h2>
          <button
            className="btn-secondary"
            onClick={() => {
              setShowAddressForm(!showAddressForm);
              setEditingAddress(null);
              setFormData({
                fullName: "",
                phone: "",
                email: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
              });
            }}
          >
            {showAddressForm ? "Cancel" : "+ Add New Address"}
          </button>
        </div>

        {showAddressForm && (
          <form className="address-form" onSubmit={handleSubmitAddress}>
            <h3>{editingAddress ? "Edit Address" : "Add New Address"}</h3>
            {error && <p className="error-msg">{error}</p>}
            <div className="form-grid">
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                name="address"
                placeholder="Address (House No, Street)"
                value={formData.address}
                onChange={handleInputChange}
              />
              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
              />
              <input
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
              />
              <input
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn-primary">
              {editingAddress ? "Update Address" : "Save Address"}
            </button>
          </form>
        )}

        <div className="address-list">
          {loading ? (
            <p>Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p className="no-data">No saved addresses found.</p>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} className="address-card">
                <div className="address-content">
                  <h4>{addr.fullName}</h4>
                  <p>{addr.address}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p>Phone: {addr.phone}</p>
                </div>
                <div className="address-actions">
                  <button onClick={() => handleEdit(addr)}>Edit</button>
                  <button onClick={() => handleDelete(addr.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
