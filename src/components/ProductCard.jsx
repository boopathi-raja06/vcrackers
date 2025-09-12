import React from 'react';

const ProductCard = ({ product }) => (
  <div className="border rounded p-4 flex flex-col items-center">
    {product.image && <img src={product.image} alt={product.name} className="h-24 w-24 object-cover mb-2" />}
    <div className="font-bold text-lg">{product.name}</div>
    <div className="text-gray-500">{product.brand}</div>
    <div className="text-red-700 font-semibold">₹{product.price}</div>
    <div className="text-xs text-gray-400">{product.category}</div>
  </div>
);

export default ProductCard;
