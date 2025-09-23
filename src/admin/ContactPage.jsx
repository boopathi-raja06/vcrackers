import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContact, updateContact } from '../firebase/firestoreService';

export default function ContactPage() {
  const navigate = useNavigate();
  const [contactData, setContactData] = useState({
    phone: '',
    whatsapp: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = getContact((data) => {
      setContactData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!contactData.phone || !contactData.whatsapp || !contactData.email) {
      alert('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setSaving(true);
    try {
      await updateContact(contactData);
      alert('Contact information updated successfully!');
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact information. Please try again.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-lg text-gray-600">Loading contact information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Contact Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={contactData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number (e.g., +91-9876543210)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={contactData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter WhatsApp number (e.g., +91-9876543210)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address (e.g., info@veenacrackers.in)"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {contactData.updatedAt && (
              <div className="mt-4 text-sm text-gray-500 text-center">
                Last updated: {new Date(contactData.updatedAt).toLocaleString()}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-blue-600">📞</span>
                <span className="text-gray-700">Phone: {contactData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">💬</span>
                <span className="text-gray-700">WhatsApp: {contactData.whatsapp}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-600">📧</span>
                <span className="text-gray-700">Email: {contactData.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
