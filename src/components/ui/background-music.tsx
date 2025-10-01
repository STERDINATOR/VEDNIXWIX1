import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, VolumeX, Music, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration: number;
}

const cyberpunkTracks: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'Cyber Synthwave',
    src: 'https://static.wixstatic.com/media/c5b305_38c3e974c27f4d5c9792d5ff67396d9c~mv2.png?originWidth=256&originHeight=256',
    duration: 180
  },
  {
    id: '2',
    title: 'Digital Awakening',
    artist: 'Future Bass Collective',
    src: 'https://static.wixstatic.com/media/c5b305_4be442bf6f5248198acedc547435fba1~mv2.png?originWidth=256&originHeight=256',
    duration: 210
  },
  {
    id: '3',
    title: 'Matrix Code',
    artist: 'Synthwave Academy',
    src: 'https://static.wixstatic.com/media/c5b305_33a394de30c04a18900d8b8248088782~mv2.png?originWidth=256&originHeight=256',
    duration: 195
  },
  {
    id: '4',
    title: 'Anime Nights',
    artist: 'Lo-Fi Cyberpunk',
    src: 'https://static.wixstatic.com/media/c5b305_4f2af35478fe417ca1f99ca9559d2ba9~mv2.png?originWidth=256&originHeight=256',
    duration: 165
  },
  {
    id: '5',
    title: 'Cyber Academy',
    artist: 'VEDNIX Soundtrack',
    src: 'https://static.wixstatic.com/media/c5b305_86642379aed043d3a6f79bf0f135d6cb~mv2.png?originWidth=256&originHeight=256',
    duration: 220
  }
];

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % cyberpunkTracks.length);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + cyberpunkTracks.length) % cyberpunkTracks.length);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const track = cyberpunkTracks[currentTrack];

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={track.src}
        loop={false}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          console.log('Audio failed to load, using silent mode');
          setIsPlaying(false);
        }}
      />

      {/* Floating Music Control */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showPlayer && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="mb-4"
            >
              <Card className="bg-dark-gray/95 backdrop-blur-sm border-primary/30 p-4 w-80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg flex items-center justify-center">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-bold text-foreground text-sm truncate">
                      {track.title}
                    </h4>
                    <p className="font-paragraph text-light-gray text-xs truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs font-paragraph text-light-gray mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(track.duration)}</span>
                  </div>
                  <div className="w-full bg-dark-gray rounded-full h-1">
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / track.duration) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={prevTrack}
                      className="h-8 w-8 p-0 text-light-gray hover:text-primary"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={togglePlay}
                      className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={nextTrack}
                      className="h-8 w-8 p-0 text-light-gray hover:text-primary"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="h-8 w-8 p-0 text-light-gray hover:text-primary"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-16 h-1 bg-dark-gray rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <Button
          onClick={() => setShowPlayer(!showPlayer)}
          className="bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary shadow-lg"
          size="icon"
        >
          <Music className="h-5 w-5" />
        </Button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #00FFFF;
            cursor: pointer;
          }
          .slider::-moz-range-thumb {
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #00FFFF;
            cursor: pointer;
            border: none;
          }
        `
      }} />
    </>
  );
}