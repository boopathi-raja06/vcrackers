import React, { useState } from "react";
import { addProduct } from "../firebase/firestoreService";

const AdminProductForm = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addProduct({
        name: form.name,
        category: form.category,
        price: Number(form.price)
      });
      setForm({ name: "", category: "", price: "" });
      setSuccess("Product added!");
    } catch (err) {
      setError("Failed to add product.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Add Product</h2>
      {success && <div className="text-green-600">{success}</div>}
      {error && <div className="text-red-600">{error}</div>}
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded w-full" required />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded w-full" required />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="p-2 border rounded w-full" required />
  {/* Removed image field and upload */}
      <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AdminProductForm;
