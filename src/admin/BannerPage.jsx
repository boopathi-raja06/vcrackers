import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBanners, uploadBannerImage, updateBanners } from '../firebase/firestoreService';

export default function BannerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banners, setBanners] = useState({
    aboutUs: '',
    contactUs: '',
    orderPage: '',
    giftbox: '',
    gallery: '',
    homePage: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  // Banner configuration
  const bannerConfig = [
    { key: 'homePage', label: 'Home Page Banner', description: 'Main banner displayed on the home page' },
    { key: 'aboutUs', label: 'About Us Page Banner', description: 'Banner for the About Us page' },
    { key: 'contactUs', label: 'Contact Us Page Banner', description: 'Banner for the Contact page' },
    { key: 'orderPage', label: 'Order Page Banner', description: 'Banner for the Order page' },
    { key: 'giftbox', label: 'Giftbox Page Banner', description: 'Banner for the Giftbox page' },
    { key: 'gallery', label: 'Gallery Page Banner', description: 'Banner for the Gallery page' },
  ];

  useEffect(() => {
    const unsubscribe = getBanners((data) => {
      setBanners(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFileSelect = (bannerKey, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedFiles(prev => ({
      ...prev,
      [bannerKey]: file
    }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews(prev => ({
        ...prev,
        [bannerKey]: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (bannerKey) => {
    setSelectedFiles(prev => {
      const updated = { ...prev };
      delete updated[bannerKey];
      return updated;
    });
    
    setPreviews(prev => {
      const updated = { ...prev };
      delete updated[bannerKey];
      return updated;
    });

    setUploadStatus(prev => {
      const updated = { ...prev };
      delete updated[bannerKey];
      return updated;
    });
  };

  const handleSaveSettings = async () => {
    const filesToUpload = Object.keys(selectedFiles);
    if (filesToUpload.length === 0) {
      alert('Please select at least one banner to upload');
      return;
    }

    setSaving(true);
    const newBannerUrls = { ...banners };
    
    try {
      // Upload each selected file
      for (const bannerKey of filesToUpload) {
        const file = selectedFiles[bannerKey];
        
        setUploadStatus(prev => ({
          ...prev,
          [bannerKey]: 'uploading'
        }));

        try {
          const downloadURL = await uploadBannerImage(file, bannerKey);
          newBannerUrls[bannerKey] = downloadURL;
          
          setUploadStatus(prev => ({
            ...prev,
            [bannerKey]: 'success'
          }));
        } catch (error) {
          console.error(`Error uploading ${bannerKey}:`, error);
          setUploadStatus(prev => ({
            ...prev,
            [bannerKey]: 'error'
          }));
          throw error;
        }
      }

      // Save all banner URLs to Firestore
      await updateBanners(newBannerUrls);
      
      // Clear selections after successful save
      setSelectedFiles({});
      setPreviews({});
      setUploadStatus({});
      
      alert('Banners updated successfully!');
      
    } catch (error) {
      console.error('Error saving banners:', error);
      alert('Error saving banners. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (bannerKey) => {
    const status = uploadStatus[bannerKey];
    switch (status) {
      case 'uploading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '';
    }
  };

  const getStatusText = (bannerKey) => {
    const status = uploadStatus[bannerKey];
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'success': return 'Uploaded';
      case 'error': return 'Failed';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-2"
            >
              <span>←</span> Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Banner Settings</h1>
          </div>
          
          {Object.keys(selectedFiles).length > 0 && (
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {saving ? '⏳ Saving...' : '💾 Save Settings'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">📖 Instructions</h2>
            <div className="text-blue-800 space-y-2">
              <p>• Upload banner images for each page of your website</p>
              <p>• Images will be stored in Firebase Storage and updated in real-time</p>
              <p>• Recommended size: 1200x400px, Max file size: 5MB</p>
              <p>• Supported formats: JPG, PNG, WebP</p>
            </div>
          </div>

          {/* Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bannerConfig.map((config) => (
              <div key={config.key} className="bg-white rounded-lg shadow-md overflow-hidden">
                
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{config.label}</h3>
                  <p className="text-sm text-gray-600">{config.description}</p>
                  {getStatusText(config.key) && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span>{getStatusIcon(config.key)}</span>
                      <span className={`font-medium ${
                        uploadStatus[config.key] === 'success' ? 'text-green-600' : 
                        uploadStatus[config.key] === 'error' ? 'text-red-600' : 
                        'text-blue-600'
                      }`}>
                        {getStatusText(config.key)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Current Banner Preview */}
                <div className="aspect-[3/1] bg-gray-100 flex items-center justify-center">
                  {previews[config.key] ? (
                    <img
                      src={previews[config.key]}
                      alt={`New ${config.label}`}
                      className="w-full h-full object-cover"
                    />
                  ) : banners[config.key] ? (
                    <img
                      src={banners[config.key]}
                      alt={config.label}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100"><rect width="300" height="100" fill="%23f3f4f6"/><text x="150" y="50" text-anchor="middle" fill="%23666" font-size="12">No Image</text></svg>';
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="text-2xl mb-2">📷</div>
                      <p className="text-sm">No banner uploaded</p>
                    </div>
                  )}
                </div>

                {/* File Upload Controls */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(config.key, e)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={saving}
                      />
                    </label>
                  </div>

                  {selectedFiles[config.key] && (
                    <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm">📁</span>
                        <span className="text-sm text-green-800 truncate">
                          {selectedFiles[config.key].name}
                        </span>
                        <span className="text-xs text-green-600">
                          ({(selectedFiles[config.key].size / (1024 * 1024)).toFixed(1)}MB)
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(config.key)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        disabled={saving}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button (Mobile) */}
          {Object.keys(selectedFiles).length > 0 && (
            <div className="mt-8 md:hidden">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {saving ? '⏳ Saving...' : '💾 Save All Settings'}
              </button>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔧 Technical Details</h3>
            <div className="text-gray-700 space-y-2 text-sm">
              <p><strong>Storage:</strong> Firebase Storage with automatic URL generation</p>
              <p><strong>Database:</strong> Firestore `banners` collection for real-time updates</p>
              <p><strong>Auto-refresh:</strong> Client pages update automatically when banners change</p>
              <p><strong>File replacement:</strong> New uploads automatically replace old banner files</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
