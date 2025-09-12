import React, { useEffect, useState } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../firebase/firestoreService";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", category: "" });

  useEffect(() => {
    const unsubscribe = getProducts(setProducts);
    return () => unsubscribe();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    await addProduct({ ...form, price: Number(form.price) });
    setForm({ name: "", price: "", category: "" });
  };

  const handleEdit = prod => {
    setEditId(prod.id);
    setEditForm({ name: prod.name, price: prod.price, category: prod.category });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    await updateProduct(editId, { ...editForm, price: Number(editForm.price) });
    setEditId(null);
    setEditForm({ name: "", price: "", category: "" });
  };

  const handleDelete = async id => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="p-2 border rounded" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" required />
        <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded">Add</button>
      </form>
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id} className="text-center">
              <td className="border p-2">{prod.name}</td>
              <td className="border p-2">₹{prod.price}</td>
              <td className="border p-2">{prod.category}</td>
              <td className="border p-2">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(prod)}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(prod.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Name" className="p-2 border rounded w-full mb-2" required />
            <input name="price" value={editForm.price} onChange={handleEditChange} placeholder="Price" type="number" className="p-2 border rounded w-full mb-2" required />
            <input name="category" value={editForm.category} onChange={handleEditChange} placeholder="Category" className="p-2 border rounded w-full mb-4" required />
            <div className="flex gap-2">
              <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded">Update</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
