import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthWave AI",
    duration: 180,
    cover: "https://picsum.photos/seed/synth/400/400",
    color: "neon-pink",
    url: "https://actions.google.com/sounds/v1/science_fiction/sci_fi_hover.ogg"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Digital Echo",
    duration: 210,
    cover: "https://picsum.photos/seed/cyber/400/400",
    color: "neon-blue",
    url: "https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg"
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "Retro Future",
    duration: 155,
    cover: "https://picsum.photos/seed/grid/400/400",
    color: "neon-purple",
    url: "https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(TRACKS[0].duration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black p-6 border-4 border-cyan shadow-[8px_8px_0_0_#00ffff] relative overflow-hidden">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Background Glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 bg-cyan/10 blur-3xl rounded-full transition-colors duration-500`} />
      
      <div className="flex flex-col gap-6 z-10 relative">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-24 h-24 border-2 border-magenta overflow-hidden shadow-[4px_4px_0_0_#ff00ff]"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center bg-black/20"
              >
                <Disc className="text-white/50 w-8 h-8" />
              </motion.div>
            )}
          </motion.div>
          
          <div className="flex flex-col">
            <motion.h3 
              key={`title-${currentTrack.id}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl font-pixel text-cyan tracking-tight uppercase"
            >
              {currentTrack.title}
            </motion.h3>
            <motion.p 
              key={`artist-${currentTrack.id}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-magenta font-terminal"
            >
              {'>'} {currentTrack.artist}
            </motion.p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-black text-cyan text-xs font-pixel uppercase tracking-wider border border-cyan">
                AI_GEN
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="relative h-2 w-full bg-black border border-cyan overflow-hidden">
            <motion.div 
              className={`absolute top-0 left-0 h-full bg-cyan`}
              initial={false}
              animate={{ width: `${(progress / duration) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
          <div className="flex justify-between text-sm font-terminal text-magenta">
            <span>{'>'} {formatTime(progress)}</span>
            <span>{formatTime(duration)} {'<'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={handlePrev}
            className="p-2 text-cyan hover:text-magenta transition-colors hover:scale-110 active:scale-95 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
          >
            <SkipBack fill="currentColor" size={28} />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-16 h-16 flex items-center justify-center bg-black border-4 border-magenta text-magenta hover:bg-magenta hover:text-black active:scale-95 transition-all shadow-[4px_4px_0_0_#00ffff]"
          >
            {isPlaying ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" className="ml-1" size={32} />}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 text-cyan hover:text-magenta transition-colors hover:scale-110 active:scale-95 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
          >
            <SkipForward fill="currentColor" size={28} />
          </button>
        </div>

        {/* Volume Indicator */}
        <div className="flex items-center gap-3 px-4 py-2 bg-black border border-cyan shadow-[2px_2px_0_0_#ff00ff]">
          <Volume2 size={16} className="text-cyan" />
          <div className="flex-1 h-2 bg-black border border-cyan overflow-hidden">
            <div className="w-2/3 h-full bg-magenta" />
          </div>
          <Music size={16} className="text-cyan" />
        </div>
      </div>
    </div>
  );
}

