


import User from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";


// --------------------------------------------------------
// GET CURRENT USER
// --------------------------------------------------------
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// --------------------------------------------------------
// UPDATE ASSISTANT
// --------------------------------------------------------
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    let assistantImage = imageUrl;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { assistantImage, assistantName },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);

  } catch (error) {
    console.error("Update Assistant Error:", error);
    return res.status(500).json({ message: "update assistant error" });
  }
};



// --------------------------------------------------------
// ASK TO ASSISTANT
// --------------------------------------------------------
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure history exists
    if (!Array.isArray(user.history)) {
      user.history = [];
    }

    user.history.push(command);
    await user.save();


    const result = await geminiResponse(
      command,
      user.assistantName,
      user.name
    );

    if (!result) {
      return res.status(500).json({ message: "No response from assistant" });
    }


    // Extract JSON from Gemini output safely
    const jsonMatch = result.match(/{[\s\S]*}/);


    console.log("Gemini Raw Output:", result);
    if (!jsonMatch) {
      return res.status(400).json({ message: "Sorry, I couldn't understand." });
    }

    let gemResult;

    try {
      gemResult = JSON.parse(jsonMatch[0]);

      console.log("Parsed Gemini Result:", gemResult);
    } catch (err) {
      console.error("JSON Parsing Error:", err);
      return res.status(400).json({ message: "Invalid JSON from assistant" });
    }

    const type = gemResult.type;


    // --------------------------------------------------------
    // SPECIAL HANDLERS FOR DATE / TIME / DAY / MONTH
    // --------------------------------------------------------
    if (type === "get_date") {
      return res.json({
        type,
        userinput: gemResult.userinput,
        response: `Current date is ${moment().format("YYYY-MM-DD")}`,
      });
    }

    if (type === "get_time") {
      return res.json({
        type,
        userinput: gemResult.userinput,
        response: `Current time is ${moment().format("hh:mm A")}`,
      });
    }

    if (type === "get_day") {
      return res.json({
        type,
        userinput: gemResult.userinput,
        response: `Today is ${moment().format("dddd")}`,
      });
    }

    if (type === "get_month") {
      return res.json({
        type,
        userinput: gemResult.userinput,
        response: `Current month is ${moment().format("MMMM")}`,
      });
    }


    // --------------------------------------------------------
    // DEFAULT HANDLING FOR NORMAL TYPES
    // (google_search, youtube, general, calculator, etc.)
    // --------------------------------------------------------
    const allowedTypes = [
      "general",
      "google_search",
      "youtube_search",
      "youtube_play",
      "calculator_open",
      "instagram_open",
      "facebook_open",
      "weather_show",
      "whatsapp_open",
      "gmail_open",
      "youtube_open",
      "chatgpt_open",
    ];

    if (allowedTypes.includes(type)) {
      return res.json({
        type,
        userinput: gemResult.userinput,
        response: gemResult.response,
      });
    }


    // --------------------------------------------------------
    // UNKNOWN COMMAND
    // --------------------------------------------------------
    return res
      .status(400)
      .json({ message: "Sorry, I didn't understand that command." });


  } catch (error) {
    console.error("Ask Assistant Error:", error);
    return res.status(500).json({ message: "Ask assistant error" });
  }
};


// Add this function to your userController.js
export const deleteHistory = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { history: [] },
      { new: true }
    ).select("-password");
    
    return res.status(200).json({ message: "History cleared successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Delete history error" });
  }
};