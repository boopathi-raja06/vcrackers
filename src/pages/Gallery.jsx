import React, { useState } from 'react';

const images = [
  { src: 'https://via.placeholder.com/300x200?text=Cracker+1', caption: 'Cracker 1' },
  { src: 'https://via.placeholder.com/300x200?text=Cracker+2', caption: 'Cracker 2' },
  { src: 'https://via.placeholder.com/300x200?text=Cracker+3', caption: 'Cracker 3' },
  { src: 'https://via.placeholder.com/300x200?text=Cracker+4', caption: 'Cracker 4' },
];

const Gallery = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-6">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {images.map((img, idx) => (
          <div key={idx} className="flex flex-col items-center cursor-pointer" onClick={() => setSelected(img)}>
            <img src={img.src} alt={img.caption} className="rounded-lg shadow w-full mb-2" />
            <span className="font-semibold text-gray-700">{img.caption}</span>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full flex flex-col items-center">
            <img src={selected.src} alt={selected.caption} className="rounded-lg mb-4 w-full" />
            <span className="font-semibold text-gray-700 mb-2">{selected.caption}</span>
            <button className="bg-red-700 text-white px-4 py-2 rounded" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
      <p className="mt-6 text-gray-700">Explore our wide range of crackers and fireworks. More images coming soon!</p>
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

export default Gallery;
