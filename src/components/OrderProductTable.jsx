import React, { useEffect, useState } from "react";
import { getProducts } from "../firebase/firestoreService";
import { useColors } from "../contexts/ColorProvider";

const OrderProductTable = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState({});
  
  const { getColorStyles } = useColors();
  const { tableHead, tableBody, itemGroup, total } = getColorStyles();

  useEffect(() => {
    const unsubscribe = getProducts((prods) => {
      setProducts(prods);
      // Reset qty for new products
      setQty((qty) => {
        const newQty = {};
        prods.forEach((p) => {
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
      .filter((p) => newQty[p.id] > 0)
      .map((p) => ({
        id: p.id,
        name: p.name,
        qty: newQty[p.id],
        price: p.rsRate, // Final price after discount
        originalPrice: p.price, // Original price before discount
        discountAmount: p.rsDiscountAmount || 0, // Discount amount per unit
      }));
    setCartItems(updatedCart);
  };

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  return (
    <div>
      {Object.entries(grouped).map(([category, prods]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-red-700 p-3 rounded-lg" style={itemGroup}>{category}</h2>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="flex justify-center">
              <div className="w-full overflow-x-auto">
                <table className="w-full border mb-4 min-w-[800px]">
                  <thead>
                    <tr style={tableHead}>
                      <th className="p-2 border text-xs xl:text-sm" style={{ color: tableHead.color }}>S.No</th>
                      <th className="p-2 border text-xs xl:text-sm" style={{ color: tableHead.color }}>Product Name</th>
                      <th className="p-2 border text-xs xl:text-sm" style={{ color: tableHead.color }}>Picture</th>
                      <th className="p-2 border text-xs xl:text-sm" style={{ color: tableHead.color }}>Amount/Discount</th>
                      <th className="p-2 border text-xs xl:text-sm" style={{ color: tableHead.color }}>Rate</th>
                      <th className="p-2 border text-xs xl:text-sm" style={{ color: tableHead.color }}>Qty</th>
                      <th className="p-2 border text-xs xl:text-sm" style={{ color: tableHead.color }}>Total</th>
                    </tr>
                  </thead>
                  <tbody style={tableBody}>
                    {prods.map((prod, idx) => {
                      const originalPrice = prod.price !== undefined ? prod.price : 0;
                      const discountAmount = prod.rsDiscountAmount !== undefined ? prod.rsDiscountAmount : 0;
                      const finalRate = prod.rsRate !== undefined ? prod.rsRate : 0;
                      return (
                        <tr key={prod.id} className="text-center">
                          <td className="border p-1 xl:p-2 text-xs xl:text-sm" style={{ color: tableBody.color }}>{idx + 1}</td>
                          <td className="border p-1 xl:p-2 text-xs xl:text-sm" style={{ color: tableBody.color }}>{prod.name}</td>
                          <td className="border p-1 xl:p-2">
                            <svg className="h-8 w-8 xl:h-12 xl:w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <rect x="3" y="7" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="#f3f4f6"/>
                              <rect x="8" y="3" width="8" height="4" rx="1" stroke="#9ca3af" strokeWidth="2" fill="#e5e7eb"/>
                              <circle cx="12" cy="14" r="3" stroke="#9ca3af" strokeWidth="2" fill="#e5e7eb"/>
                            </svg>
                          </td>
                          <td className="border p-1 xl:p-2">
                            <div className="flex flex-col items-center">
                              <span className="text-sm xl:text-lg font-bold text-red-700">₹{discountAmount}</span>
                              <span className="line-through text-gray-400 text-xs xl:text-sm">₹{originalPrice}</span>
                            </div>
                          </td>
                          <td className="border p-1 xl:p-2 text-xs xl:text-sm" style={{ color: tableBody.color }}>₹{finalRate}</td>
                          <td className="border p-1 xl:p-2">
                            <input type="number" min="0" value={qty[prod.id] || 0} onChange={(e) => handleQtyChange(prod.id, e.target.value)} className="w-12 xl:w-16 p-1 border rounded text-xs xl:text-sm"/>
                          </td>
                          <td className="border p-1 xl:p-2 text-xs xl:text-sm" style={{ color: tableBody.color }}>₹{(qty[prod.id] || 0) * finalRate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {prods.map((prod, idx) => {
              const originalPrice = prod.price !== undefined ? prod.price : 0;
              const discountAmount = prod.rsDiscountAmount !== undefined ? prod.rsDiscountAmount : 0;
              const finalRate = prod.rsRate !== undefined ? prod.rsRate : 0;
              return (
                <div key={prod.id} className="bg-white border rounded-lg p-4 shadow-sm" style={{ backgroundColor: tableBody.backgroundColor }}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="7" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="#f3f4f6"/>
                        <rect x="8" y="3" width="8" height="4" rx="1" stroke="#9ca3af" strokeWidth="2" fill="#e5e7eb"/>
                        <circle cx="12" cy="14" r="3" stroke="#9ca3af" strokeWidth="2" fill="#e5e7eb"/>
                      </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm" style={{ color: tableBody.color }}>{prod.name}</h3>
                        <span className="text-xs text-gray-500">#{idx + 1}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs">Discount:</span>
                          <div className="flex flex-col">
                            <span className="font-bold text-red-700">₹{discountAmount}</span>
                            <span className="line-through text-gray-400 text-xs">₹{originalPrice}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Rate:</span>
                          <div className="font-semibold" style={{ color: tableBody.color }}>₹{finalRate}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <input type="number" min="0" value={qty[prod.id] || 0} onChange={(e) => handleQtyChange(prod.id, e.target.value)} className="w-16 p-1 border rounded text-sm"/>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">Total:</span>
                          <div className="font-bold text-lg" style={{ color: tableBody.color }}>₹{(qty[prod.id] || 0) * finalRate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-right font-bold text-lg mb-4 p-3 rounded-lg" style={total}>
        Grand Total: ₹{grandTotal}
      </div>
    </div>
  );
};

export default OrderProductTable;
