import React, { useEffect, useState } from "react";
import { getProducts } from "../firebase/firestoreService";

const OrderProductTable = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState({});

  useEffect(() => {
    const unsubscribe = getProducts((prods) => {
      setProducts(prods);
      // Reset qty for new products
      setQty(qty => {
        const newQty = {};
        prods.forEach(p => {
          newQty[p.id] = qty[p.id] || 0;
        });
        return newQty;
      });
    });
    return () => unsubscribe();
  }, []);

  // Group products by category
  const grouped = products.reduce((acc, p) => {
    const cat = p.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const handleQtyChange = (id, value) => {
    const newQty = { ...qty, [id]: Number(value) };
    setQty(newQty);
    // Update cartItems based on qty
    const updatedCart = products
      .filter(p => newQty[p.id] > 0)
      .map(p => ({ id: p.id, name: p.name, qty: newQty[p.id], price: p.rsRate }));
    setCartItems(updatedCart);
  };

  const grandTotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div>
      {Object.entries(grouped).map(([category, prods]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-red-700">{category}</h2>
          <table className="w-full border mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">S.No</th>
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Picture</th>
                <th className="p-2 border">Amount/Discount</th>
                <th className="p-2 border">Rate</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {prods.map((prod, idx) => {
                const originalPrice = prod.price !== undefined ? prod.price : 0;
                const discountAmount = prod.rsDiscountAmount !== undefined ? prod.rsDiscountAmount : 0;
                const finalRate = prod.rsRate !== undefined ? prod.rsRate : 0;
                return (
                  <tr key={prod.id} className="text-center">
                    <td className="border p-2">{idx + 1}</td>
                    <td className="border p-2">{prod.name}</td>
                    <td className="border p-2">{prod.image ? <img src={prod.image} alt={prod.name} className="h-12 w-12 object-cover rounded mx-auto" /> : '-'}</td>
                    <td className="border p-2">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-red-700">₹{discountAmount}</span>
                        <span className="line-through text-gray-400 text-sm">₹{originalPrice}</span>
                      </div>
                    </td>
                    <td className="border p-2">₹{finalRate}</td>
                    <td className="border p-2">
                      <input type="number" min="0" value={qty[prod.id] || 0} onChange={e => handleQtyChange(prod.id, e.target.value)} className="w-16 p-1 border rounded" />
                    </td>
                    <td className="border p-2">₹{(qty[prod.id] || 0) * finalRate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      <div className="text-right font-bold text-lg mb-4">Grand Total: ₹{grandTotal}</div>
    </div>
  );
};

export default OrderProductTable;
