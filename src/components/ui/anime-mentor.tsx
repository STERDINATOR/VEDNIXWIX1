import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { AnimeCharacterGenerator } from '@/components/ui/anime-character-generator';
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
  RotateCcw
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

interface AnimeMentorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnimeMentor({ isOpen, onClose }: AnimeMentorProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMentorSpeaking, setIsMentorSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showCharacterGenerator, setShowCharacterGenerator] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const recognitionRef = useRef<any>(null);
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    sender: 'user' | 'mentor';
    message: string;
    timestamp: Date;
  }>>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock mentor data
  const [mentor, setMentor] = useState<MentorPersonality>(
    selectedMentor || {
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
    }
  );

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
  }, []);

  const startCall = () => {
    setIsCallActive(true);
    // Simulate mentor greeting
    setTimeout(() => {
      setIsMentorSpeaking(true);
      addMentorMessage("Hello! I'm Akira, your personal AI mentor. How can I help you with your studies today?");
      setTimeout(() => setIsMentorSpeaking(false), 3000);
    }, 1000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsMicOn(false);
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
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

  const addMentorMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: 'mentor' as const,
      message,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, newMessage]);
    
    // Simulate text-to-speech with error handling
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.onerror = () => console.log('Speech synthesis failed');
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.log('Speech synthesis not available');
      }
    }
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      message: message.trim(),
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Simulate mentor response
    setTimeout(() => {
      setIsMentorSpeaking(true);
      const responses = [
        "That's a great question! Let me help you understand this concept better.",
        "I see what you're struggling with. Let's break this down step by step.",
        "Excellent observation! You're really thinking like a true scholar.",
        "Don't worry, this topic can be tricky. Let me explain it in a different way.",
        "You're making great progress! Keep up the excellent work!"
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMentorMessage(response);
      setTimeout(() => setIsMentorSpeaking(false), 2000);
    }, 1000);
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
            className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground">{mentor.name}</h3>
                  <p className="text-sm font-paragraph text-light-gray">AI Learning Mentor</p>
                </div>
                {isCallActive && (
                  <Badge className="bg-neon-green/20 text-neon-green">
                    <div className="w-2 h-2 bg-neon-green rounded-full mr-2 animate-pulse" />
                    Live
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
                        <div className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-6xl relative ${
                          isMentorSpeaking ? 'animate-pulse' : ''
                        }`}>
                          👨‍🏫
                          {isMentorSpeaking && (
                            <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
                          )}
                        </div>
                        <h4 className="font-heading font-bold text-white text-xl">{mentor.name}</h4>
                        <p className="font-paragraph text-light-gray">
                          {isMentorSpeaking ? 'Speaking...' : 'Listening...'}
                        </p>
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
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-6xl">
                        👨‍🏫
                      </div>
                      <h4 className="font-heading font-bold text-white text-xl mb-2">{mentor.name}</h4>
                      <p className="font-paragraph text-light-gray mb-6">Ready to start your learning session?</p>
                      <Button onClick={startCall} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Phone className="h-4 w-4 mr-2" />
                        Start Video Call
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Sidebar */}
              <div className="w-80 border-l border-primary/20 flex flex-col">
                <div className="p-4 border-b border-primary/20">
                  <h4 className="font-heading font-bold text-foreground mb-2">Chat & Voice</h4>
                  <p className="text-sm font-paragraph text-light-gray">
                    Speak naturally or type your questions
                  </p>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                        <p className="font-paragraph text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-primary/20">
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