import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './logo.png'; 

const FileViewer = () => {
  const hash = window.location.pathname.slice(1);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [files, setFiles] = useState([]);
  const [expiryTime, setExpiryTime] = useState(null);

  useEffect(() => {
    let timer;
    if (expiryTime) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = expiryTime - now;
        if (distance <= 0) {
          clearInterval(timer);
          toast.error("⚠ Link has expired");
          window.location.reload();
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [expiryTime]);

  const formatCountdown = () => {
    const distance = expiryTime - new Date().getTime();
    if (distance <= 0) return "00:00:00";
    const hours = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    const minutes = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((distance / 1000) % 60)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const accessFiles = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      //const res = await axios.post("https://agc-financial-services-backend.onrender.com/access", { hash, password });
      const res = await axios.post("https://agc-financial-services-frontend.onrender.com/access", { hash, password });
      if (res.status === 200) {
        setAuthenticated(true);
        setFiles(res.data.files);
        setExpiryTime(new Date().getTime() + res.data.timeLeft * 1000);
        toast.success("✅ Access granted");
      }
    } catch (err) {
      if (err.response?.status === 410) {
        setErrorMsg('⚠ The file has expired');
        toast.error("⚠ The file has expired");
      } else if (err.response?.status === 401) {
        setErrorMsg('❌ Incorrect password');
        toast.error("❌ Incorrect password");
      } else {
        setErrorMsg('❌ Something went wrong');
        toast.error("❌ Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white flex flex-col items-center justify-center px-4">
      <img src={logo} alt="AGC Logo" className="w-32 h-auto mb-4" /> {/* ✅ Logo here */}
      <h1 className="text-3xl font-bold mb-6 text-blue-800">AGC Financial Services - File Viewer</h1>
      <ToastContainer />
      {
        authenticated ? (
          <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🔐 Files</h2>
              {expiryTime && (
                <p className="text-red-500 font-mono">⏳ Expires in: {formatCountdown()}</p>
              )}
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="p-3">File Name</th>
                  <th className="p-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{file.name}</td>
                    <td className="p-3 text-right">
                      <a href={file.url} download={file.name}  className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faDownload} /> Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <form onSubmit={accessFiles} className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-center text-blue-700">Enter Access Password</h2>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <FontAwesomeIcon icon={faLock} className="absolute top-4 right-4 text-gray-400" />
            </div>
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Access Files
            </button>
          </form>
        )
      }
    </div>
  );
};

export default FileViewer;
