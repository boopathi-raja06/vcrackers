import React from 'react';
import banner from '../assets/banner2.jpg';

const Contact = () => {
  return (
    <div className="bg-white mt-8 flex flex-col items-center">
      {/* Banner - Full Width */}
      <img src={banner} alt="Happy Diwali Banner" className="w-full rounded-lg shadow mb-6" />

      {/* Contact Box */}
      <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow flex flex-col items-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Contact Us</h1>

        <div className="mb-6 w-full">
          <iframe
            title="Veena Crackers Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.0000000000005!2d77.80000000000001!3d9.450000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVeena%20Crackers!5e0!3m2!1sen!2sin!4v1630000000000!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="mb-6 w-full text-left">
          <p className="mb-2"><span className="font-bold">Phone:</span> +91-9876543210</p>
          <p className="mb-2"><span className="font-bold">Email:</span> info@veenacrackers.in</p>
          <p className="mb-2"><span className="font-bold">Address:</span> 123 Main Street, Sivakasi</p>
        </div>

        <form className="flex flex-col gap-4 w-full">
          <input type="text" placeholder="Your Name" className="p-2 border rounded" />
          <input type="email" placeholder="Your Email" className="p-2 border rounded" />
          <textarea placeholder="Your Message" rows={4} className="p-2 border rounded" />
          <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800">
            Send
          </button>
        </form>
      </div>

      {/* Footer - Full Width */}
      <footer className="bg-gray-900 text-gray-100 w-full h-[30vh] flex items-center justify-center mt-8">
        <div className="mx-auto px-4 text-center">
          <h3 className="font-bold text-2xl mb-4">Veena Crackers</h3>
          <p className="mb-4 text-lg">
            123 Main Street, Sivakasi | Phone: +91-9876543210 | Email: info@veenacrackers.in
          </p>
          <p className="text-base">
            Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
