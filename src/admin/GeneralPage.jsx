import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getColorSettings, updateColorSettings } from '../firebase/firestoreService';

export default function GeneralPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [colorSettings, setColorSettings] = useState({
    menuBgColor: '#ffffff',
    menuTextColor: '#374151',
    newsBgColor: '#f3f4f6',
    newsTextColor: '#111827',
    tableHeadBgColor: '#f9fafb',
    tableHeadTextColor: '#374151',
    tableBodyBgColor: '#ffffff',
    tableBodyTextColor: '#6b7280',
    itemGroupBgColor: '#f8fafc',
    itemGroupTextColor: '#475569',
    totalBgColor: '#3b82f6',
    totalTextColor: '#ffffff'
  });

  // Color configuration for UI organization
  const colorConfig = [
    {
      section: 'Menu Settings',
      description: 'Colors for navigation menu and header',
      colors: [
        { key: 'menuBgColor', label: 'Menu Background Color', description: 'Background color for navigation menu' },
        { key: 'menuTextColor', label: 'Menu Text Color', description: 'Text color for menu items' }
      ]
    },
    {
      section: 'News & Announcements',
      description: 'Colors for news sections and announcements',
      colors: [
        { key: 'newsBgColor', label: 'News Background Color', description: 'Background color for news/announcement sections' },
        { key: 'newsTextColor', label: 'News Text Color', description: 'Text color for news content' }
      ]
    },
    {
      section: 'Table Styling',
      description: 'Colors for data tables throughout the website',
      colors: [
        { key: 'tableHeadBgColor', label: 'Table Header Background', description: 'Background color for table headers' },
        { key: 'tableHeadTextColor', label: 'Table Header Text', description: 'Text color for table headers' },
        { key: 'tableBodyBgColor', label: 'Table Body Background', description: 'Background color for table rows' },
        { key: 'tableBodyTextColor', label: 'Table Body Text', description: 'Text color for table content' }
      ]
    },
    {
      section: 'Item Groups & Categories',
      description: 'Colors for product categories and item groupings',
      colors: [
        { key: 'itemGroupBgColor', label: 'Item Group Background', description: 'Background color for product categories' },
        { key: 'itemGroupTextColor', label: 'Item Group Text', description: 'Text color for category labels' }
      ]
    },
    {
      section: 'Total & Summary',
      description: 'Colors for total amounts and summary sections',
      colors: [
        { key: 'totalBgColor', label: 'Total Background Color', description: 'Background color for total/summary sections' },
        { key: 'totalTextColor', label: 'Total Text Color', description: 'Text color for total amounts' }
      ]
    }
  ];

  useEffect(() => {
    const unsubscribe = getColorSettings((data) => {
      if (data) {
        setColorSettings(prev => ({
          ...prev,
          ...data
        }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleColorChange = (colorKey, newColor) => {
    setColorSettings(prev => ({
      ...prev,
      [colorKey]: newColor
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    if (!hasChanges) return;

    setSaving(true);
    try {
      await updateColorSettings(colorSettings);
      setHasChanges(false);
      alert('Color settings saved successfully! Changes will be reflected across the website.');
    } catch (error) {
      console.error('Error saving color settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all colors to default values? This cannot be undone.')) {
      const defaultColors = {
        menuBgColor: '#ffffff',
        menuTextColor: '#374151',
        newsBgColor: '#f3f4f6',
        newsTextColor: '#111827',
        tableHeadBgColor: '#f9fafb',
        tableHeadTextColor: '#374151',
        tableBodyBgColor: '#ffffff',
        tableBodyTextColor: '#6b7280',
        itemGroupBgColor: '#f8fafc',
        itemGroupTextColor: '#475569',
        totalBgColor: '#3b82f6',
        totalTextColor: '#ffffff'
      };
      setColorSettings(defaultColors);
      setHasChanges(true);
    }
  };

  const isLightColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading color settings...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleResetToDefaults}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset to Defaults
            </button>
            {hasChanges && (
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
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">🎨 Color Settings</h2>
            <div className="text-blue-800 space-y-2">
              <p>• Customize the color scheme for your entire website</p>
              <p>• Changes are applied in real-time across all pages</p>
              <p>• Colors are automatically saved to Firebase for persistence</p>
              <p>• Use the color picker or enter hex values directly</p>
            </div>
          </div>

          {/* Color Sections */}
          <div className="space-y-8">
            {colorConfig.map((section) => (
              <div key={section.section} className="bg-white rounded-lg shadow-sm border">
                
                {/* Section Header */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{section.section}</h3>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>

                {/* Color Controls */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.colors.map((colorItem) => (
                      <div key={colorItem.key} className="space-y-3">
                        
                        {/* Color Label */}
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            {colorItem.label}
                          </label>
                          <p className="text-xs text-gray-600">{colorItem.description}</p>
                        </div>

                        {/* Color Input & Preview */}
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="color"
                              value={colorSettings[colorItem.key]}
                              onChange={(e) => handleColorChange(colorItem.key, e.target.value)}
                              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <input
                              type="text"
                              value={colorSettings[colorItem.key]}
                              onChange={(e) => handleColorChange(colorItem.key, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="#000000"
                            />
                          </div>

                          {/* Color Preview */}
                          <div 
                            className="w-24 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-xs font-medium shadow-inner"
                            style={{ 
                              backgroundColor: colorSettings[colorItem.key],
                              color: isLightColor(colorSettings[colorItem.key]) ? '#000000' : '#ffffff'
                            }}
                          >
                            Preview
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow-sm border mt-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">🔍 Live Preview</h3>
              <p className="text-sm text-gray-600 mt-1">See how your colors look in context</p>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Menu Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Menu Preview</h4>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: colorSettings.menuBgColor }}
                >
                  <div className="flex gap-6">
                    <span style={{ color: colorSettings.menuTextColor }}>Home</span>
                    <span style={{ color: colorSettings.menuTextColor }}>Products</span>
                    <span style={{ color: colorSettings.menuTextColor }}>About</span>
                    <span style={{ color: colorSettings.menuTextColor }}>Contact</span>
                  </div>
                </div>
              </div>

              {/* News Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">News Section Preview</h4>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: colorSettings.newsBgColor, color: colorSettings.newsTextColor }}
                >
                  📢 Latest News: Special offers available this week!
                </div>
              </div>

              {/* Table Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Table Preview</h4>
                <table className="w-full border rounded-lg overflow-hidden">
                  <thead style={{ backgroundColor: colorSettings.tableHeadBgColor }}>
                    <tr>
                      <th className="p-3 text-left" style={{ color: colorSettings.tableHeadTextColor }}>Product</th>
                      <th className="p-3 text-left" style={{ color: colorSettings.tableHeadTextColor }}>Price</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: colorSettings.tableBodyBgColor }}>
                    <tr>
                      <td className="p-3" style={{ color: colorSettings.tableBodyTextColor }}>Sample Product</td>
                      <td className="p-3" style={{ color: colorSettings.tableBodyTextColor }}>₹100</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Item Group Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Item Group Preview</h4>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: colorSettings.itemGroupBgColor, color: colorSettings.itemGroupTextColor }}
                >
                  🎆 Sparklers Category
                </div>
              </div>

              {/* Total Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Total/Summary Preview</h4>
                <div 
                  className="p-4 rounded-lg font-medium"
                  style={{ backgroundColor: colorSettings.totalBgColor, color: colorSettings.totalTextColor }}
                >
                  Total: ₹1,500
                </div>
              </div>

            </div>
          </div>

          {/* Save Button (Mobile) */}
          {hasChanges && (
            <div className="mt-8 md:hidden">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {saving ? '⏳ Saving...' : '💾 Save All Color Settings'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
