import React from "react";
import { useContext } from "react";
import { UserContex } from "../context/UserContext";

const Card = ({ image }) => {
  const { selectedImage, setSelectedImage, setBackendImage, setFrontendImage } =
    useContext(UserContex);
  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[200px] lg:h-[250px] overflow-hidden bg-[#030326] border-2  border-[#0000ff26] rounded-2xl hover:shadow-2xl shadow-blue-950 cursor-pointer hover:scale-105 transition-all duration-300 hover:border-4 hover:border-[white] ${
        selectedImage === image
          ? "border-4 border-white whadow-2xl shador-blue-950"
          : null
      }`}
    >
      <img
        src={image}
        alt=""
        className="h-full object-cover"
        onClick={() => {
          setSelectedImage(image);
          setBackendImage(null);
          setFrontendImage(null);
        }}
      />
    </div>
  );
};

export default Card;
