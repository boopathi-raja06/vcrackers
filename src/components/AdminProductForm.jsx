import React, { useState } from "react";
import { addProduct } from "../firebase/firestoreService";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "../firebase/firebaseConfig";
import { initializeApp } from "firebase/app";

const storage = getStorage(initializeApp(firebaseConfig));

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

  const [file, setFile] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    let imageUrl = form.image;
    try {
      if (file) {
        const storageRef = ref(storage, `product-images/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addProduct({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        image: imageUrl
      });
      setForm({ name: "", category: "", price: "", image: "" });
      setFile(null);
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
  <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL (or upload below)" className="p-2 border rounded w-full" />
  <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 border rounded w-full" />
      <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AdminProductForm;
