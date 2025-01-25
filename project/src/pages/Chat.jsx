import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Trash2, Bot } from 'lucide-react';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { findResponse } from '../data/responses';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const speechSynthesis = window.speechSynthesis;
  const [voiceIndex, setVoiceIndex] = useState(null);

  useEffect(() => {
    localStorage.removeItem('chatHistory');
    setMessages([]);

    // Find a female voice
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.findIndex(voice => 
        voice.name.includes('female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen') ||
        (voice.name.includes('Google') && voice.name.includes('US English')) ||
        voice.lang.startsWith('en') // Fallback to any English voice if no female voice found
      );
      setVoiceIndex(femaleVoice >= 0 ? femaleVoice : 0);
    };

    // Chrome requires a callback for loading voices
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakMessage = (text) => {
    const cleanText = text.replace(/<[^>]*>/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set voice properties
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0 && voiceIndex !== null) {
      utterance.voice = voices[voiceIndex];
    }
    
    // Adjust voice parameters for a more natural female voice
    utterance.rate = 1.0;    // Normal speed
    utterance.pitch = 1.2;   // Slightly higher pitch for female voice
    utterance.volume = 1.0;  // Full volume
    
    speechSynthesis.speak(utterance);
  };

  const handleSendMessage = (text, shouldSpeak = true) => {
    speechSynthesis.cancel();

    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const response = findResponse(text);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: Date.now(),
      };
      
      setIsTyping(false);
      setMessages((prev) => [...prev, botMessage]);

      if (shouldSpeak) {
        speakMessage(response);
      }
    }, 1000); // Increased delay for more natural feel
  };

  const handleClearChat = () => {
    speechSynthesis.cancel();
    localStorage.removeItem('chatHistory');
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot size={28} className="text-blue-100" />
            <div>
              <h1 className="text-xl font-semibold">BoltAI Assistant</h1>
              <p className="text-sm text-blue-100">Your intelligent banking assistant</p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
            title="Clear chat"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="h-[500px] overflow-y-auto p-4 bg-gradient-to-b from-blue-50/30 to-transparent">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <Bot size={48} className="text-blue-500 opacity-50" />
              <div className="text-center">
                <p className="font-medium">Welcome to BoltAI Banking Assistant!</p>
                <p className="text-sm">Ask me anything about banking, loans, investments, or financial services.</p>
                <p className="text-sm mt-2">You can type your questions or use voice input!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <ChatMessage
                  message={{
                    id: 'typing',
                    text: '',
                    sender: 'bot',
                    timestamp: Date.now(),
                  }}
                  isTyping={true}
                />
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;