import React, { useState } from 'react';

const initialProducts = JSON.parse(localStorage.getItem('products') || '[]');

const ProductManager = () => {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({ name: '', brand: '', price: '', category: '', image: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const addProduct = e => {
    e.preventDefault();
    const newProduct = { ...form, id: Date.now() };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    setForm({ name: '', brand: '', price: '', category: '', image: '' });
  };

  const deleteProduct = id => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Product Management</h2>
      <form className="mb-4 flex flex-col gap-2" onSubmit={addProduct}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="p-2 border rounded" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="p-2 border rounded" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded" />
        <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded">Add Product</button>
      </form>
      <ul className="divide-y">
        {products.map(p => (
          <li key={p.id} className="py-2 flex justify-between items-center">
            <div>
              <span className="font-semibold">{p.name}</span> <span className="text-gray-500">({p.brand})</span> - ₹{p.price} [{p.category}]
            </div>
            <button className="text-red-700" onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
