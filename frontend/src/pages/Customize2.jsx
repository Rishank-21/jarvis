
import React from "react";
import { useContext } from "react";
import { UserContex } from "../context/UserContext.jsx";
import { useState } from "react";
import axios from "../config/axios.js";
import { MdOutlineArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { user, backendImage, setBackendImage, selectedImage, setUser } =
    useContext(UserContex);
  const [assistantName, setAssistantName] = useState(user?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleUpdateAssistant = async () => {
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      alert("Assistant Created Successfully!");
      setUser(result.data);
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setAssistantName("");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-br from-[#0A0E27] via-[#1E293B] to-[#0A0E27] flex items-center justify-center flex-col p-[20px] relative overflow-hidden">
      {/* Animated background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/5 via-transparent to-[#B026FF]/5 animate-pulse"></div>
      
      <MdOutlineArrowBack 
        onClick={() => {
          navigate("/customize");
        }} 
        className="absolute top-[30px] left-[30px] text-[#00D9FF] w-[25px] h-[25px] text-4xl cursor-pointer hover:text-[#B026FF] transition-colors duration-300 z-10"
      />
      
      <h1 className="text-white text-[30px] mb-[30px] text-center relative z-10 font-bold">
        Enter Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#B026FF]">Assistant Name</span>
      </h1>
      
      <input
        type="text"
        placeholder="eg. jarvis"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
        className="w-full h-[60px] max-w-[600px] border-2 border-[#00D9FF]/50 bg-[#1E293B]/50 text-white placeholder-[#94A3B8] rounded-full text-[18px] px-[20px] py-[10px] outline-none focus:border-[#00D9FF] focus:shadow-lg focus:shadow-[#00D9FF]/30 transition-all duration-300 backdrop-blur-sm relative z-10"
      />
      
      {assistantName && (
        <button
          onClick={() => {
            handleUpdateAssistant();
          }}
          className="min-w-[300px] h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full text-[18px] mt-[30px] font-semibold cursor-pointer relative z-10 shadow-lg shadow-[#00D9FF]/30 hover:shadow-[#00D9FF]/50 hover:scale-105 transition-all duration-300 border border-[#00D9FF]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={loading}
        >
          {!loading ? "Finally Create Your Assistant" : "Loading..."}
        </button>
      )}
    </div>
  );
};

export default Customize2;