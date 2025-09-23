import React, { useState, useEffect } from "react";
import { getContact } from "../firebase/firestoreService";

const FloatingIcons = () => {
  const [contactData, setContactData] = useState({
    phone: "+91-9876543210",
    whatsapp: "+91-9876543210"
  });

  useEffect(() => {
    const unsubscribe = getContact((data) => {
      setContactData(data);
    });

    return () => unsubscribe();
  }, []);

  // Format phone number for WhatsApp (remove spaces and dashes)
  const formatWhatsAppNumber = (number) => {
    return number.replace(/[\s-]/g, '');
  };

  return (
    <div className="fixed left-4 bottom-16 flex flex-col gap-4 z-50">
      <a href={`https://wa.me/${formatWhatsAppNumber(contactData.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-3 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.647.832 5.19 2.406 7.354L4 29l6.854-2.406A12.94 12.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.58-5.563-1.678l-.397-.25-4.063 1.43 1.43-4.063-.25-.397C6.58 18.91 6 16.98 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.063-7.063c-.277-.139-1.637-.807-1.89-.899-.253-.093-.437-.139-.62.139-.184.277-.713.899-.874 1.086-.161.184-.322.208-.599.069-.277-.139-1.17-.431-2.23-1.373-.824-.734-1.381-1.64-1.543-1.917-.161-.277-.017-.427.122-.566.125-.124.277-.322.416-.483.139-.161.184-.277.277-.461.093-.184.047-.346-.023-.484-.069-.139-.62-1.497-.849-2.051-.224-.539-.453-.466-.62-.475l-.527-.009c-.161 0-.422.06-.644.277-.222.217-.847.828-.847 2.017s.867 2.342.987 2.506c.121.161 1.707 2.613 4.144 3.563.58.199 1.031.318 1.383.406.581.148 1.11.127 1.527.077.466-.056 1.637-.669 1.87-1.316.232-.647.232-1.201.162-1.316-.07-.115-.253-.184-.53-.323z" />
        </svg>
      </a>
      <a href={`tel:${formatWhatsAppNumber(contactData.phone)}`} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg p-3 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75v10.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6.75z" />
        </svg>
      </a>
    </div>
  );
};

export default FloatingIcons;
