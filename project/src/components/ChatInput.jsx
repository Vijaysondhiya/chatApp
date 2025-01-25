import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const handleSubmit = () => {
    if (input.trim()) {
      onSendMessage(input, isSpeechEnabled);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setInput('');
    }
    setIsListening(!isListening);
  };

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  return (
    <div className="flex gap-2 border-t border-gray-200 p-4 bg-white">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-lg transition-colors ${
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={isListening ? 'Listening...' : 'Type your banking question...'}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={toggleSpeech}
        className={`p-2 rounded-lg transition-colors ${
          isSpeechEnabled 
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title={isSpeechEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
      >
        {isSpeechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        <Send size={20} />
      </button>
    </div>
  );
};