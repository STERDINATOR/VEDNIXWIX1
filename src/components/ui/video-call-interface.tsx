/**
 * Video Call Interface Component
 * Simulated video call UI for mentor interactions
 * Can be integrated with real video streaming later
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mentors } from '@/entities';
import { Image } from '@/components/ui/image';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoCallInterfaceProps {
  mentor: Mentors;
  onEndCall?: () => void;
  isActive?: boolean;
}

export function VideoCallInterface({ mentor, onEndCall, isActive = true }: VideoCallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Simulate call duration
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

            {/* Animated border */}
            <motion.div
              className="absolute inset-0 border-2 border-primary rounded-lg"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ pointerEvents: 'none' }}
            />

            {/* Call Status Badge */}
            <motion.div
              className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
              Live
            </motion.div>

            {/* Call Duration */}
            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-sm font-mono text-primary">
              {formatDuration(callDuration)}
            </div>
          </div>
        </div>
      </Card>

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
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </motion.button>

        <motion.button
          onClick={onEndCall}
          className="p-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <PhoneOff className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-gray-800 rounded p-2 text-center">
          <p className="text-gray-400">Microphone</p>
          <p className="text-primary font-bold">{isMuted ? 'Off' : 'On'}</p>
        </div>
        <div className="bg-gray-800 rounded p-2 text-center">
          <p className="text-gray-400">Camera</p>
          <p className="text-primary font-bold">{isVideoOn ? 'On' : 'Off'}</p>
        </div>
        <div className="bg-gray-800 rounded p-2 text-center">
          <p className="text-gray-400">Connection</p>
          <p className="text-green-400 font-bold">Stable</p>
        </div>
      </div>
    </div>
  );
}
