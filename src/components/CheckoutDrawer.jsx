import React, { useState } from "react";
import { addOrder } from "../firebase/firestoreService";
import { serverTimestamp } from "firebase/firestore";

export default function CheckoutDrawer({ open, onClose, cartItems }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
  if (!form.name || !form.phone.match(/^[0-9]{10}$/) || !form.email) return;
    setLoading(true);
    await addOrder({
      customerName: form.name,
      phone: form.phone,
      address: form.address,
      email: form.email,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price
      })),
      total,
      createdAt: serverTimestamp()
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-2">Checkout</h2>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="border p-2 rounded" />
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone (10 digits)" className="border p-2 rounded" maxLength={10} pattern="[0-9]{10}" />
          <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="border p-2 rounded" type="email" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address (optional)" className="border p-2 rounded" />
          <div>
            <h3 className="font-semibold mb-1">Items</h3>
            <ul className="mb-2">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </li>
              ))}
            </ul>
            <div className="font-bold text-right">Total: ₹{total}</div>
          </div>
          <button type="submit" disabled={loading} className="bg-red-600 text-white py-2 rounded mt-2">
            {loading ? "Placing Order..." : "Place Order"}
          </button>
          {success && <div className="text-green-600 mt-2">Order placed successfully 🎉</div>}
        </form>
      </div>
    </div>
  );
}
