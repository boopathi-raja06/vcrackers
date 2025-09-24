import React, { useState, useEffect } from "react";
import { getContact, getProducts } from "../firebase/firestoreService";
import { CrackersAnimation } from "./CrackersAnimation";

const FloatingIcons = () => {
  const [contactData, setContactData] = useState({
    phone: "+91-9876543210",
    whatsapp: "+91-9876543210"
  });
  const [products, setProducts] = useState([]);
  const [showPriceList, setShowPriceList] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [triggerExplosion, setTriggerExplosion] = useState(false);

  useEffect(() => {
    const unsubscribeContact = getContact((data) => {
      setContactData(data);
    });

    const unsubscribeProducts = getProducts((data) => {
      setProducts(data);
    });

    return () => {
      unsubscribeContact();
      unsubscribeProducts();
    };
  }, []);

  // Format phone number for WhatsApp (remove spaces and dashes)
  const formatWhatsAppNumber = (number) => {
    return number.replace(/[\s-]/g, '');
  };

  const handlePriceListClick = () => {
    setIsExploding(true);
    setTriggerExplosion(true);
    setTimeout(() => {
      setShowPriceList(true);
      setIsExploding(false);
    }, 600);
  };

  const handleClosePriceList = () => {
    setShowPriceList(false);
  };

  const handleExplosionComplete = () => {
    setTriggerExplosion(false);
  };

  const downloadPriceList = () => {
    // Create CSV content
    let csvContent = "Product Name,Category,Unit Price (RS),Wholesale Price (WS),Stock\n";
    
    products.forEach(product => {
      const rsPrice = product.rsPrice || product.price || 0;
      const wsPrice = product.wsPrice || product.wsAmount || 0;
      const stock = product.stock || 'N/A';
      const category = product.category || 'General';
      
      csvContent += `"${product.name}","${category}","₹${rsPrice}","₹${wsPrice}","${stock}"\n`;
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Veena_Crackers_Price_List_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Crackers Explosion Animation */}
      <CrackersAnimation trigger={triggerExplosion} onComplete={handleExplosionComplete} />

      {/* Left side - WhatsApp and Phone */}
      <div className="fixed left-4 bottom-16 flex flex-col gap-4 z-50">
        <a href={`https://wa.me/${formatWhatsAppNumber(contactData.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-3 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.647.832 5.19 2.406 7.354L4 29l6.854-2.406A12.94 12.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.58-5.563-1.678l-.397-.25-4.063 1.43 1.43-4.063-.25-.397C6.58 18.91 6 16.98 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.063-7.063c-.277-.139-1.637-.807-1.89-.899-.253-.093-.437-.139-.62.139-.184.277-.713.899-.874 1.086-.161.184-.322.208-.599.069-.277-.139-1.17-.431-2.23-1.373-.824-.734-1.381-1.64-1.543-1.917-.161-.277-.017-.427.122-.566.125-.124.277-.322.416-.483.139-.161.184-.277.277-.461.093-.184.047-.346-.023-.484-.069-.139-.62-1.497-.849-2.051-.224-.539-.453-.466-.62-.475l-.527-.009c-.161 0-.422.06-.644.277-.222.217-.847.828-.847 2.017s.867 2.342.987 2.506c.121.161 1.707 2.613 4.144 3.563.58.199 1.031.318 1.383.406.581.148 1.11.127 1.527.077.466-.056 1.637-.669 1.87-1.316.232-.647.232-1.201.162-1.316-.07-.115-.253-.184-.53-.323z" />
          </svg>
        </a>
        
        <a href={`tel:${formatWhatsAppNumber(contactData.phone)}`} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg p-3 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-8.284 6.716-15 15-15h2.25a2.25 2.25 0 012.25 2.25v.894m0 0A15.999 15.999 0 018.25 21.75H6a2.25 2.25 0 01-2.25-2.25V3a2.25 2.25 0 012.25-2.25h2.25m0 0h-.894a2.25 2.25 0 00-2.25 2.25v15a2.25 2.25 0 002.25 2.25H15a2.25 2.25 0 002.25-2.25V3a2.25 2.25 0 00-2.25-2.25h-2.25m0 0V.75a.75.75 0 01.75-.75h.894a.75.75 0 01.75.75V0" />
          </svg>
        </a>
      </div>

      {/* Right side - Large Explosion Price List Button */}
      <div className="fixed right-4 bottom-16 z-50">
        <button
          onClick={handlePriceListClick}
          className={`relative bg-gradient-to-r from-red-500 via-yellow-500 to-orange-600 hover:from-red-600 hover:via-yellow-600 hover:to-orange-700 text-white rounded-full shadow-xl p-5 flex items-center justify-center transform transition-all duration-300 hover:scale-110 w-16 h-16 ${
            isExploding ? 'animate-pulse scale-150' : ''
          }`}
          title="Price List - Click for Explosive View!"
        >
          {/* Explosion particles animation */}
          {isExploding && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping"
                  style={{
                    top: Math.random() * 120 + '%',
                    left: Math.random() * 120 + '%',
                    animationDelay: Math.random() * 0.5 + 's',
                    animationDuration: 0.6 + Math.random() * 0.4 + 's'
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Price list icon - larger */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          
          {/* Pulse ring effect */}
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping opacity-30"></div>
        </button>
      </div>

      {/* Price List Modal with Explosion Background */}
      {showPriceList && (
        <div className="fixed inset-0 z-50 overflow-auto">
          {/* Animated explosion background */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping opacity-30"
                  style={{
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 2 + 's',
                    animationDuration: 1 + Math.random() * 2 + 's'
                  }}
                >
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Content */}
          <div className="relative min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform animate-bounce-in">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-orange-600 text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="mr-3">💥</span>
                    VEENA CRACKERS - PRICE LIST
                    <span className="ml-3">🎆</span>
                  </h2>
                  <button
                    onClick={handleClosePriceList}
                    className="text-white hover:text-red-200 text-2xl font-bold transform hover:scale-110 transition-all duration-200"
                  >
                    ×
                  </button>
                </div>
                <p className="mt-2 opacity-90">Complete product catalog with current prices</p>
              </div>

              {/* Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-gray-600">Total Products: {products.length}</span>
                  <button
                    onClick={downloadPriceList}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transform hover:scale-105 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>Download CSV</span>
                  </button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gradient-to-r from-red-50 to-orange-50">
                          <th className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 text-left font-semibold text-xs lg:text-sm">Product Name</th>
                          <th className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 text-left font-semibold text-xs lg:text-sm">Category</th>
                          <th className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 text-right font-semibold text-xs lg:text-sm">Retail Price</th>
                          <th className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 text-right font-semibold text-xs lg:text-sm">Wholesale Price</th>
                          <th className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 text-center font-semibold text-xs lg:text-sm">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr key={product.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 font-medium text-xs lg:text-sm">{product.name}</td>
                            <td className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 text-gray-600 text-xs lg:text-sm">{product.category || 'General'}</td>
                            <td className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 text-right font-semibold text-green-600 text-xs lg:text-sm">
                              ₹{product.rsPrice || product.price || 0}
                            </td>
                            <td className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 text-right font-semibold text-blue-600 text-xs lg:text-sm">
                              ₹{product.wsPrice || product.wsAmount || 0}
                            </td>
                            <td className="border border-gray-300 px-2 lg:px-4 py-2 lg:py-3 text-center">
                              <span className={`px-1 lg:px-2 py-1 rounded-full text-xs ${
                                (product.stock > 10) ? 'bg-green-100 text-green-800' : 
                                (product.stock > 0) ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.stock || 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {products.map((product, index) => (
                    <div key={product.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-sm text-gray-900">{product.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            (product.stock > 10) ? 'bg-green-100 text-green-800' : 
                            (product.stock > 0) ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Category:</span> {product.category || 'General'}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Retail Price</div>
                            <div className="font-semibold text-green-600">₹{product.rsPrice || product.price || 0}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Wholesale Price</div>
                            <div className="font-semibold text-blue-600">₹{product.wsPrice || product.wsAmount || 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  📱 Contact us for bulk orders: {contactData.phone} | 💬 WhatsApp: {contactData.whatsapp}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </>
  );
};

export default FloatingIcons;
