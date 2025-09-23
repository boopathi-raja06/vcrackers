import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useColors } from "../contexts/ColorProvider";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { getColorStyles } = useColors();
  const menuStyle = getColorStyles().menu;
  return (
    <nav className="sticky top-0 z-50 shadow px-4 py-2" style={menuStyle}>
      <div className="flex items-center justify-between">
        <span className="font-bold text-xl text-red-700">Veena Crackers</span>
        <button className="sm:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu" style={{ color: menuStyle.color }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden sm:flex gap-4">
          <Link to="/" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }}>Home</Link>
          <Link to="/about" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }}>About Us</Link>
          <Link to="/order" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }}>Estimate</Link>
          <Link to="/gallery" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }}>Gallery</Link>
          <Link to="/safety" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }}>Safety Tips</Link>
          <Link to="/contact" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }}>Contact Us</Link>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-2 mt-2 sm:hidden">
          <Link to="/" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }} onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }} onClick={() => setOpen(false)}>About Us</Link>
          <Link to="/order" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }} onClick={() => setOpen(false)}>Estimate</Link>
          <Link to="/gallery" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }} onClick={() => setOpen(false)}>Gallery</Link>
          <Link to="/safety" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }} onClick={() => setOpen(false)}>Safety Tips</Link>
          <Link to="/contact" className="hover:text-red-700 transition-colors" style={{ color: menuStyle.color }} onClick={() => setOpen(false)}>Contact Us</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
