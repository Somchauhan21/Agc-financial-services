import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import logo from './logo.png'; 

const Upload = () => {
  const [uploaded, setUploaded] = useState(false);
  const [password, setPassword] = useState('');
  const [link, setLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const files = document.getElementsByName('files')[0].files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('password', password);

    try {
      const response = await axios.post("https://agc-financial-services-backend.onrender.com/access", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setLink(`${window.location.origin}/${response.data.hash}`);
      setUploaded(true);
      toast.success("✅ Files uploaded successfully!");
    } catch (err) {
      toast.error("❌ Upload failed. Try again.");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    toast.success("🔗 Link copied to clipboard!");
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-blue-50 flex items-center justify-center px-4">
      <ToastContainer />
      <motion.div
        className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.img 
          src={logo} 
          alt="AGC Logo" 
          className="mx-auto mb-4 w-24" 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
        />
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">AGC Financial Services - Upload Portal</h2>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <input
            type="file"
            name="files"
            multiple
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Set a password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </form>

        {uploaded && (
          <motion.div
            className="mt-6 bg-green-100 border border-green-300 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-green-800">
              ✅ Success! Share this secure link:
              <br />
              <a href={link} className="text-blue-600 break-words hover:underline">{link}</a>
            </p>
            <button
              onClick={copyLink}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {copySuccess ? 'Copied!' : 'Copy Link'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Upload;
