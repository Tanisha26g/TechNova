"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Send,
  Mic,
  PlusCircle,
  Sun,
  Moon,
  Paperclip,
  Globe,
  Volume2,
  ChevronRight,
  Menu,
  X,
  HelpCircle,
  Shield,
  AlertTriangle,
  Home,
  Wifi,
  WifiOff
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import { set } from 'mongoose';

const CONSTANT_USER_ID = 'user123';

function App() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Welcome to FireGuard AI. I\'m here to provide education and guidance on fire safety, prevention, and emergency response. How can I assist you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([
    { id: '1', name: 'Current Chat' },
  ]);
  const [activeChat, setActiveChat] = useState('1');
  const [isMobile, setIsMobile] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const presetQuestions = [
    {
      id: 'q1',
      question: 'What should I do in case of a kitchen fire?',
      icon: <Home size={20} />
    },
    {
      id: 'q2',
      question: 'How do I create a fire evacuation plan?',
      icon: <Shield size={20} />
    },
    {
      id: 'q3',
      question: 'What are the different types of fire extinguishers?',
      icon: <AlertTriangle size={20} />
    },
    {
      id: 'q4',
      question: 'How can I prevent electrical fires?',
      icon: <HelpCircle size={20} />
    }
  ];

  console.log(chats)

  useEffect(() => {
    const fetchInitialChat = async () => {
      try {
        const response = await fetch(`/api/chat?userId=${CONSTANT_USER_ID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();

        setChats((prevChats) => [
          ...prevChats,
          ...result.map((chat, index) => ({
            id: chat.chatId+"10",
            name: `Chat ${index + prevChats.length + 1}`
          })),
        ]);

        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   ...result[0].messages.map((msg) => ({
        //     id: msg.id,
        //     role: msg.role,
        //     content: msg.text
        //   })),
        // ]);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchInitialChat();
  }, []);


  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" },
    { code: "pa", name: "Punjabi" },
    { code: "ml", name: "Malayalam" },
    { code: "kn", name: "Kannada" },
    { code: "or", name: "Odia" },
    { code: "as", name: "Assamese" },
  ];

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleOnlineMode = () => {
    setIsOnline(!isOnline);
  };

  const handleSendMessage = async (text = inputMessage) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: text
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    setShowSuggestions(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: CONSTANT_USER_ID,
          chatId: activeChat,
          question: text,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: result.text
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error in chat:", error);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = { id: newChatId, name: `New Chat ${newChatId.slice(-4)}` };
    setChats([newChat, ...chats]);
    setActiveChat(newChatId);
    setMessages([{ id: 1, role: 'ai', content: 'How can I help you with fire safety and education today?' }]);
    setShowSuggestions(true);

    // Close sidebar on mobile after creating a new chat
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    const langMap = {
      en: "en-US",
      hi: "hi-IN",
      bn: "bn-BD",
      ta: "ta-IN",
      te: "te-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      pa: "pa-IN",
      ml: "ml-IN",
      kn: "kn-IN",
      or: "or-IN",
      as: "as-IN",
    };

    recognition.lang = langMap[selectedLanguage] || "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const handlePresetQuestion = (question) => {
    handleSendMessage(question);
  };
  const messagesEndRef = useRef(null); // Reference to the end of the message container


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`flex items-center justify-between p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className={`mr-3 p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center">
            <Flame className="text-red-500 mr-2" size={24} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">FireGuard AI</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleOnlineMode}
            className={`p-2 rounded-full ${isOnline
              ? (darkMode ? 'bg-green-800 hover:bg-green-700' : 'bg-green-200 hover:bg-green-300')
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400')
              }`}
            aria-label="Toggle online mode"
          >
            {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} 
            border-r w-72 flex flex-col transition-transform duration-300 ease-in-out
            ${isMobile ? 'absolute z-10 h-[calc(100%-64px)] mt-16' : 'relative'}`}
        >
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg 
                ${darkMode ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'} 
                text-white font-medium transition-colors`}
            >
              <PlusCircle size={18} />
              <span>New Chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <h2 className={`px-4 py-2 text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recent Chats</h2>
            <div className="space-y-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors
                    ${activeChat === chat.id
                      ? (darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900')
                      : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`}
                >
                  <Flame size={18} className="text-red-500" />
                  <span className="truncate">{chat.name}</span>
                  {activeChat === chat.id && <ChevronRight size={16} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <Globe size={18} className="mr-2" />
              <select
                className={`w-full p-2 rounded-md ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-900'
                  } border`}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Connection Status Banner */}
          {!isOnline && (
            <div className={`${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'} p-2 text-center`}>
              <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'} flex items-center justify-center gap-2`}>
                <WifiOff size={16} />
                <span>You're in offline mode. Some features may be limited.</span>
              </p>
            </div>
          )}

          {/* Messages */}
          <div className={`flex-1 max-h-[80vh] overflow-y-auto p-4 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
            <div className="max-w-6xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                      ? darkMode
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                      : darkMode
                        ? 'bg-gray-900 text-white border border-gray-800'
                        : 'bg-white text-gray-900 shadow-sm'
                      }`}
                  >
                    {/* <div className="whitespace-pre-wrap">{message.content}</div> */}
                    <ReactMarkdown className="whitespace-pre-wrap">{message.content}</ReactMarkdown>
                    {message.role === 'ai' && (
                      <button
                        onClick={() => speakText(message.content)}
                        className={`mt-2 p-1 rounded ${darkMode
                          ? 'bg-gray-800 hover:bg-gray-700'
                          : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        aria-label="Speak text"
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Preset Questions */}
              {showSuggestions && messages.length < 2 && (
                <div className="mt-6 space-y-4">
                  <h3 className={`text-center text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Suggested Questions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {presetQuestions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handlePresetQuestion(q.question)}
                        className={`flex items-center gap-2 p-3 rounded-lg text-left transition-all transform hover:scale-[1.02] ${darkMode
                          ? 'bg-gray-900 border border-gray-800 hover:border-red-500/50 text-white'
                          : 'bg-white border border-gray-200 hover:border-red-500/50 text-gray-900 shadow-sm'
                          }`}
                      >
                        <span className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          {q.icon}
                        </span>
                        <span className="text-sm">{q.question}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Empty div that acts as a scroll target */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className={`p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
            <div className="max-w-6xl mx-auto">
              <div className={`flex items-center rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-1`}>
                <button
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  aria-label="Attach file"
                >
                  <Paperclip size={20} />
                </button>
                <textarea
                  className={`flex-1 resize-none outline-none px-3 py-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
                  placeholder="Ask about fire safety..."
                  rows={1}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  onClick={handleVoiceInput}
                  aria-label="Voice input"
                >
                  <Mic size={20} />
                </button>
                <button
                  className={`p-2 rounded-full ${inputMessage.trim()
                    ? (darkMode ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600')
                    : (darkMode ? 'bg-gray-700' : 'bg-gray-300')
                    } text-white`}
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;