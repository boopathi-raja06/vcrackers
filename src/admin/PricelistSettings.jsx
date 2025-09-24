import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/initFirebase';

const PRICELIST_DOC_PATH = 'settings/pricelist';
const PRICELIST_STORAGE_FOLDER = 'pricelists/';

export default function PricelistSettings() {
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Check admin authentication
  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      window.location.href = '/admin';
      return;
    }
  }, []);

  useEffect(() => {
    async function fetchPricelist() {
      setLoading(true);
      setStatus('');
      try {
        const docRef = doc(db, PRICELIST_DOC_PATH);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFileUrl(data.fileUrl || '');
          setFileName(data.fileName || '');
          setEnabled(data.enabled || false);
          setStatus(data.enabled ? 'Pricelist loaded.' : 'No pricelist available.');
        } else {
          setFileUrl('');
          setFileName('');
          setEnabled(false);
          setStatus('No pricelist uploaded yet.');
        }
      } catch (err) {
        setStatus('Error loading pricelist.');
        console.error('Error fetching pricelist:', err);
      }
      setLoading(false);
    }
    fetchPricelist();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      const fileType = selectedFile.type;
      const validTypes = [
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!validTypes.includes(fileType)) {
        setStatus('Please select a PDF or Excel file only.');
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
      setStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('Uploading...');
    
    try {
      // Delete old file if exists
      if (fileUrl && fileName) {
        const oldRef = ref(storage, `${PRICELIST_STORAGE_FOLDER}${fileName}`);
        try { 
          await deleteObject(oldRef); 
        } catch (deleteErr) {
          console.log('Old file not found or already deleted');
        }
      }
      
      // Upload new file
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const newFileName = `pricelist_${timestamp}.${fileExtension}`;
      const storageRef = ref(storage, `${PRICELIST_STORAGE_FOLDER}${newFileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update Firestore
      await setDoc(doc(db, PRICELIST_DOC_PATH), {
        fileUrl: downloadURL,
        fileName: newFileName,
        enabled: true,
        updatedAt: new Date(),
      });
      
      setFileUrl(downloadURL);
      setFileName(newFileName);
      setEnabled(true);
      setStatus('Pricelist uploaded successfully!');
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setStatus('Upload failed. Please try again.');
      console.error('Upload error:', err);
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    setStatus('Removing pricelist...');
    try {
      await setDoc(doc(db, PRICELIST_DOC_PATH), {
        fileUrl: fileUrl,
        fileName: fileName,
        enabled: false,
        updatedAt: new Date(),
      });
      setEnabled(false);
      setStatus('Pricelist removed. Users will see product details instead.');
    } catch (err) {
      setStatus('Remove failed. Please try again.');
      console.error('Remove error:', err);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-2">
              Pricelist Settings
            </h1>
            <p className="text-gray-600">Manage your downloadable pricelist file</p>
          </div>

          {/* Current Pricelist Status */}
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Pricelist</h3>
            {enabled && fileUrl && fileName ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {fileName.toLowerCase().includes('.pdf') ? '📄' : '📊'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{fileName}</p>
                      <p className="text-sm text-gray-500">Active pricelist file</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📄</div>
                <p>No pricelist uploaded yet</p>
              </div>
            )}
          </div>

          {/* Upload New Pricelist */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload New Pricelist</h3>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept=".pdf,.xls,.xlsx"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-yellow-500 file:to-orange-500 file:text-white hover:file:from-yellow-600 hover:file:to-orange-600 file:cursor-pointer cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Accepted formats: PDF, Excel (.xls, .xlsx)
                </p>
              </div>
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                onClick={handleUpload}
                disabled={loading || !file}
              >
                {loading ? 'Uploading...' : 'Upload Pricelist'}
              </button>
            </div>
          </div>

          {/* Remove Pricelist */}
          <div className="mb-6">
            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={handleRemove}
              disabled={loading || !enabled}
            >
              Remove Pricelist
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This will hide the pricelist from users. They'll see product details instead.
            </p>
          </div>

          {/* Status Message */}
          {status && (
            <div className={`p-4 rounded-lg text-center font-medium ${
              status.includes('successfully') || status.includes('loaded') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : status.includes('failed') || status.includes('Error')
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
