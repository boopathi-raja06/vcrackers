import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../firebase/firestoreService';
// TODO: Add Firebase Storage upload for images

const initialForm = {
  code: '',
  category: '',
  name: '',
  unit: '',
  rsPrice: '',
  rsDiscountPercent: '',
  rsDiscountAmount: '',
  rsRate: '',
  wsPrice: '',
  wsDiscountPercent: '',
  wsDiscountAmount: '',
  wsAmount: '',
  caseQty: '',
  stock: '',
  image: '',
};

export default function ProductManagement() {
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const unsubscribe = getProducts(setProducts);
    return () => unsubscribe();
  }, []);

  // Auto-increment code
  useEffect(() => {
    if (!editId) {
      const maxCode = products.reduce((max, p) => Math.max(max, Number(p.code || 0)), 0);
      setForm(f => ({ ...f, code: maxCode + 1 }));
    }
  }, [products, editId]);

  // Calculate discount amount and final rate whenever price/discount fields change
  const handleChange = e => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };
    // RS Discount Amount and Rate
    let rsPrice = Number(updated.rsPrice) || 0;
    let rsDiscountPercent = Number(updated.rsDiscountPercent) || 0;
    let rsDiscountAmount = rsPrice * rsDiscountPercent / 100;
    let rsRate = rsPrice - rsDiscountAmount;
    rsRate = Math.max(rsRate, 0);
    updated.rsDiscountAmount = rsDiscountAmount;
    updated.rsRate = rsRate;
    // WS Discount Amount and Rate
    let wsPrice = Number(updated.wsPrice) || 0;
    let wsDiscountPercent = Number(updated.wsDiscountPercent) || 0;
    let wsDiscountAmount = wsPrice * wsDiscountPercent / 100;
    let wsAmount = wsPrice - wsDiscountAmount;
    wsAmount = Math.max(wsAmount, 0);
    updated.wsDiscountAmount = wsDiscountAmount;
    updated.wsAmount = wsAmount;
    setForm(updated);
  };
  const handleReset = () => { setForm(initialForm); setEditId(null); };

  const handleSubmit = async e => {
    e.preventDefault();
    // Calculate discount amount and final rate before saving
    const product = { ...form };
    let rsPrice = Number(product.rsPrice) || 0;
    let rsDiscountPercent = Number(product.rsDiscountPercent) || 0;
    let rsDiscountAmount = rsPrice * rsDiscountPercent / 100;
    let rsRate = rsPrice - rsDiscountAmount;
    rsRate = Math.max(rsRate, 0);
    product.rsDiscountAmount = rsDiscountAmount;
    product.rsRate = rsRate;
    let wsPrice = Number(product.wsPrice) || 0;
    let wsDiscountPercent = Number(product.wsDiscountPercent) || 0;
    let wsDiscountAmount = wsPrice * wsDiscountPercent / 100;
    let wsAmount = wsPrice - wsDiscountAmount;
    wsAmount = Math.max(wsAmount, 0);
    product.wsDiscountAmount = wsDiscountAmount;
    product.wsAmount = wsAmount;
    // Map RS Price to Firestore 'price', Estimate Price to 'rsrate'
    product.price = product.rsPrice;
    product.rsrate = product.rsRate;
    if (editId) {
      await updateProduct(editId, product);
    } else {
      await addProduct(product);
    }
    handleReset();
  };

  const handleEdit = prod => {
    setEditId(prod.id);
    // Map Firestore fields to form fields
    setForm({
      ...initialForm,
      ...prod,
      rsPrice: prod.price || '',
      rsRate: prod.rsrate || '',
    });
  };
  const handleDelete = async id => { if (window.confirm('Delete this product?')) await deleteProduct(id); };

  // Pagination & search
  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      {/* Blue gradient header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 mb-6 text-white text-2xl font-bold text-center">Products</div>
      {/* Add/Update Form */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" onSubmit={handleSubmit}>
        <input name="code" value={form.code} readOnly className="border p-2 rounded bg-gray-100" placeholder="Product Code" />
        <input name="category" value={form.category} onChange={handleChange} className="border p-2 rounded" placeholder="Category" />
        <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded" placeholder="Product Name" />
        <input name="unit" value={form.unit} onChange={handleChange} className="border p-2 rounded" placeholder="Unit" />
        <input name="rsPrice" value={form.rsPrice} onChange={handleChange} className="border p-2 rounded" placeholder="RS Price" type="number" />
        <input name="rsDiscountPercent" value={form.rsDiscountPercent} onChange={handleChange} className="border p-2 rounded" placeholder="RS Discount %" type="number" />
        <input name="rsDiscountAmount" value={form.rsDiscountAmount} readOnly className="border p-2 rounded bg-gray-100" placeholder="RS Discount Amount" type="number" />
        <input name="rsRate" value={form.rsRate} readOnly className="border p-2 rounded bg-gray-100" placeholder="RS Rate" type="number" />
        <input name="wsPrice" value={form.wsPrice} onChange={handleChange} className="border p-2 rounded" placeholder="WS Price" type="number" />
        <input name="wsDiscountPercent" value={form.wsDiscountPercent} onChange={handleChange} className="border p-2 rounded" placeholder="WS Discount %" type="number" />
        <input name="wsDiscountAmount" value={form.wsDiscountAmount} readOnly className="border p-2 rounded bg-gray-100" placeholder="WS Discount Amount" type="number" />
        <input name="wsAmount" value={form.wsAmount} readOnly className="border p-2 rounded bg-gray-100" placeholder="WS Amount" type="number" />
        <input name="caseQty" value={form.caseQty} onChange={handleChange} className="border p-2 rounded" placeholder="Case Qty" type="number" />
        <input name="stock" value={form.stock} onChange={handleChange} className="border p-2 rounded" placeholder="Stock" type="number" />
        {/* TODO: Image upload */}
        <input name="image" value={form.image} onChange={handleChange} className="border p-2 rounded" placeholder="Image URL (auto after upload)" />
        <div className="col-span-2 flex gap-4 items-center mt-2">
          <label className="flex items-center gap-2"><input type="checkbox" /> Change Discount Rate for All Products</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Change Stock for All Products</label>
        </div>
        <div className="col-span-2 flex gap-4 mt-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">{editId ? 'Update Product' : 'Add Product'}</button>
          <button type="button" className="bg-gray-300 px-6 py-2 rounded" onClick={handleReset}>Reset</button>
        </div>
      </form>
      {/* Product List Table */}
      <div className="mb-4 flex justify-between items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="border p-2 rounded w-64" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Code</th>
              <th className="p-2">Category</th>
              <th className="p-2">Name</th>
              <th className="p-2">RS Price</th>
              <th className="p-2">% RS Discount</th>
              <th className="p-2">RS Discount Amount</th>
              <th className="p-2">RS Rate</th>
              <th className="p-2">WS Price</th>
              <th className="p-2">% WS Discount</th>
              <th className="p-2">WS Discount Amount</th>
              <th className="p-2">WS Amount</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Case Qty</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(prod => (
              <tr key={prod.id} className="border-t">
                <td className="p-2">{prod.code}</td>
                <td className="p-2">{prod.category}</td>
                <td className="p-2">{prod.name}</td>
                <td className="p-2">{prod.price !== undefined ? prod.price : 0}</td>
                <td className="p-2">{prod.rsDiscountPercent}</td>
                <td className="p-2">{prod.rsDiscountAmount}</td>
                <td className="p-2">{prod.rsRate}</td>
                <td className="p-2">{prod.wsPrice}</td>
                <td className="p-2">{prod.wsDiscountPercent}</td>
                <td className="p-2">{prod.wsDiscountAmount}</td>
                <td className="p-2">{prod.wsAmount}</td>
                <td className="p-2">{prod.unit}</td>
                <td className="p-2">{prod.caseQty}</td>
                <td className="p-2">{prod.stock}</td>
                <td className="p-2">{prod.image && <img src={prod.image} alt={prod.name} className="h-12 w-12 object-cover rounded" />}</td>
                <td className="p-2 flex gap-2">
                  <button className="text-blue-600" onClick={() => handleEdit(prod)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" /></svg></button>
                  <button className="text-red-600" onClick={() => handleDelete(prod.id)} title="Delete"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-200">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-200">Next</button>
      </div>
    </div>
  );
}
