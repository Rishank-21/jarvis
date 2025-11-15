
import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContex } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/newUser.gif";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";

const Home = () => {
  const { user, setUser, getGeminiResponse } = useContext(UserContex);

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHem] = useState(false);

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);

  const navigate = useNavigate();
  const synth = window.speechSynthesis;

  // ============================================
  // LOGOUT
  // ============================================
  const handleLogout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
        { withCredentials: true }
      );
      navigate("/signin");
      setUser(null);
    } catch (error) {
      console.error("Logout Error");
    }
  };

  // ============================================
  // SPEAK
  // ============================================
  const speak = (text) => {
    if (!text) return;

    recognitionRef.current?.stop();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";

    const voices = synth.getVoices();
    const hindi = voices.find((v) => v.lang === "hi-IN");
    if (hindi) utter.voice = hindi;

    utter.onstart = () => {
      isSpeakingRef.current = true;
    };

    utter.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");
      setTimeout(() => {
        safeStartRecognition();
      }, 500);
    };

    synth.cancel();
    synth.speak(utter);
  };

  // ============================================
  // HANDLE AI COMMAND RESPONSE
  // ============================================
  const handleCommand = (data) => {
    const { type, userinput, response } = data;

    speak(response);

    const open = (link) => window.open(link, "_blank");

    switch (type) {
      case "google_search":
        open(`https://www.google.com/search?q=${encodeURIComponent(userinput)}`);
        break;

      case "calculator_open":
        open(`https://www.google.com/search?q=calculator`);
        break;

      case "instagram_open":
        open("https://www.instagram.com/");
        break;

      case "facebook_open":
        open("https://www.facebook.com/");
        break;

      case "weather_show":
        open("https://www.google.com/search?q=weather");
        break;

      case "youtube_open":
        open("https://www.youtube.com/");
        break;

      case "youtube_search":
      case "youtube_play":
        open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            userinput
          )}`
        );
        break;

      case "whatsapp_open":
        open("https://web.whatsapp.com/");
        break;

      case "gmail_open":
        open("https://mail.google.com/mail/u/0/#inbox");
        break;

      case "chatgpt_open":
        open("https://chatgpt.com/chat");
        break;

      default:
        break;
    }
  };

  // ============================================
  // SAFELY START RECOGNITION
  // ============================================
  const safeStartRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {}
    }
  };

  // ============================================
  // SPEECH RECOGNITION SETUP
  // ============================================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (!isSpeakingRef.current) {
        setTimeout(() => safeStartRecognition(), 600);
      }
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => safeStartRecognition(), 800);
      }
    };

    recognition.onresult = async (e) => {
      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      const lower = transcript.toLowerCase();

      if (lower.includes(user?.assistantName.toLowerCase())) {
        recognition.stop();

        setUserText(lower);
        setAiText("");

        const data = await getGeminiResponse(lower);

        setAiText(data?.response || "");
        handleCommand(data);
        setUserText("");
      }
    };

    safeStartRecognition();

    return () => recognition.stop();
  }, []);

  // ============================================
  // UI
  // ============================================
  return (
    <div className="w-full h-[100vh] bg-gradient-to-br from-[#0A0E27] via-[#1E293B] to-[#0A0E27] flex items-center justify-center flex-col gap-[15px] relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/5 via-transparent to-[#B026FF]/5 animate-pulse"></div>

      {/* Hamburger Icon */}
      <GiHamburgerMenu
        onClick={() => setHem(true)}
        className="lg:hidden text-[#00D9FF] absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer z-50 hover:text-[#B026FF] transition-colors"
      />

      {/* Mobile Sidebar Menu */}
      {ham && (
        <div className="fixed inset-0 w-full h-full bg-[#0A0E27]/98 backdrop-blur-lg z-[100] flex flex-col">
          {/* Cross Button - Fixed at top */}
          <div className="w-full flex justify-end p-[20px]">
            <RxCross1
              onClick={() => setHem(false)}
              className="text-[#00D9FF] w-[30px] h-[30px] cursor-pointer hover:text-[#B026FF] transition-colors hover:rotate-90 duration-300"
            />
          </div>

          {/* Menu Content */}
          <div className="flex-1 px-[20px] flex flex-col gap-[20px] overflow-y-auto">
            {/* Logout Button */}
            <button
              className="w-full h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full font-semibold text-[18px] hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#00D9FF]/30"
              onClick={() => {
                handleLogout();
                setHem(false);
              }}
            >
              Logout
            </button>

            {/* Customize Button */}
            <button
              className="w-full h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full font-semibold text-[18px] hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#00D9FF]/30"
              onClick={() => {
                navigate("/customize");
                setHem(false);
              }}
            >
              Customize Your Assistant
            </button>

            {/* Divider */}
            <div className="w-full h-[2px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] my-[10px]"></div>

            {/* History Section */}
            <div className="flex items-center justify-between">
              <h1 className="text-white font-semibold text-[20px]">History</h1>
              {user?.history && user.history.length > 0 && (
                <button
                  onClick={async () => {
                    try {
                      await axios.delete(
                        `${import.meta.env.VITE_BASE_URL}/api/user/history`,
                        { withCredentials: true }
                      );
                      setUser({ ...user, history: [] });
                    } catch (error) {
                      console.error("Delete history error:", error);
                    }
                  }}
                  className="text-[#FF4444] hover:text-[#FF6666] text-[14px] font-semibold transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="w-full flex flex-col gap-[12px] pb-[20px]">
              {user?.history && user.history.length > 0 ? (
                [...user.history].reverse().map((h, i) => (
                  <div
                    key={i}
                    className="text-[#94A3B8] text-[16px] hover:text-[#00D9FF] transition-colors p-[12px] bg-[#1E293B] rounded-lg"
                  >
                    {h}
                  </div>
                ))
              ) : (
                <p className="text-[#94A3B8] text-[16px]">No history yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Buttons */}
      <button
        className="hidden lg:block min-w-[200px] h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full absolute top-[20px] right-[20px] font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#00D9FF]/30 z-10"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        className="hidden lg:block min-w-[200px] h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full absolute top-[100px] right-[20px] font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#00D9FF]/30 z-10"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>

      {/* Assistant Image */}
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl border-2 border-[#00D9FF]/30 relative z-10">
        <img
          src={user?.assistantImage}
          alt="Assistant"
          className="object-cover h-full"
        />

        {listening && (
          <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#00FF88] rounded-full animate-pulse shadow-lg shadow-[#00FF88]/50"></div>
        )}
      </div>

      <h1 className="text-white text-[18px] font-semibold relative z-10">
        I'm{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#B026FF]">
          {user?.assistantName}
        </span>
      </h1>

      {!aiText && <img src={userImg} alt="User" className="w-[200px] relative z-10" />}
      {aiText && <img src={aiImg} alt="AI" className="w-[150px] h-[100px] relative z-10" />}

      <h1 className="text-[#94A3B8] text-[18px] text-center px-4 relative z-10">
        {userText || aiText || ""}
      </h1>
    </div>
  );
};

export default Home;