import React, { useState, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 30); // Adjust speed of typing
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return formatMessageWithLinks(displayedText);
};

const formatMessageWithLinks = (text) => {
  if (text.includes('<Link')) {
    const parts = text.split(/(<Link.*?<\/Link>)/);
    return parts.map((part, index) => {
      if (part.startsWith('<Link')) {
        const to = part.match(/to='([^']*)'|to="([^"]*)"/)[1] || part.match(/to='([^']*)'|to="([^"]*)"/)[2];
        const content = part.replace(/<Link[^>]*>|<\/Link>/g, '');
        return (
          <Link
            key={index}
            to={to}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {content}
          </Link>
        );
      }
      return part;
    });
  }

  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\/?[a-zA-Z0-9-]+\/[a-zA-Z0-9-\/]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (!part) return null;
    
    if (urlRegex.test(part)) {
      let url = part;
      if (url.startsWith('www.')) {
        url = 'https://' + url;
      }
      
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {part}
        </a>
      );
    }
    
    return part.split('\n').map((line, lineIndex) => (
      <React.Fragment key={`${index}-${lineIndex}`}>
        {lineIndex > 0 && <br />}
        {line}
      </React.Fragment>
    ));
  });
};

export const ChatMessage = ({ message, isTyping }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`flex max-w-[80%] ${
          isBot ? 'flex-row' : 'flex-row-reverse'
        } items-start gap-2`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isBot ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
          } ${isTyping ? 'animate-pulse' : ''}`}
        >
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>
        <div
          className={`rounded-lg px-4 py-2 ${
            isBot
              ? 'bg-white border border-gray-200 text-gray-800'
              : 'bg-blue-600 text-white'
          }`}
        >
          {isBot && isTyping ? (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap">
              {isBot ? (
                <TypewriterText text={message.text} />
              ) : (
                formatMessageWithLinks(message.text)
              )}
            </div>
          )}
          <span className="text-xs opacity-75 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};