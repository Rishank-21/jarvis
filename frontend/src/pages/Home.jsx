
import React from "react";
import { useContext } from "react";
import { UserContex } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import  aiImg  from "../assets/ai.gif"
import userImg from "../assets/newUser.gif"
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";

const Home = () => {
  const { user, setUser, getGeminiResponse } = useContext(UserContex);
  const [listening , setListening ] = useState(false)
  const [userText , setUserText ] = useState("")
  const [aiText , setAiText ] = useState('')
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const synth = window.speechSynthesis;
   const isRecognizingRef = useRef(false)
   const [ham , setHem] = useState(false)
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
        { withCredentials: true }
      );
      navigate("/signin");
      setUser(null);
    } catch (error) {
      console.error("logout error");
    }
  };

  const startRecognition = () => {
    try {
      recognitionRef.current?.start()
      setListening(true)
    } catch (error) {
      if(!error.message.includes("start")){
        console.error("Recognition error")
      }
    }
  }

  const speak = (text) => {
    if(!text) return
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = 'en-US';

    const voices = synth.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if(hindiVoice){
     
      utterance.voice = hindiVoice
    }
      utterance.onstart = () => {  
          isSpeakingRef.current = true 
      }
  
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      startRecognition()
    }
  
    window.speechSynthesis.cancel()
     window.speechSynthesis.speak(utterance)
  };

  const handleCommand = (data) => {
    const {type , userinput , response } = data
  
    speak(response)

      
    if(type === 'google_search') {
      const query = encodeURIComponent(userinput);
      window.open(`https://www.google.com/search?q=${query}` , `_blank`);
    }
    if(type === 'calculator_open'){
      window.open(`https://www.google.com/search?q=calculator`,'_blank')
    }
    if(type === 'instagram_open'){
      window.open(`https://www.instagram.com/` , '_blank')
    }
    if(type === 'facebook_open'){
      window.open(`https://www.facebook.com/`,'_blank')
    }
    if(type === 'weather_show'){
     window.open(`https://www.google.com/search?q=weather` , '_blank')
    }
    if(type === 'youtube_search' || type === 'youtube_play'){
      const query = encodeURIComponent(userinput)
      window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank')
    }
    if(type === 'youtube_open'){
      window.open(`https://www.youtube.com/`, '_blank')
    }
    if(type === 'whatsapp_open'){
      window.open(`https://web.whatsapp.com/` , '_blank')
    }
    if(type === 'gmail_open'){
      window.open(`https://mail.google.com/mail/u/0/#inbox` , '_blank')
    }
    if(type === 'chatgpt_open'){
      window.open('https://chatgpt.com/chat' , '_blank')
    }
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
      

    const recognition = new SpeechRecognition();
    
    recognition.continuous = true; 
    recognition.lang = "en-US";
    recognitionRef.current = recognition  
   
   

    const safeRecognition = () => {
      if(!isSpeakingRef.current && !isRecognizingRef.current ){
        try {
           recognition.start();
           
        } catch (error) {
         if(error.name !== "InvalidStateError") {
             console.error('Start Error:' , error)
         }
        }
      }
    }

    recognition.onstart = () => {
      
      isRecognizingRef.current = true
      setListening(true)
    }

    recognition.onend = () => {
      
      isRecognizingRef.current = false
      setListening(false)

      if(!isSpeakingRef.current){
        setTimeout(() => {
          safeRecognition()
         } , 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition Error:" ,event.error);
      isRecognizingRef.current = false
      setListening(false)
      if(event.error !== "aborted" && !isSpeakingRef.current){
        setTimeout(() => {
          safeRecognition()
        }, 1000);
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
     
      transcript.toLowerCase();

      if (transcript.toLowerCase().includes(user.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript);
        
        handleCommand(data);
        setAiText(data.response)
        setUserText("")
      }
    };

    const fallback = setInterval(() => {
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        safeRecognition()
      }
    }, 1000);

    return () =>{ 
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
      clearInterval(fallback)
    }
   
  }, []);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-br from-[#0A0E27] via-[#1E293B] to-[#0A0E27] flex items-center justify-center flex-col gap-[15px] relative overflow-hidden">
      {/* Animated background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/5 via-transparent to-[#B026FF]/5 animate-pulse"></div>
      
      <GiHamburgerMenu onClick={() => setHem(true)} className="lg:hidden text-[#00D9FF] absolute top-[20px] right-[20px] w-[25px] h-[25px] z-50 cursor-pointer hover:text-[#B026FF] transition-colors"/>
      
      {ham && 
       <div className="absolute top-0 w-full h-full bg-[#0A0E27]/95 backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start z-40">
        <RxCross1 onClick={() => setHem(false)} className="text-[#00D9FF] absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer hover:text-[#B026FF] transition-colors"/>
        <button
          className="min-w-[200px] h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full text-[18px] font-semibold cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00D9FF]/30 border border-[#00D9FF]/30"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="min-w-[200px] h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full px-[20px] py-[10px] text-[18px] font-semibold cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00D9FF]/30 border border-[#00D9FF]/30"
          onClick={() => {
            navigate("/customize");
          }}
        >
          Customize your Assistant
        </button>
        <div className="w-full h-[2px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF]"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col">
          {user.history?.map((his , idx) => (
            <span key={idx} className="text-[#94A3B8] text-[18px] truncate hover:text-[#00D9FF] transition-colors">{his}</span>
          ))};
        </div>
      </div>}
      
      <button
        className="min-w-[200px] h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full hidden lg:block top-[20px] right-[20px] text-[18px] font-semibold cursor-pointer absolute hover:scale-105 transition-all duration-300 z-10 shadow-lg shadow-[#00D9FF]/30 border border-[#00D9FF]/30"
        onClick={handleLogout}
      >
        Logout
      </button>
      <button
        className="min-w-[200px] h-[60px] bg-gradient-to-r from-[#00D9FF] to-[#B026FF] text-white rounded-full hidden lg:block top-[100px] right-[20px] px-[20px] py-[10px] text-[18px] font-semibold cursor-pointer absolute hover:scale-105 transition-all duration-300 z-10 shadow-lg shadow-[#00D9FF]/30 border border-[#00D9FF]/30"
        onClick={() => {
          navigate("/customize");
        }}
      >
        Customize your Assistant
      </button>
      
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl border-2 border-[#00D9FF]/30 relative z-10">
        <img
          src={user?.assistantImage}
          alt=""
          className="object-cover h-full"
        />
        {listening && (
          <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#00FF88] rounded-full animate-pulse shadow-lg shadow-[#00FF88]/50"></div>
        )}
      </div>
      
      <h1 className="text-white text-[18px] font-semibold relative z-10">
        I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#B026FF]">{user?.assistantName}</span>
      </h1>
      
      {!aiText && <img src={userImg} alt="" className="w-[200px] relative z-10"/>}
      {aiText && <img src={aiImg} className="w-[150px] h-[100px] relative z-10"/>}
      
      <h1 className="text-[#94A3B8] text-[18px] font-semibold text-center px-4 relative z-10">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};

export default Home;