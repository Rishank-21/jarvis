


import React, { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
import { useContext } from "react";
import { UserContex } from "../context/UserContext.jsx";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserContex);
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUser(response.data);
      setLoading(false);
     
      alert("Sign In successful!");
      navigate("/home");
    } catch (error) {
      console.error("Error during signin:", error);
      setError(error.response.data.message);
      setUser(null);
      alert("Sign In failed. Please try again.");
      setLoading(false);
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };
  
  return (
    <div
      className="h-[100vh] w-full bg-cover flex justify-center items-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url(https://thumbs.dreamstime.com/b/friendly-futuristic-medical-robot-analyzing-data-tablet-high-tech-environment-371552886.jpg)",
      }}
    >
      {/* Overlay with robotic gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E27]/90 via-[#1E293B]/85 to-[#0A0E27]/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/10 via-transparent to-[#B026FF]/10 animate-pulse"></div>
      
      <form
        onSubmit={handleSignIn}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#1E293B]/80 backdrop-blur-xl shadow-2xl shadow-[#00D9FF]/20 flex flex-col items-center justify-center gap-[20px] px-[20px] rounded-3xl border border-[#00D9FF]/30 relative z-10"
      >
        <h1 className="text-white text-[30px] font-bold mb-[30px]">
          Sign in to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#B026FF]">Jarvis</span>
        </h1>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[60px] border-2 border-[#00D9FF]/50 bg-[#0A0E27]/50 text-white placeholder-[#94A3B8] rounded-full text-[18px] px-[20px] py-[10px] outline-none focus:border-[#00D9FF] focus:shadow-lg focus:shadow-[#00D9FF]/30 transition-all duration-300"
        />
        
        <div className="w-full h-[60px] border-2 border-[#00D9FF]/50 bg-[#0A0E27]/50 text-white rounded-full text-[18px] relative focus-within:border-[#00D9FF] focus-within:shadow-lg focus-within:shadow-[#00D9FF]/30 transition-all duration-300">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full bg-transparent text-white placeholder-[#94A3B8] rounded-full text-[18px] px-[20px] py-[10px] outline-none"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
            {showPassword ? (
              <IoEye
                className="text-[#00D9FF] font-semibold text-[25px] hover:text-[#B026FF] transition-colors"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <IoEyeOff
                className="text-[#00D9FF] font-semibold text-[25px] hover:text-[#B026FF] transition-colors"
                onClick={() => setShowPassword(true)}
              />
            )}
          </span>
        </div>
        
        {error.length > 0 && (
          <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-full border border-red-500/30">
            {error}
          </p>
        )}
        
        <button
          className="min-w-[200px] h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full text-[18px] mt-[30px] font-semibold cursor-pointer shadow-lg shadow-[#00D9FF]/30 hover:shadow-[#00D9FF]/50 hover:scale-105 transition-all duration-300 border border-[#00D9FF]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        
        <p className="text-[#94A3B8] mt-3">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#B026FF] cursor-pointer hover:from-[#B026FF] hover:to-[#00D9FF] transition-all font-semibold"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signin;