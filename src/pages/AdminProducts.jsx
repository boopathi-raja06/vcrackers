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
      <div className="overflow-x-auto mb-6">
        <table className="w-full border min-w-[600px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Name</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Price</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Category</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id} className="text-center">
                <td className="border p-1 sm:p-2 text-xs sm:text-sm">{prod.name}</td>
                <td className="border p-1 sm:p-2 text-xs sm:text-sm">₹{prod.price}</td>
                <td className="border p-1 sm:p-2 text-xs sm:text-sm">{prod.category}</td>
                <td className="border p-1 sm:p-2">
                  <div className="flex space-x-1 sm:space-x-2 justify-center">
                    <button className="text-blue-600 text-xs sm:text-sm px-1 sm:px-2 py-1 bg-blue-50 rounded hover:bg-blue-100" onClick={() => handleEdit(prod)}>Edit</button>
                    <button className="text-red-600 text-xs sm:text-sm px-1 sm:px-2 py-1 bg-red-50 rounded hover:bg-red-100" onClick={() => handleDelete(prod.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
