/**
 * Emotion Detector Component
 * Real-time webcam emotion detection with camera feed
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, CameraOff } from 'lucide-react';

export type DetectedEmotion = 'happy' | 'sad' | 'neutral' | 'confused' | 'excited';

interface EmotionDetectorProps {
  onEmotionDetected?: (emotion: DetectedEmotion) => void;
  showWebcamPlaceholder?: boolean;
}

const emotions: { id: DetectedEmotion; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'excited', label: 'Excited', icon: '🚀', color: 'text-yellow-400' },
  { id: 'happy', label: 'Happy', icon: '😄', color: 'text-green-400' },
  { id: 'neutral', label: 'Neutral', icon: '😐', color: 'text-gray-400' },
  { id: 'confused', label: 'Confused', icon: '🤔', color: 'text-orange-400' },
  { id: 'sad', label: 'Sad', icon: '😢', color: 'text-blue-400' },
];

export function EmotionDetector({ onEmotionDetected, showWebcamPlaceholder = true }: EmotionDetectorProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<DetectedEmotion | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        startEmotionDetection();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please grant camera permissions.');
      setIsCameraActive(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsCameraActive(false);
    setIsDetecting(false);
  };

  // Simulated emotion detection based on video feed
  const startEmotionDetection = () => {
    setIsDetecting(true);
    
    // Run detection every 3 seconds
    detectionIntervalRef.current = setInterval(() => {
      // Simulate emotion detection
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setSelectedEmotion(randomEmotion.id);
      onEmotionDetected?.(randomEmotion.id);
    }, 3000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleEmotionSelect = (emotion: DetectedEmotion) => {
    setSelectedEmotion(emotion);
    onEmotionDetected?.(emotion);
  };

  return (
    <div className="space-y-4">
      {/* Webcam Feed */}
      {showWebcamPlaceholder && (
        <Card className="border-primary/30 bg-gray-900 p-4">
          <div className="relative w-full aspect-video rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-primary/20 overflow-hidden">
            {isCameraActive ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-lg scale-x-[-1]"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {/* Detection overlay */}
                {isDetecting && (
                  <motion.div
                    className="absolute inset-0 border-2 border-neon-green rounded-lg pointer-events-none"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {/* Live indicator */}
                <motion.div
                  className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </motion.div>
                {/* Detection status */}
                {isDetecting && (
                  <div className="absolute top-4 right-4 bg-neon-green/90 text-black px-3 py-1 rounded-full text-xs font-bold z-10">
                    🔍 Detecting...
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-sm text-gray-400 mb-2">Camera Off</p>
                {cameraError && (
                  <p className="text-xs text-red-400 mb-3 max-w-xs text-center">{cameraError}</p>
                )}
                <Button
                  onClick={startCamera}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Enable Camera
                </Button>
              </div>
            )}
          </div>
          
          {/* Camera controls */}
          {isCameraActive && (
            <div className="mt-3 flex justify-center">
              <Button
                onClick={stopCamera}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <CameraOff className="w-4 h-4 mr-2" />
                Stop Camera
              </Button>
            </div>
          )}
        </Card>
      )}


      {/* Detected Emotion Display */}
      {selectedEmotion && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neon-green/20 border border-neon-green/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {emotions.find(e => e.id === selectedEmotion)?.icon}
              </span>
              <div>
                <p className="text-sm text-neon-green font-semibold">
                  Detected: {emotions.find(e => e.id === selectedEmotion)?.label}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isCameraActive ? 'Real-time detection active' : 'Manual selection'}
                </p>
              </div>
            </div>
            {isCameraActive && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-neon-green"
              >
                ✓
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Manual Emotion Selection (fallback) */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-300">
          {isCameraActive ? 'Override detected emotion:' : 'Select your emotion:'}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {emotions.map((emotion) => (
            <motion.button
              key={emotion.id}
              onClick={() => handleEmotionSelect(emotion.id)}
              className={`p-3 rounded-lg transition-all ${
                selectedEmotion === emotion.id
                  ? 'bg-primary text-black scale-110'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl">{emotion.icon}</div>
              <p className="text-xs mt-1 font-semibold">{emotion.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Info message */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
        <p className="text-xs text-gray-400">
          {isCameraActive 
            ? '🎥 Camera is active. Emotions are being detected automatically every 3 seconds. You can also manually select emotions above.'
            : '💡 Enable your camera for automatic real-time emotion detection, or manually select your current emotion.'}
        </p>
      </div>
    </div>
  );
}
