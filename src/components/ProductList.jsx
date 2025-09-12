import React, { useEffect, useState } from "react";
import { getProducts } from "../firebase/firestoreService";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = getProducts(setProducts);
    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded">
          <div className="font-semibold">{product.name}</div>
          <div>{product.category}</div>
          <div>₹{product.price}</div>
          {product.image && <img src={product.image} alt={product.name} className="h-24 w-24 object-cover mt-2" />}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
