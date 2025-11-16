import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { AnimeCharacterGenerator } from '@/components/ui/anime-character-generator';
import { geminiAI, type CharacterPersonality, type MentorResponse } from '@/lib/gemini-ai';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Settings, 
  Palette,
  User,
  MessageCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Save,
  RotateCcw,
  Brain,
  Zap,
  Smile,
  Frown,
  Meh,
  Heart,
  AlertCircle,
  TrendingUp,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MentorPersonality {
  name: string;
  personality: string;
  expertise: string[];
  voiceType: 'gentle' | 'energetic' | 'wise' | 'friendly';
  appearance: {
    hairColor: string;
    eyeColor: string;
    outfit: string;
    accessories: string[];
  };
}

interface MoodDetectionResult {
  mood: 'happy' | 'sad' | 'confused' | 'excited' | 'frustrated' | 'focused' | 'tired' | 'neutral';
  confidence: number;
  indicators: string[];
  timestamp: Date;
}

interface AnimeMentorProps {
  isOpen: boolean;
  onClose: () => void;
  userCharacter?: any; // The character created by the user
}

export function AnimeMentor({ isOpen, onClose, userCharacter }: AnimeMentorProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMentorSpeaking, setIsMentorSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showCharacterGenerator, setShowCharacterGenerator] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiServiceStatus, setAIServiceStatus] = useState<any>(null);
  
  // Mood Detection States
  const [currentMood, setCurrentMood] = useState<MoodDetectionResult | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodDetectionResult[]>([]);
  const [isMoodDetectionActive, setIsMoodDetectionActive] = useState(true);
  const [moodAnalysisInterval, setMoodAnalysisInterval] = useState<NodeJS.Timeout | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    sender: 'user' | 'mentor';
    message: string;
    timestamp: Date;
    emotion?: string;
    actionSuggestion?: string;
    studyTip?: string;
    personalizedAdvice?: string;
    motivationalQuote?: string;
    detectedMood?: MoodDetectionResult;
  }>>([]);

  // Use user's character if provided, otherwise use default mentor
  const [mentor, setMentor] = useState<MentorPersonality>(() => {
    if (userCharacter) {
      return {
        name: userCharacter.name || 'Your AI Mentor',
        personality: userCharacter.personality?.description || 'Wise and encouraging, with a touch of humor',
        expertise: userCharacter.abilities ? [userCharacter.abilities.element, 'General Studies'] : ['Programming', 'Mathematics', 'Physics', 'Study Techniques'],
        voiceType: userCharacter.voiceSettings?.tone || 'wise',
        appearance: {
          hairColor: userCharacter.appearance?.hairColor || '#4A90E2',
          eyeColor: userCharacter.appearance?.eyeColor || '#00FFFF',
          outfit: userCharacter.appearance?.outfit || 'Cyberpunk Teacher',
          accessories: userCharacter.appearance?.accessories || ['Digital Glasses', 'Holographic Badge']
        }
      };
    }
    
    return selectedMentor || {
      name: 'Akira Sensei',
      personality: 'Wise and encouraging, with a touch of humor',
      expertise: ['Programming', 'Mathematics', 'Physics', 'Study Techniques'],
      voiceType: 'wise',
      appearance: {
        hairColor: '#4A90E2',
        eyeColor: '#00FFFF',
        outfit: 'Cyberpunk Teacher',
        accessories: ['Digital Glasses', 'Holographic Badge']
      }
    };
  });

  // Mood Detection Functions
  const detectMoodFromVideo = async (): Promise<MoodDetectionResult | null> => {
    if (!videoRef.current || !canvasRef.current || !isVideoOn) return null;
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Capture frame from video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Simulate mood detection (in real implementation, this would use AI/ML)
      const mockMoodDetection = (): MoodDetectionResult => {
        const moods: MoodDetectionResult['mood'][] = ['happy', 'focused', 'confused', 'excited', 'neutral', 'tired'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        
        // Simulate more realistic mood patterns based on interaction
        let detectedMood: MoodDetectionResult['mood'] = 'neutral';
        let confidence = 0.7;
        let indicators: string[] = [];
        
        // Analyze recent chat patterns for mood hints
        const recentMessages = chatHistory.slice(-3);
        const hasQuestions = recentMessages.some(msg => msg.message.includes('?'));
        const hasPositiveWords = recentMessages.some(msg => 
          /good|great|awesome|thanks|understand|got it/i.test(msg.message)
        );
        const hasNegativeWords = recentMessages.some(msg => 
          /confused|don't understand|difficult|hard|stuck|help/i.test(msg.message)
        );
        
        if (hasPositiveWords) {
          detectedMood = Math.random() > 0.3 ? 'happy' : 'excited';
          confidence = 0.85;
          indicators = ['Positive language detected', 'Engaged tone'];
        } else if (hasNegativeWords) {
          detectedMood = Math.random() > 0.5 ? 'confused' : 'frustrated';
          confidence = 0.8;
          indicators = ['Difficulty indicators', 'Help-seeking behavior'];
        } else if (hasQuestions) {
          detectedMood = 'focused';
          confidence = 0.75;
          indicators = ['Active questioning', 'Learning engagement'];
        } else {
          detectedMood = randomMood;
          indicators = ['Facial expression analysis', 'Body language cues'];
        }
        
        return {
          mood: detectedMood,
          confidence,
          indicators,
          timestamp: new Date()
        };
      };
      
      return mockMoodDetection();
    } catch (error) {
      console.error('Mood detection error:', error);
      return null;
    }
  };

  const detectMoodFromSpeech = (transcript: string): MoodDetectionResult | null => {
    if (!transcript.trim()) return null;
    
    // Analyze speech patterns for mood indicators
    const lowerTranscript = transcript.toLowerCase();
    let mood: MoodDetectionResult['mood'] = 'neutral';
    let confidence = 0.6;
    let indicators: string[] = [];
    
    // Positive mood indicators
    if (/\b(great|awesome|amazing|love|excited|happy|good|yes|understand|got it)\b/i.test(transcript)) {
      mood = 'happy';
      confidence = 0.8;
      indicators = ['Positive vocabulary', 'Enthusiastic tone'];
    }
    // Confusion indicators
    else if (/\b(confused|don't understand|what|how|why|unclear|lost)\b/i.test(transcript)) {
      mood = 'confused';
      confidence = 0.85;
      indicators = ['Confusion keywords', 'Question patterns'];
    }
    // Frustration indicators
    else if (/\b(difficult|hard|stuck|frustrated|can't|impossible|give up)\b/i.test(transcript)) {
      mood = 'frustrated';
      confidence = 0.9;
      indicators = ['Frustration keywords', 'Negative sentiment'];
    }
    // Excitement indicators
    else if (/\b(wow|cool|interesting|fascinating|let's go|awesome)\b/i.test(transcript)) {
      mood = 'excited';
      confidence = 0.8;
      indicators = ['Excitement keywords', 'High energy language'];
    }
    // Focus indicators
    else if (/\b(explain|show me|teach|learn|study|practice)\b/i.test(transcript)) {
      mood = 'focused';
      confidence = 0.75;
      indicators = ['Learning keywords', 'Goal-oriented language'];
    }
    // Tiredness indicators
    else if (/\b(tired|exhausted|break|later|enough)\b/i.test(transcript)) {
      mood = 'tired';
      confidence = 0.8;
      indicators = ['Fatigue keywords', 'Low energy indicators'];
    }
    
    return {
      mood,
      confidence,
      indicators,
      timestamp: new Date()
    };
  };

  const updateMoodDetection = async () => {
    if (!isMoodDetectionActive || !isCallActive) return;
    
    // Combine video and speech mood detection
    const videoMood = await detectMoodFromVideo();
    const speechMood = currentMessage ? detectMoodFromSpeech(currentMessage) : null;
    
    // Determine the most confident mood detection
    let finalMood: MoodDetectionResult | null = null;
    
    if (videoMood && speechMood) {
      finalMood = videoMood.confidence > speechMood.confidence ? videoMood : speechMood;
      finalMood.indicators = [...videoMood.indicators, ...speechMood.indicators];
    } else if (videoMood) {
      finalMood = videoMood;
    } else if (speechMood) {
      finalMood = speechMood;
    }
    
    if (finalMood && finalMood.confidence > 0.6) {
      setCurrentMood(finalMood);
      setMoodHistory(prev => [...prev.slice(-9), finalMood]); // Keep last 10 moods
    }
  };

  const getMoodBasedResponse = (userMessage: string, detectedMood: MoodDetectionResult): string => {
    const moodResponses = {
      happy: [
        "I love seeing your enthusiasm! Let's keep this positive energy going.",
        "Your excitement is contagious! This is exactly the mindset for learning.",
        "Fantastic attitude! You're in the perfect state of mind to absorb new knowledge."
      ],
      excited: [
        "Your excitement is amazing! Let's channel that energy into mastering this concept.",
        "I can feel your enthusiasm! This is when the best learning happens.",
        "Your energy is incredible! Let's dive deep into this topic while you're so engaged."
      ],
      confused: [
        "I can see you're working through some confusion - that's completely normal and actually a sign of deep thinking!",
        "Confusion is just your brain making new connections. Let me break this down step by step.",
        "It's okay to feel confused - it means you're challenging yourself! Let's work through this together."
      ],
      frustrated: [
        "I understand this feels challenging right now. Take a deep breath - we'll tackle this together.",
        "Frustration is part of the learning process. You're pushing your boundaries, which is excellent!",
        "I can sense your frustration. Let's try a different approach that might click better for you."
      ],
      focused: [
        "I can see you're really focused - this is perfect for deep learning!",
        "Your concentration is excellent! Let's make the most of this focused state.",
        "Great focus! This is exactly the mindset that leads to breakthrough moments."
      ],
      tired: [
        "I notice you might be feeling a bit tired. Would you like to take a short break or try a more energizing approach?",
        "It's important to listen to your body. We can either take a break or try some engaging activities to re-energize.",
        "Fatigue is normal during intense learning. Let's adjust our approach to match your current energy level."
      ],
      sad: [
        "I'm here to support you. Learning can be emotional, and that's perfectly okay.",
        "It's alright to feel this way. Let's work together to turn this into a positive learning experience.",
        "Your feelings are valid. Sometimes the best learning happens when we work through challenges together."
      ],
      neutral: [
        "You seem calm and ready to learn. This is a great state for absorbing new information.",
        "I appreciate your steady approach to learning. Let's build on this solid foundation.",
        "Your balanced energy is perfect for methodical learning. Let's proceed step by step."
      ]
    };
    
    const responses = moodResponses[detectedMood.mood] || moodResponses.neutral;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getMoodIcon = (mood: MoodDetectionResult['mood']) => {
    switch (mood) {
      case 'happy': return <Smile className="h-4 w-4 text-cyber-yellow" />;
      case 'excited': return <Zap className="h-4 w-4 text-primary" />;
      case 'confused': return <AlertCircle className="h-4 w-4 text-secondary" />;
      case 'frustrated': return <Frown className="h-4 w-4 text-destructive" />;
      case 'focused': return <Eye className="h-4 w-4 text-neon-green" />;
      case 'tired': return <Meh className="h-4 w-4 text-light-gray" />;
      case 'sad': return <Heart className="h-4 w-4 text-secondary" />;
      default: return <Meh className="h-4 w-4 text-light-gray" />;
    }
  };

  const getMoodColor = (mood: MoodDetectionResult['mood']) => {
    switch (mood) {
      case 'happy': return 'text-cyber-yellow';
      case 'excited': return 'text-primary';
      case 'confused': return 'text-secondary';
      case 'frustrated': return 'text-destructive';
      case 'focused': return 'text-neon-green';
      case 'tired': return 'text-light-gray';
      case 'sad': return 'text-secondary';
      default: return 'text-light-gray';
    }
  };

  const handleCharacterGenerated = (character: any) => {
    // Convert generated character to mentor format
    const newMentor: MentorPersonality = {
      name: character.name,
      personality: character.personality.description,
      expertise: character.abilities ? [character.abilities.element, 'General Studies'] : ['General Studies'],
      voiceType: character.voiceSettings?.tone || 'wise',
      appearance: {
        hairColor: character.appearance?.hairColor || '#4A90E2',
        eyeColor: character.appearance?.eyeColor || '#00FFFF',
        outfit: character.appearance?.outfit || 'Cyberpunk Teacher',
        accessories: character.appearance?.accessories || ['Digital Glasses']
      }
    };
    setMentor(newMentor);
    setSelectedMentor(character);
    setShowCharacterGenerator(false);
  };

  useEffect(() => {
    // Initialize Gemini AI service status
    const status = geminiAI.getServiceStatus();
    setAIServiceStatus(status);
    
    // Initialize speech recognition with error handling
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          
          setCurrentMessage(transcript);
          
          if (event.results[event.results.length - 1].isFinal) {
            handleSendMessage(transcript);
            setCurrentMessage('');
          }
        };

        recognitionRef.current.onerror = () => {
          console.log('Speech recognition error');
          setIsListening(false);
        };
      } catch (error) {
        console.log('Speech recognition not available');
      }
    }

    // Initialize video stream for mood detection
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => {
          console.log('Camera access denied or not available');
        });
    }
  }, []);

  // Mood detection interval
  useEffect(() => {
    if (isCallActive && isMoodDetectionActive) {
      const interval = setInterval(updateMoodDetection, 3000); // Check mood every 3 seconds
      setMoodAnalysisInterval(interval);
      return () => clearInterval(interval);
    } else if (moodAnalysisInterval) {
      clearInterval(moodAnalysisInterval);
      setMoodAnalysisInterval(null);
    }
  }, [isCallActive, isMoodDetectionActive, currentMessage]);

  const startCall = async () => {
    setIsCallActive(true);
    // Simulate mentor greeting with personalized message
    setTimeout(async () => {
      setIsMentorSpeaking(true);
      const greeting = userCharacter 
        ? `Hello! I'm ${mentor.name}, your personal AI mentor. ${userCharacter.personality?.catchphrase || 'Ready to learn together?'} I can also detect your mood to provide better support. How can I help you with your studies today?`
        : "Hello! I'm Akira, your personal AI mentor with mood detection capabilities. How can I help you with your studies today?";
      
      await addMentorMessage(greeting, false);
      setTimeout(() => setIsMentorSpeaking(false), 4000);
    }, 1000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsMicOn(false);
    setIsListening(false);
    setCurrentMood(null);
    setMoodHistory([]);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (moodAnalysisInterval) {
      clearInterval(moodAnalysisInterval);
      setMoodAnalysisInterval(null);
    }
    
    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (!isMicOn && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.log('Could not start speech recognition');
        setIsListening(false);
      }
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.log('Could not stop speech recognition');
      }
    }
  };

  const addMentorMessage = async (message: string, isAIGenerated: boolean = false) => {
    let mentorResponse: MentorResponse | null = null;
    
    if (isAIGenerated && aiServiceStatus?.available) {
      try {
        setIsAIThinking(true);
        
        // Enhanced context with mood information
        const enhancedContext = {
          subject: 'general',
          difficulty: 'medium',
          userProgress: 75,
          recentActivity: 'studying',
          userMood: currentMood?.mood || 'neutral',
          moodConfidence: currentMood?.confidence || 0,
          moodIndicators: currentMood?.indicators || [],
          timeOfDay: new Date().toLocaleTimeString(),
          studySession: {
            duration: Math.floor(Date.now() / 60000) % 60,
            questionsAnswered: chatHistory.filter(msg => msg.sender === 'user').length,
            correctAnswers: Math.floor(chatHistory.filter(msg => msg.sender === 'user').length * 0.8),
            streak: 5
          },
          moodHistory: moodHistory.slice(-5) // Last 5 mood detections
        };
        
        mentorResponse = await geminiAI.generateMentorResponse(
          message,
          mentor as unknown as CharacterPersonality,
          enhancedContext
        );
        setIsAIThinking(false);
      } catch (error) {
        console.error('Error generating AI response:', error);
        setIsAIThinking(false);
      }
    }
    
    // If we have mood detection, use mood-based response as fallback or enhancement
    let finalMessage = mentorResponse?.message || message;
    if (currentMood && !mentorResponse) {
      finalMessage = getMoodBasedResponse(message, currentMood);
    }
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'mentor' as const,
      message: finalMessage,
      timestamp: new Date(),
      emotion: mentorResponse?.emotion,
      actionSuggestion: mentorResponse?.actionSuggestion,
      studyTip: mentorResponse?.studyTip,
      personalizedAdvice: mentorResponse?.personalizedAdvice,
      motivationalQuote: mentorResponse?.motivationalQuote,
      detectedMood: currentMood || undefined
    };
    setChatHistory(prev => [...prev, newMessage]);
    
    // Simulate text-to-speech with error handling
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(newMessage.message);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.onerror = () => console.log('Speech synthesis failed');
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.log('Speech synthesis not available');
      }
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Detect mood from the message
    const speechMood = detectMoodFromSpeech(message);
    if (speechMood && speechMood.confidence > 0.7) {
      setCurrentMood(speechMood);
      setMoodHistory(prev => [...prev.slice(-9), speechMood]);
    }
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      message,
      timestamp: new Date(),
      detectedMood: speechMood || undefined
    };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Generate AI response
    setTimeout(async () => {
      setIsMentorSpeaking(true);
      
      // Use AI if available, otherwise use fallback responses
      if (aiServiceStatus?.available) {
        await addMentorMessage(message, true);
      } else {
        // Enhanced fallback responses with mood consideration
        let responses = [
          "That's a great question! Let me help you understand this concept better.",
          "I can see you're making excellent progress. Here's what I suggest...",
          "Interesting approach! Have you considered this alternative method?",
          "You're on the right track. Let's dive deeper into this topic.",
          "Perfect! This reminds me of a similar problem we solved before.",
          "Great thinking! This concept connects to what we learned earlier.",
          "I'm impressed by your curiosity. Let's explore this together.",
          "Excellent question! This is a fundamental concept in this subject."
        ];
        
        // Add mood-aware responses
        if (currentMood) {
          const moodResponse = getMoodBasedResponse(message, currentMood);
          responses.unshift(moodResponse);
        }
        
        // Add personality-specific responses if user character exists
        if (userCharacter?.personality) {
          const personalityResponses = [
            `${userCharacter.personality.catchphrase} Let's tackle this challenge together!`,
            `As someone with ${userCharacter.personality.trait}, I think you'll find this approach interesting...`,
            `Your ${userCharacter.personality.trait} nature will help you master this concept quickly!`
          ];
          responses = [...responses, ...personalityResponses];
        }
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await addMentorMessage(randomResponse, false);
      }
      
      setTimeout(() => setIsMentorSpeaking(false), 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                  {userCharacter?.image ? (
                    <Image
                      src={userCharacter.image}
                      alt={mentor.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground">{mentor.name}</h3>
                  <p className="text-sm font-paragraph text-light-gray">
                    {userCharacter ? 'Your Personal AI Mentor' : 'AI Learning Mentor'}
                  </p>
                </div>
                {isCallActive && (
                  <Badge className="bg-neon-green/20 text-neon-green">
                    <div className="w-2 h-2 bg-neon-green rounded-full mr-2 animate-pulse" />
                    Live
                  </Badge>
                )}
                {aiServiceStatus?.available && (
                  <Badge className="bg-primary/20 text-primary">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                )}
              </div>
              <Button variant="ghost" onClick={onClose} className="text-light-gray hover:text-foreground">
                ✕
              </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
              {/* Video Call Area */}
              <div className="flex-1 relative bg-black">
                {isCallActive ? (
                  <div className="w-full h-full relative">
                    {/* Mentor Video */}
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary relative ${
                          isMentorSpeaking ? 'animate-pulse' : ''
                        }`}>
                          {userCharacter?.image ? (
                            <Image
                              src={userCharacter.image}
                              alt={mentor.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-6xl">
                              👨‍🏫
                            </div>
                          )}
                          {isMentorSpeaking && (
                            <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
                          )}
                        </div>
                        <h4 className="font-heading font-bold text-white text-xl">{mentor.name}</h4>
                        <p className="font-paragraph text-light-gray">
                          {isMentorSpeaking ? 'Speaking...' : 'Listening...'}
                        </p>
                        {userCharacter?.personality?.trait && (
                          <p className="text-xs font-paragraph text-primary mt-1">
                            {userCharacter.personality.trait}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* User Video (Picture-in-Picture) */}
                    {isVideoOn && (
                      <div className="absolute bottom-4 right-4 w-32 h-24 bg-dark-gray rounded-lg border border-primary/30 flex items-center justify-center">
                        <div className="text-4xl">👤</div>
                      </div>
                    )}

                    {/* Call Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <Button
                        size="sm"
                        variant={isMicOn ? "default" : "secondary"}
                        onClick={toggleMic}
                        className={`rounded-full ${isMicOn ? 'bg-primary text-primary-foreground' : 'bg-red-500 text-white'}`}
                      >
                        {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant={isVideoOn ? "default" : "secondary"}
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        className="rounded-full"
                      >
                        {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={endCall}
                        className="rounded-full bg-red-500 hover:bg-red-600"
                      >
                        <PhoneOff className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Voice Recognition Indicator */}
                    {isListening && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-white text-sm font-paragraph">Listening...</span>
                      </div>
                    )}

                    {/* Mood Detection Display */}
                    {currentMood && isCallActive && (
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="text-white text-sm font-heading font-bold">Mood Detection</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          {getMoodIcon(currentMood.mood)}
                          <span className={`text-sm font-paragraph capitalize ${getMoodColor(currentMood.mood)}`}>
                            {currentMood.mood}
                          </span>
                          <Badge className="bg-primary/20 text-primary text-xs">
                            {Math.round(currentMood.confidence * 100)}%
                          </Badge>
                        </div>
                        <div className="text-xs text-light-gray">
                          {currentMood.indicators.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    )}

                    {/* Mood Detection Toggle */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant={isMoodDetectionActive ? "default" : "outline"}
                        onClick={() => setIsMoodDetectionActive(!isMoodDetectionActive)}
                        className="bg-black/50 backdrop-blur-sm border-primary/30"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">Mood AI</span>
                      </Button>
                      
                      {/* AI Thinking Indicator */}
                      {isAIThinking && (
                        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                          <Brain className="w-4 h-4 text-primary animate-pulse" />
                          <span className="text-white text-sm font-paragraph">AI Thinking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary">
                        {userCharacter?.image ? (
                          <Image
                            src={userCharacter.image}
                            alt={mentor.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-6xl">
                            👨‍🏫
                          </div>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-white text-xl mb-2">{mentor.name}</h4>
                      <p className="font-paragraph text-light-gray mb-2">Ready to start your learning session?</p>
                      {userCharacter?.personality?.catchphrase && (
                        <p className="text-sm font-paragraph text-primary mb-4 italic">
                          "{userCharacter.personality.catchphrase}"
                        </p>
                      )}
                      <Button onClick={startCall} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Phone className="h-4 w-4 mr-2" />
                        Start Video Call
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Sidebar */}
              <div className="w-80 border-l border-primary/20 flex flex-col max-h-[70vh]">
                <div className="p-4 border-b border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-heading font-bold text-foreground">Chat & Voice</h4>
                    {currentMood && (
                      <div className="flex items-center gap-1">
                        {getMoodIcon(currentMood.mood)}
                        <span className={`text-xs font-paragraph capitalize ${getMoodColor(currentMood.mood)}`}>
                          {currentMood.mood}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-paragraph text-light-gray">
                    Speak naturally or type your questions
                  </p>
                  {isMoodDetectionActive && (
                    <div className="mt-2">
                      <Badge className="bg-primary/20 text-primary text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        Mood AI Active
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Mood History Panel */}
                {moodHistory.length > 0 && (
                  <div className="p-3 border-b border-primary/20 bg-background/50">
                    <h5 className="text-xs font-heading font-bold text-foreground mb-2">Mood Trend</h5>
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {moodHistory.slice(-8).map((mood, index) => (
                        <div key={index} className="flex flex-col items-center min-w-0">
                          <div className="w-6 h-6 rounded-full bg-dark-gray border border-primary/20 flex items-center justify-center">
                            {getMoodIcon(mood.mood)}
                          </div>
                          <span className="text-xs text-light-gray mt-1 truncate">
                            {mood.mood.slice(0, 3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh]">
                  {chatHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background border border-primary/20 text-foreground'
                        }`}
                      >
                        {/* Message with mood indicator */}
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="font-paragraph text-sm">{msg.message}</p>
                          </div>
                          {msg.detectedMood && (
                            <div className="flex-shrink-0">
                              {getMoodIcon(msg.detectedMood.mood)}
                            </div>
                          )}
                        </div>
                        
                        {/* Enhanced mentor response sections */}
                        {msg.sender === 'mentor' && msg.detectedMood && (
                          <div className="mt-2 p-2 bg-primary/5 rounded text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <TrendingUp className="h-3 w-3 text-primary" />
                              <span className="font-bold text-primary">Mood-Adapted Response</span>
                            </div>
                            <p className="text-light-gray">
                              Detected {msg.detectedMood.mood} mood ({Math.round(msg.detectedMood.confidence * 100)}% confidence)
                            </p>
                          </div>
                        )}
                        
                        {msg.sender === 'mentor' && msg.actionSuggestion && (
                          <div className="mt-2 p-2 bg-primary/10 rounded text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <Zap className="h-3 w-3 text-primary" />
                              <span className="font-bold text-primary">Action:</span>
                            </div>
                            <p className="text-light-gray">{msg.actionSuggestion}</p>
                          </div>
                        )}
                        {msg.sender === 'mentor' && msg.studyTip && (
                          <div className="mt-2 p-2 bg-secondary/10 rounded text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <Brain className="h-3 w-3 text-secondary" />
                              <span className="font-bold text-secondary">Tip:</span>
                            </div>
                            <p className="text-light-gray">{msg.studyTip}</p>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-primary/20">
                  {/* Mood Detection Controls */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isMoodDetectionActive ? "default" : "outline"}
                        onClick={() => setIsMoodDetectionActive(!isMoodDetectionActive)}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Mood AI
                      </Button>
                      {currentMood && (
                        <Badge className={`text-xs ${getMoodColor(currentMood.mood)}`}>
                          {currentMood.mood} ({Math.round(currentMood.confidence * 100)}%)
                        </Badge>
                      )}
                    </div>
                    {moodHistory.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setMoodHistory([])}
                        className="text-xs text-light-gray"
                      >
                        Clear History
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type your question..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage(currentMessage);
                          setCurrentMessage('');
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        handleSendMessage(currentMessage);
                        setCurrentMessage('');
                      }}
                      className="bg-primary text-primary-foreground"
                    >
                      Send
                    </Button>
                  </div>
                  
                  {/* Hidden video and canvas for mood detection */}
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="hidden"
                    width="320"
                    height="240"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                    width="320"
                    height="240"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mentor Customization Component
interface MentorCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: MentorPersonality;
  onSave: (mentor: MentorPersonality) => void;
}

export function MentorCustomization({ isOpen, onClose, mentor, onSave }: MentorCustomizationProps) {
  const [editedMentor, setEditedMentor] = useState<MentorPersonality>(mentor);

  const handleSave = () => {
    onSave(editedMentor);
    onClose();
  };

  const resetToDefault = () => {
    setEditedMentor({
      name: 'Akira Sensei',
      personality: 'Wise and encouraging, with a touch of humor',
      expertise: ['Programming', 'Mathematics', 'Physics', 'Study Techniques'],
      voiceType: 'wise',
      appearance: {
        hairColor: '#4A90E2',
        eyeColor: '#00FFFF',
        outfit: 'Cyberpunk Teacher',
        accessories: ['Digital Glasses', 'Holographic Badge']
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="font-heading font-bold text-foreground text-xl">Customize Your Mentor</h3>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-light-gray hover:text-foreground">
                ✕
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <Tabs defaultValue="personality" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personality">Personality</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="voice">Voice & Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="personality" className="space-y-4">
                  <div>
                    <Label htmlFor="mentor-name">Mentor Name</Label>
                    <Input
                      id="mentor-name"
                      value={editedMentor.name}
                      onChange={(e) => setEditedMentor(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter mentor name..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="personality">Personality Description</Label>
                    <textarea
                      id="personality"
                      value={editedMentor.personality}
                      onChange={(e) => setEditedMentor(prev => ({ ...prev, personality: e.target.value }))}
                      className="w-full p-3 bg-background border border-primary/20 rounded-lg text-foreground resize-none"
                      rows={3}
                      placeholder="Describe your mentor's personality..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hair-color">Hair Color</Label>
                      <Input
                        id="hair-color"
                        type="color"
                        value={editedMentor.appearance.hairColor}
                        onChange={(e) => setEditedMentor(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, hairColor: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="eye-color">Eye Color</Label>
                      <Input
                        id="eye-color"
                        type="color"
                        value={editedMentor.appearance.eyeColor}
                        onChange={(e) => setEditedMentor(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, eyeColor: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="outfit">Outfit Style</Label>
                    <select
                      id="outfit"
                      value={editedMentor.appearance.outfit}
                      onChange={(e) => setEditedMentor(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, outfit: e.target.value }
                      }))}
                      className="w-full p-3 bg-background border border-primary/20 rounded-lg text-foreground"
                    >
                      <option value="Cyberpunk Teacher">Cyberpunk Teacher</option>
                      <option value="Casual Mentor">Casual Mentor</option>
                      <option value="Formal Professor">Formal Professor</option>
                      <option value="Anime Hero">Anime Hero</option>
                    </select>
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="space-y-4">
                  <div>
                    <Label htmlFor="voice-type">Voice Type</Label>
                    <select
                      id="voice-type"
                      value={editedMentor.voiceType}
                      onChange={(e) => setEditedMentor(prev => ({ 
                        ...prev, 
                        voiceType: e.target.value as MentorPersonality['voiceType']
                      }))}
                      className="w-full p-3 bg-background border border-primary/20 rounded-lg text-foreground"
                    >
                      <option value="gentle">Gentle & Calm</option>
                      <option value="energetic">Energetic & Upbeat</option>
                      <option value="wise">Wise & Thoughtful</option>
                      <option value="friendly">Friendly & Casual</option>
                    </select>
                  </div>
                  <div>
                    <Label>Expertise Areas</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Programming', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Art'].map((subject) => (
                        <label key={subject} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editedMentor.expertise.includes(subject)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditedMentor(prev => ({
                                  ...prev,
                                  expertise: [...prev.expertise, subject]
                                }));
                              } else {
                                setEditedMentor(prev => ({
                                  ...prev,
                                  expertise: prev.expertise.filter(exp => exp !== subject)
                                }));
                              }
                            }}
                            className="rounded border-primary/20"
                          />
                          <span className="text-sm font-paragraph text-foreground">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-primary/20">
              <Button variant="outline" onClick={resetToDefault} className="border-light-gray text-light-gray">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Mentor
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}