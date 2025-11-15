// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';
// const uploadOnCloudinary = async (filePath) => {
    
//         cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET
//     });
//     try {
//         const uploadResult = await cloudinary.uploader.upload(filePath);
//         fs.unlinkSync(filePath); // Delete the file after upload
//         return uploadResult.secure_url()
//     } catch (error) {
//         fs.unlinkSync(filePath); // Ensure the file is deleted even if upload fails
//         console.error("Error uploading to Cloudinary:", error);
//         res.status(500).json({ message : "cloudinary upload failed"})
//     }
    
// }

// export default uploadOnCloudinary



import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const uploadResult = await cloudinary.uploader.upload(filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return uploadResult.secure_url;

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null; // return null, no crash
  }
};

export default uploadOnCloudinary;
