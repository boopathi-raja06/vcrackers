import React, { useState } from 'react';

const products = [
  { id: 1, name: 'Rocket', brand: 'Vadivel', packing: '10 pcs', price: 120 },
  { id: 2, name: 'Garland', brand: 'Supreme', packing: '5 pcs', price: 200 },
  { id: 3, name: 'Flower Pot', brand: 'Starvell', packing: '6 pcs', price: 150 },
];

const Order = () => {
  const [qty, setQty] = useState(products.map(() => 0));

  const handleQtyChange = (idx, value) => {
    const newQty = [...qty];
    newQty[idx] = Number(value);
    setQty(newQty);
  };

  const total = qty.reduce((sum, q, idx) => sum + q * products[idx].price, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Estimate / Order</h1>
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">S.No</th>
            <th className="p-2 border">Product Name</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border">Packing</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, idx) => (
            <tr key={prod.id} className="text-center">
              <td className="border p-2">{idx + 1}</td>
              <td className="border p-2">{prod.name}</td>
              <td className="border p-2">{prod.brand}</td>
              <td className="border p-2">{prod.packing}</td>
              <td className="border p-2">₹{prod.price}</td>
              <td className="border p-2">
                <input type="number" min="0" value={qty[idx]} onChange={e => handleQtyChange(idx, e.target.value)} className="w-16 p-1 border rounded" />
              </td>
              <td className="border p-2">₹{qty[idx] * prod.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right font-bold text-lg mb-4">Grand Total: ₹{total}</div>
      <button className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800">Enquire / Submit</button>
      <p className="mt-6 text-gray-700">For bulk orders and special requests, please contact us directly.</p>
      <footer className="bg-gray-900 text-gray-100 w-full py-6 mt-8 rounded-lg">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="font-bold text-lg mb-2">Veena Crackers</h3>
          <p className="mb-2">123 Main Street, Sivakasi | Phone: +91-9876543210 | Email: info@veenacrackers.in</p>
          <p className="text-xs">Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Order;
