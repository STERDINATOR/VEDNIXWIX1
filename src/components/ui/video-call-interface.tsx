/**
 * Video Call Interface Component
 * Simulated video call UI for mentor interactions with AI voice interaction
 * Features: Real-time emotion detection, voice interaction, AI responses
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mentors } from '@/entities';
import { Image } from '@/components/ui/image';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { EmotionDetector, DetectedEmotion } from '@/components/ui/emotion-detector';

interface VideoCallInterfaceProps {
  mentor: Mentors;
  onEndCall?: () => void;
  isActive?: boolean;
}

interface AIMessage {
  id: string;
  text: string;
  timestamp: Date;
  type: 'ai' | 'user';
}

export function VideoCallInterface({ mentor, onEndCall, isActive = true }: VideoCallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<DetectedEmotion>('neutral');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showEmotionDetector, setShowEmotionDetector] = useState(false);
  const [aiVolume, setAiVolume] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simulate call duration
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Start user camera
  useEffect(() => {
    if (!isActive || !isVideoOn) {
      stopUserCamera();
      return;
    }

    startUserCamera();

    return () => {
      stopUserCamera();
    };
  }, [isActive, isVideoOn]);

  const startUserCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false 
      });
      
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  const stopUserCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }
  };

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // AI Response Generator
  const generateAIResponse = (userQuestion: string, emotion: DetectedEmotion): string => {
    const emotionResponses = {
      happy: [
        "That's wonderful! Your positive energy is perfect for learning. Let's dive deeper into this topic!",
        "I can see you're excited! This enthusiasm will help you master this concept quickly.",
        "Great mood for learning! Let me show you something that will make you even more excited."
      ],
      sad: [
        "I notice you might be feeling down. Don't worry, we'll take this step by step together.",
        "It's okay to feel challenged. Let's break this down into smaller, manageable parts.",
        "I'm here to support you. Let's work through this at your own pace."
      ],
      confused: [
        "I can see this might be confusing. Let me explain it in a different way.",
        "No worries! Let's approach this from another angle that might make more sense.",
        "Confusion is part of learning. Let me clarify this concept for you."
      ],
      excited: [
        "Your excitement is contagious! Let's channel that energy into mastering this topic!",
        "I love your enthusiasm! This is exactly the mindset for breakthrough learning.",
        "Amazing energy! Let's use this momentum to tackle something challenging."
      ],
      neutral: [
        "Let's explore this topic together. I'll make sure it's engaging and clear.",
        "I'm here to help you understand this concept thoroughly.",
        "Let's dive into this material and make it interesting for you."
      ]
    };

    const responses = emotionResponses[emotion] || emotionResponses.neutral;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add context-aware responses based on keywords
    const lowerQuestion = userQuestion.toLowerCase();
    if (lowerQuestion.includes('help') || lowerQuestion.includes('stuck')) {
      return `${randomResponse} I can see you need assistance. Let me guide you through this step by step.`;
    } else if (lowerQuestion.includes('explain') || lowerQuestion.includes('understand')) {
      return `${randomResponse} I'll break this down clearly for you with examples.`;
    } else if (lowerQuestion.includes('practice') || lowerQuestion.includes('exercise')) {
      return `${randomResponse} I have some great practice exercises that match your current level.`;
    }

    return randomResponse;
  };

  // Handle voice input (simulated)
  const handleVoiceInput = () => {
    if (isMuted) {
      alert('Please unmute your microphone first!');
      return;
    }

    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      const simulatedQuestions = [
        "Can you help me understand this concept?",
        "I'm stuck on this problem",
        "Can you explain this in a different way?",
        "What should I practice next?",
        "How can I improve my understanding?"
      ];
      
      const question = simulatedQuestions[Math.floor(Math.random() * simulatedQuestions.length)];
      setUserInput(question);
      setIsListening(false);
      handleSendMessage(question);
    }, 2000);
  };

  // Handle sending message
  const handleSendMessage = (text?: string) => {
    const messageText = text || userInput;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      text: messageText,
      timestamp: new Date(),
      type: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    // Simulate AI thinking and speaking
    setIsSpeaking(true);
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText, currentEmotion);
      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        text: aiResponse,
        timestamp: new Date(),
        type: 'ai'
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Simulate speaking duration based on response length
      setTimeout(() => {
        setIsSpeaking(false);
      }, aiResponse.length * 50);
    }, 1500);
  };

  // Handle emotion detection
  const handleEmotionDetected = (emotion: DetectedEmotion) => {
    setCurrentEmotion(emotion);
    
    // AI acknowledges emotion change
    const emotionAcknowledgment: AIMessage = {
      id: `emotion-${Date.now()}`,
      text: `I notice you're feeling ${emotion}. I'll adjust my teaching approach accordingly.`,
      timestamp: new Date(),
      type: 'ai'
    };
    setMessages(prev => [...prev, emotionAcknowledgment]);
  };

  return (
    <div className="space-y-4">
      {/* Main Video Area */}
      <Card className="border-primary/30 bg-gray-900 p-4 overflow-hidden">
        <div className="relative w-full aspect-video rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-primary/20 overflow-hidden">
          {/* Mentor Video Placeholder */}
          <div className="w-full h-full flex items-center justify-center relative">
            {mentor.avatarImage ? (
              <Image
                src={mentor.avatarImage}
                alt={mentor.name || 'Mentor'}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">🎓</div>
                <p className="text-gray-400">{mentor.name}</p>
              </div>
            )}

            {/* User Video (Picture-in-Picture) */}
            {isVideoOn && (
              <div className="absolute bottom-4 right-4 w-32 h-24 rounded-lg overflow-hidden border-2 border-primary/50 bg-gray-900">
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Live indicator on user video */}
                <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  YOU
                </div>
              </div>
            )}

            {/* Animated border */}
            <motion.div
              className="absolute inset-0 border-2 border-primary rounded-lg"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ pointerEvents: 'none' }}
            />

            {/* AI Speaking Indicator */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 left-4 bg-primary/90 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    🎤
                  </motion.div>
                  AI Speaking...
                </motion.div>
              )}
            </AnimatePresence>

            {/* Call Status Badge */}
            <motion.div
              className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
              Live
            </motion.div>

            {/* Current Emotion Badge */}
            <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded text-xs font-semibold">
              <span className="text-gray-400">Mood: </span>
              <span className="text-primary capitalize">{currentEmotion}</span>
            </div>

            {/* Call Duration */}
            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-sm font-mono text-primary">
              {formatDuration(callDuration)}
            </div>
          </div>
        </div>
      </Card>

      {/* AI Conversation Panel */}
      <Card className="border-primary/30 bg-gray-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            AI Voice Interaction
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              Real-time AI
            </Badge>
            <button
              onClick={() => setAiVolume(!aiVolume)}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              {aiVolume ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-gray-800/50 rounded-lg p-3 h-48 overflow-y-auto mb-3 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-xs py-8">
              <p>Start a conversation with your AI mentor</p>
              <p className="mt-1">Click the microphone or type your question</p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                    msg.type === 'user'
                      ? 'bg-primary text-black'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] opacity-60 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your question..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            disabled={isListening || isSpeaking}
          />
          <Button
            onClick={handleVoiceInput}
            disabled={isListening || isSpeaking}
            className={`px-3 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isListening ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                <Mic className="w-4 h-4" />
              </motion.div>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!userInput.trim() || isListening || isSpeaking}
            className="px-3 bg-secondary hover:bg-secondary/90"
          >
            Send
          </Button>
        </div>
      </Card>

      {/* Emotion Detection Toggle */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setShowEmotionDetector(!showEmotionDetector)}
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          {showEmotionDetector ? 'Hide' : 'Show'} Emotion Detection
        </Button>
      </div>

      {/* Emotion Detector */}
      <AnimatePresence>
        {showEmotionDetector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary/30 bg-gray-900 p-4">
              <EmotionDetector
                showWebcamPlaceholder={false}
                onEmotionDetected={handleEmotionDetected}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mentor Info */}
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <div className="flex items-center gap-3">
          {mentor.avatarImage && (
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/50">
              <Image
                src={mentor.avatarImage}
                alt={mentor.name || 'Mentor'}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="font-bold text-foreground text-sm">{mentor.name}</p>
            <p className="text-xs text-primary">{mentor.specialty}</p>
          </div>
          <div className="text-xs text-gray-400">
            {mentor.personalityType}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <motion.button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-full transition-all ${
            isMuted
              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </motion.button>

        <motion.button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-full transition-all ${
            !isVideoOn
              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </motion.button>

        <motion.button
          onClick={onEndCall}
          className="p-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="End Call"
        >
          <PhoneOff className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-gray-800 rounded p-2 text-center">
          <p className="text-gray-400">Microphone</p>
          <p className="text-primary font-bold">{isMuted ? 'Off' : 'On'}</p>
        </div>
        <div className="bg-gray-800 rounded p-2 text-center">
          <p className="text-gray-400">Camera</p>
          <p className="text-primary font-bold">{isVideoOn ? 'On' : 'Off'}</p>
        </div>
        <div className="bg-gray-800 rounded p-2 text-center">
          <p className="text-gray-400">AI Status</p>
          <p className="text-green-400 font-bold">{isSpeaking ? 'Speaking' : 'Ready'}</p>
        </div>
        <div className="bg-gray-800 rounded p-2 text-center">
          <p className="text-gray-400">Connection</p>
          <p className="text-green-400 font-bold">Stable</p>
        </div>
      </div>
    </div>
  );
}
