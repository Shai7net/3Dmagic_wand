import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Play, Pause } from 'lucide-react';

const ROTATIONS_BEFORE_CHANGE = 3;
const VIDEOS_COUNT = 6;

export default function App() {
  const [allVideoIds, setAllVideoIds] = useState<string[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<string[]>([]);
  const [rotationCount, setRotationCount] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (data.videoIds && data.videoIds.length > 0) {
        setAllVideoIds(data.videoIds);
        pickRandomVideos(data.videoIds);
      }
    } catch (err) {
      console.error("Failed to fetch video ids", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const pickRandomVideos = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    const shuffled = [...ids].sort(() => 0.5 - Math.random());
    setDisplayedVideos(shuffled.slice(0, VIDEOS_COUNT));
  }, []);

  const handleAnimationIteration = () => {
    setRotationCount((prev) => {
      const next = prev + 1;
      if (next % ROTATIONS_BEFORE_CHANGE === 0) {
        pickRandomVideos(allVideoIds);
      }
      return next;
    });
  };

  const handleManualRefresh = () => {
    pickRandomVideos(allVideoIds);
    setRotationCount(0); // Reset count on manual refresh
  };

  return (
    <div className="relative w-full h-screen bg-neutral-950 overflow-hidden [perspective:1200px]">
      
      {/* HUD & Controls */}
      <div className="absolute top-6 left-6 z-50 flex gap-4 pointer-events-none">
         <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/50 text-xs font-mono font-medium flex items-center justify-center pointer-events-auto shadow-lg">
            ROTATIONS: {rotationCount}
         </div>
      </div>
      <div className="absolute bottom-6 right-6 z-50 flex gap-4 flex-col">
         <button 
           onClick={() => setIsRotating(!isRotating)}
           className="bg-black/50 hover:bg-black/70 backdrop-blur-md p-4 rounded-full border border-white/10 text-white/80 transition-colors shadow-lg"
           title={isRotating ? "Pause Rotation" : "Resume Rotation"}
         >
           {isRotating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
         </button>
         <button 
           onClick={handleManualRefresh}
           className="bg-black/50 hover:bg-black/70 backdrop-blur-md p-4 rounded-full border border-white/10 text-white/80 transition-colors shadow-lg"
           title="Shuffle Videos"
         >
           <RefreshCw className="w-5 h-5" />
         </button>
      </div>

      {/* 3D Scene Container - Crucial for proper depth sorting between the Stick and the Videos */}
      <div className="absolute inset-0 flex items-center justify-center preserve-3d">
          
          {/* The Magic Stick (Center Anchor at Z=0) */}
          <div 
            className="absolute flex items-center justify-center pointer-events-none" 
            style={{ transform: 'translateZ(0px)' }}
          >
              {/* Stick Body (Starts perfectly at center, goes down to bottom) */}
              <div className="absolute top-0 w-8 h-[60vh] mt-[-10px] -translate-x-[2px]">
                 {/* Realistic gradient and texture with shadow inset for 3D rod effect */}
                 <div className="absolute inset-0 bg-gradient-to-b from-[#905D28] via-[#4A2D15] to-[#0A0603] rounded-b-[8px] rounded-t-full shadow-[inset_3px_0_8px_rgba(255,215,100,0.4),inset_-5px_0_12px_rgba(0,0,0,0.8),0_0_20px_rgba(255,160,0,0.15)] overflow-hidden">
                      
                      {/* Organic wood grain texture overlay */}
                      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='200'%3E%3Cpath d='M2 0 Q4 50 2 100 T2 200' fill='none' stroke='%23000' stroke-width='1.5' /%3E%3Cpath d='M6 0 Q8 60 4 120 T6 200' fill='none' stroke='%23000' stroke-width='2' opacity='0.6' /%3E%3C/svg%3E\")", backgroundRepeat: "repeat-y", backgroundSize: "100% 100%"}}></div>
                      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
                      
                      {/* Knots and root details */}
                      <div className="absolute top-12 -left-1.5 w-8 h-12 rounded-[50%] bg-[#381F0E] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),-2px_0_4px_rgba(255,255,255,0.15)] -rotate-3 overflow-hidden">
                         <div className="absolute inset-1.5 rounded-full border-[0.5px] border-[#180D06]/60"></div>
                         <div className="absolute inset-3 rounded-full border border-[#180D06]/40"></div>
                      </div>
    
                      <div className="absolute top-44 -right-1.5 w-7 h-10 rounded-[40%] bg-[#2b170a] shadow-[inset_-3px_1px_5px_rgba(0,0,0,0.8),1px_0_3px_rgba(255,255,255,0.1)] rotate-6">
                          <div className="absolute top-1.5 bottom-1.5 right-1 left-2 rounded-full border-[0.5px] border-black/50"></div>
                      </div>
    
                      <div className="absolute top-72 -left-1 w-5 h-7 rounded-[45%] bg-[#180d05] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)] rotate-[15deg]"></div>
                      
                      <div className="absolute bottom-32 -right-1 w-5 h-6 rounded-[35%] bg-[#080402] shadow-[inset_-1px_1px_3px_rgba(0,0,0,0.9)] -rotate-6"></div>
                 </div>
              </div>
    
              {/* Glowing Orb */}
              <div className="absolute flex items-center justify-center">
                  {/* Background ambient glow - extremely wide */}
                  <div className="absolute w-[100vw] h-[100vw] max-w-[80rem] max-h-[80rem] bg-amber-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                  {/* Outer massive glow */}
                  <div className="absolute w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[80px] animate-pulse"></div>
                  {/* Mid glow */}
                  <div className="absolute w-64 h-64 bg-amber-400/20 rounded-full blur-[40px] animate-pulse" style={{ animationDuration: '3s' }}></div>
                  {/* Inner glowing aura */}
                  <div className="absolute w-28 h-28 bg-amber-300/50 rounded-full blur-[20px] animate-pulse" style={{ animationDuration: '1.5s' }}></div>
                  {/* Core intense light sphere */}
                  <div className="relative w-14 h-14 bg-gradient-to-br from-white via-amber-100 to-amber-300 rounded-full shadow-[0_0_30px_10px_rgba(255,220,120,0.9),inset_0_0_20px_rgba(255,255,255,0.8)] blur-[1px]"></div>
                  
                  {/* Sparks/Dust particles layer */}
                  <div className="absolute w-80 h-80 animate-[spin_12s_linear_infinite]">
                     <div className="absolute top-8 left-16 w-1.5 h-1.5 bg-yellow-100 rounded-full shadow-[0_0_6px_rgba(255,200,0,1)] animate-ping" style={{ animationDuration: '2s' }}></div>
                     <div className="absolute bottom-16 right-20 w-1 h-1 bg-amber-200 rounded-full shadow-[0_0_5px_rgba(255,200,0,1)] animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
                     <div className="absolute top-1/2 right-6 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)] animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1.5s' }}></div>
                     <div className="absolute bottom-8 left-1/3 w-1 h-1 bg-amber-100 rounded-full shadow-[0_0_4px_rgba(255,255,255,1)] animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.5s' }}></div>
                  </div>
              </div>
          </div>

          {/* Rotating 3D Spinner Container */}
          <div 
            className={`absolute w-[320px] h-[180px] preserve-3d ${isRotating ? 'animate-spin-3d' : ''}`} 
            onAnimationIteration={handleAnimationIteration}
          >
            {displayedVideos.map((id, index) => {
              const angle = (360 / displayedVideos.length) * index;
              return (
                <div 
                  key={id + index}
                  className="absolute top-0 left-0 w-full h-full shadow-[0_0_40px_rgba(255,200,0,0.1)] rounded-xl transition-all duration-1000 ease-in-out hover:scale-110 group"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(550px)`,
                    backfaceVisibility: 'visible'
                  }}
                >
                  <div className="w-full h-full p-2 bg-gradient-to-br from-amber-500/30 to-black/90 rounded-xl border border-amber-900/50 backdrop-blur-md">
                    <div className="w-full h-full rounded-lg overflow-hidden bg-black object-cover relative pointer-events-auto">
                        <div className="absolute inset-0 z-10 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                        <iframe 
                            className="w-full h-full border-none pointer-events-auto"
                            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`YouTube video ${id}`}
                        />
                    </div>
                  </div>
                </div>
              );
            })}
            {displayedVideos.length === 0 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4">
                    <div className="text-amber-500/50 font-mono text-sm animate-pulse">
                        Summoning magic videos...
                    </div>
                </div>
            )}
          </div>
          
      </div>
    </div>
  );
}
