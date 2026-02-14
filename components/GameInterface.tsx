import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Image as ImageIcon, X, Upload } from 'lucide-react';
import { ChatMessage } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { Tooltip } from './Tooltip';

interface Props {
  address: string;
}

export const GameInterface: React.FC<Props> = ({ address }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: `Welcome! I'm your WalletGPT AI companion. I see you're connected with address ${address.slice(0, 6)}...${address.slice(-4)}. I can help you analyze your NFTs, explain transaction details on Base, or analyze images you upload.`, 
      timestamp: Date.now() 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Gemini Chat Session
  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are an intelligent Web3 assistant for WalletGPT, a game on the Base blockchain. 
          The user is currently connected with the wallet address: ${address}.
          
          Your capabilities:
          1. Explain blockchain concepts (Gas, NFTs, ERC20 tokens) simply.
          2. Help the user understand their portfolio and assets.
          3. Provide strategic advice for Web3 gaming.
          4. Analyze images uploaded by the user (e.g., NFTs, charts, or screenshots).
          
          Tone: Futuristic, helpful, and concise.
          Network: Base Mainnet.
          
          If the user asks about their NFTs, remind them they can view their collection in the gallery below.`,
        },
      });
    } catch (error) {
      console.error("Failed to initialize Gemini:", error);
    }
  }, [address]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, selectedImage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          e.preventDefault();
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isTyping) return;

    const userText = input;
    const currentImage = selectedImage;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      image: currentImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setIsTyping(true);

    try {
      if (!chatSessionRef.current) {
        throw new Error("AI Session not initialized");
      }

      let messageParam: any = userText;

      if (currentImage) {
        const base64Data = currentImage.split(',')[1];
        const mimeType = currentImage.split(';')[0].split(':')[1];
        
        // Construct multimodal message
        messageParam = [
           { text: userText || "Analyze this image." },
           { 
             inlineData: { 
               mimeType: mimeType, 
               data: base64Data 
             } 
           }
        ];
      }

      const result = await chatSessionRef.current.sendMessage({ message: messageParam });
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text || "I processed that, but couldn't generate a text response.",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to the neural network right now. Please try again later.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className={`flex flex-col h-[500px] bg-dark-800 rounded-2xl border transition-colors overflow-hidden shadow-2xl relative ${isDragging ? 'border-brand-500 bg-dark-800/80' : 'border-white/10'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm pointer-events-none">
          <Upload size={48} className="text-brand-400 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white">Drop Image Here</h3>
          <p className="text-gray-400">to analyze with Gemini</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-dark-900/50 p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
            <Bot size={18} className="text-brand-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Gemini Intelligence</h3>
            <p className="text-xs text-brand-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"/>
              Online • Gemini 3 Flash
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-2xl p-3 text-sm flex flex-col gap-2
              ${msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-br-none' 
                : 'bg-dark-700 text-gray-200 rounded-bl-none'}
            `}>
              {msg.image && (
                <div className="rounded-lg overflow-hidden max-w-full">
                  <img src={msg.image} alt="User upload" className="max-h-48 object-cover w-full" />
                </div>
              )}
              <div className="flex items-start gap-2">
                {msg.role === 'assistant' && <Bot size={14} className="mt-0.5 opacity-70 shrink-0" />}
                {msg.role === 'user' && <UserIcon size={14} className="mt-0.5 opacity-70 shrink-0" />}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-dark-700 rounded-2xl rounded-bl-none p-3 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-dark-900/30 border-t border-white/5">
        {selectedImage && (
          <div className="mb-2 relative inline-block group">
            <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-white/10" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Tooltip content="Remove Image" position="top">
                <button 
                  onClick={removeImage}
                  className="bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </Tooltip>
            </div>
          </div>
        )}
        
        <div className="relative flex gap-2">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          
          <Tooltip content="Upload Image" position="top">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-dark-700 text-gray-400 rounded-xl hover:bg-dark-600 hover:text-white transition-colors border border-white/10"
            >
              <ImageIcon size={20} />
            </button>
          </Tooltip>

          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={selectedImage ? "Ask something about this image..." : "Ask Gemini (paste or drop images)..."}
              disabled={isTyping}
              className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-gray-600 disabled:opacity-50"
            />
            <Tooltip content="Send Message" position="top">
              <button 
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-500 disabled:opacity-50 disabled:bg-transparent disabled:text-gray-500 transition-colors"
              >
                {isTyping ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};