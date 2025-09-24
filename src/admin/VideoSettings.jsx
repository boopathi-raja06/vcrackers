import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/initFirebase';

const VIDEO_DOC_PATH = 'settings/homepageVideo';
const VIDEO_STORAGE_FOLDER = 'videos/homepageVideo.mp4';

export default function VideoSettings() {
  const [videoUrl, setVideoUrl] = useState('');
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
    async function fetchVideo() {
      setLoading(true);
      setStatus('');
      try {
        const docRef = doc(db, VIDEO_DOC_PATH);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setVideoUrl(data.videoUrl || '');
          setEnabled(data.enabled || false);
          setStatus(data.enabled ? 'Video loaded.' : 'No video available.');
        } else {
          setVideoUrl('');
          setEnabled(false);
          setStatus('No video available.');
        }
      } catch (err) {
        setStatus('Error loading video.');
      }
      setLoading(false);
    }
    fetchVideo();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('Uploading...');
    try {
      // Delete old video if exists
      if (videoUrl) {
        const oldRef = ref(storage, VIDEO_STORAGE_FOLDER);
        try { await deleteObject(oldRef); } catch {}
      }
      // Upload new video
      const storageRef = ref(storage, VIDEO_STORAGE_FOLDER);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      // Update Firestore
      await setDoc(doc(db, VIDEO_DOC_PATH), {
        videoUrl: downloadURL,
        enabled: true,
        updatedAt: new Date(),
      });
      setVideoUrl(downloadURL);
      setEnabled(true);
      setStatus('Video uploaded.');
      setFile(null);
    } catch (err) {
      setStatus('Upload failed.');
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    setStatus('Removing video...');
    try {
      await setDoc(doc(db, VIDEO_DOC_PATH), {
        videoUrl: videoUrl,
        enabled: false,
        updatedAt: new Date(),
      });
      setEnabled(false);
      setStatus('Video removed.');
    } catch (err) {
      setStatus('Remove failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
            🎥 Video Settings
          </h1>
          <p className="text-gray-600">Manage your homepage video</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Video Preview Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Current Video</h3>
            {enabled && videoUrl ? (
              <div className="bg-gray-900 rounded-lg p-4">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full max-h-96 rounded-lg"
                  poster=""
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-lg">No video available</p>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload New Video</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleFileChange} 
                disabled={loading}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleUpload}
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    📤 Upload Video
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: MP4, WebM, OGV. Max size: 100MB
            </p>
          </div>

          {/* Remove Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Remove Video</h3>
            <button
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleRemove}
              disabled={loading || !enabled}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Removing...
                </>
              ) : (
                <>
                  🗑️ Remove Video
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              This will hide the video from your homepage (video file remains in storage)
            </p>
          </div>

          {/* Status Section */}
          {status && (
            <div className={`p-4 rounded-lg ${
              status.includes('Error') || status.includes('failed') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : status.includes('uploaded') || status.includes('removed') || status.includes('loaded')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {status.includes('Error') || status.includes('failed') ? '❌' : 
                   status.includes('uploaded') || status.includes('removed') || status.includes('loaded') ? '✅' : 'ℹ️'}
                </span>
                {status}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
