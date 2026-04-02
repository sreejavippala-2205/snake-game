import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-terminal">
      <div className="scanline" />
      <div className="noise-bg" />
      
      <header className="mb-8 text-center z-10 w-full max-w-6xl border-b-4 border-magenta pb-4">
        <h1 className="text-4xl md:text-6xl font-pixel tracking-tighter text-cyan glitch-text uppercase" data-text="SYS.OP.SNAKE">
          SYS.OP.SNAKE
        </h1>
        <p className="text-magenta font-terminal text-xl mt-2 animate-pulse">
          [STATUS: ONLINE] // AUDIO_SYNC: ESTABLISHED
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <div className="bg-black p-4 border-2 border-cyan shadow-[4px_4px_0_0_#ff00ff] hover:shadow-[6px_6px_0_0_#ff00ff] transition-shadow">
            <h2 className="text-lg font-pixel text-magenta mb-4 uppercase">/// DIRECTIVES</h2>
            <ul className="space-y-2 text-lg text-cyan">
              <li className="flex justify-between border-b border-cyan/30 pb-1">
                <span>{'>'} VECTOR</span>
                <span>[ARROWS]</span>
              </li>
              <li className="flex justify-between border-b border-cyan/30 pb-1">
                <span>{'>'} HALT</span>
                <span>[SPACE]</span>
              </li>
              <li className="flex justify-between border-b border-cyan/30 pb-1">
                <span>{'>'} PURGE</span>
                <span>[R_KEY]</span>
              </li>
            </ul>
          </div>
          <div className="bg-black p-4 border-2 border-magenta shadow-[4px_4px_0_0_#00ffff] hover:shadow-[6px_6px_0_0_#00ffff] transition-shadow">
            <h2 className="text-lg font-pixel text-cyan mb-4 uppercase">/// LOG_ENTRY</h2>
            <p className="text-lg text-magenta leading-tight">
              WARNING: UNAUTHORIZED ACCESS DETECTED. INITIATING COUNTER-MEASURES. CONSUME DATA PACKETS TO EXTEND LIFESPAN.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 flex justify-center">
          <SnakeGame />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <MusicPlayer />
          
          <div className="lg:hidden bg-black p-4 border-2 border-cyan shadow-[4px_4px_0_0_#ff00ff] text-center">
            <p className="text-sm text-magenta font-pixel uppercase">
              {'>'} INPUT_REQ: ARROWS
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-cyan text-sm font-pixel uppercase tracking-widest z-10 border-t-2 border-cyan pt-4 w-full max-w-6xl text-center">
        &copy; 2026 SYS.OP // TERMINAL_ID: 8080 // END_OF_FILE
      </footer>
    </div>
  );
}
