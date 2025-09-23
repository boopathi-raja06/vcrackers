import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOffers, addOffer, deleteOffer } from '../firebase/firestoreService';

export default function OffersPage() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    offerTitle: '',
    offerDescription: '',
    offerIcon: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = getOffers((offersData) => {
      setOffers(offersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.offerTitle.trim() || !formData.offerDescription.trim()) {
      alert('Please fill in title and description');
      return;
    }

    setSubmitting(true);
    try {
      await addOffer(formData);
      setFormData({ offerTitle: '', offerDescription: '', offerIcon: '' });
      setShowAddForm(false);
      alert('Offer added successfully!');
    } catch (error) {
      console.error('Error adding offer:', error);
      alert('Failed to add offer. Please try again.');
    }
    setSubmitting(false);
  };

  const handleRemoveOffer = async (offerId) => {
    if (!confirm('Are you sure you want to remove this offer?')) {
      return;
    }

    try {
      await deleteOffer(offerId);
      alert('Offer removed successfully!');
    } catch (error) {
      console.error('Error removing offer:', error);
      alert('Failed to remove offer. Please try again.');
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Offers Management</h1>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-lg text-gray-600">Loading offers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Offers Management</h1>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            ➕ Add New Offer
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-6">

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Offer</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Title *
              </label>
              <input
                type="text"
                name="offerTitle"
                value={formData.offerTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter offer title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Description *
              </label>
              <textarea
                name="offerDescription"
                value={formData.offerDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter offer description"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon/Image URL (optional)
              </label>
              <input
                type="text"
                name="offerIcon"
                value={formData.offerIcon}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter icon or image URL"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {submitting ? 'Adding...' : 'Add Offer'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {offers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No offers available</div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add your first offer
            </button>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {offer.offerIcon && (
                      <div className="w-12 h-12 flex-shrink-0">
                        <img
                          src={offer.offerIcon}
                          alt="Offer icon"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {offer.offerTitle}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {offer.offerDescription}
                  </p>
                  {offer.createdAt && (
                    <p className="text-sm text-gray-400 mt-2">
                      Created: {new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveOffer(offer.id)}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                  title="Remove offer"
                >
                  ❌
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
}
