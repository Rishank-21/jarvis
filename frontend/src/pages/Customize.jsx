
import React from "react";
import Card from "../components/Card.jsx";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import { useContext } from "react";
import { UserContex } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const { selectedImage, setSelectedImage } = useContext(UserContex);
  const navigate = useNavigate();
  
  return (
    <div className="w-full h-[100vh] bg-gradient-to-br from-[#0A0E27] via-[#1E293B] to-[#0A0E27] flex items-center justify-center flex-col p-[20px] relative overflow-hidden">
      {/* Animated background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/5 via-transparent to-[#B026FF]/5 animate-pulse"></div>
      
      <h1 className="text-white text-[30px] mb-[30px] text-center relative z-10 font-bold">
        Select your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#B026FF]">Assistant Image</span>
      </h1>
      
      <div className="w-[90%] max-w-[60%] flex flex-wrap justify-center items-center gap-[20px] mx-auto pt-[50px] relative z-10">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
      </div>
      
      {selectedImage && (
        <button
          onClick={() => navigate("/customize2")}
          className="min-w-[200px] h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full text-[18px] mt-[30px] font-semibold cursor-pointer relative z-10 shadow-lg shadow-[#00D9FF]/30 hover:shadow-[#00D9FF]/50 hover:scale-105 transition-all duration-300 border border-[#00D9FF]/30"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Customize;

