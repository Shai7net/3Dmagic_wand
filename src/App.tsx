import React, { useEffect, useState, useCallback, useRef, ErrorInfo, Component, ReactNode } from 'react';
import { RefreshCw, Play, Pause } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const ROTATIONS_BEFORE_CHANGE = 3;
const VIDEOS_COUNT = 6;
const GLB_URL = 'https://raw.githubusercontent.com/Shai7net/3Dmagic_wand/cbf3312bea165b1763a7f076bbf2d2da32d951db/Dmagic_wand%20model/Dmagic_wand%20model.glb';

class ErrorBoundary extends Component<{children: ReactNode, fallback: ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function MagicWandModel() {
  const { scene } = useGLTF(GLB_URL);
  const wandRef = useRef<any>(null);

  useFrame((state) => {
    if (wandRef.current) {
      wandRef.current.position.y = -3 + Math.sin(state.clock.elapsedTime) * 0.1;
      wandRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return <primitive ref={wandRef} object={scene} scale={[2.2, 2.2, 2.2]} position={[0, -3, 0]} />;
}

export default function App() {
  const DEFAULT_VIDEO_IDS = [
    "zZ6U0X31278", // Example videos, you can replace these with your actual video IDs!
    "S_6G8-cI_eI",
    "G1h-44-pZlM",
    "rP77bHiyV18",
    "Z0x0M-qHjZ4",
    "2Q24T8vKzbw"
  ];
  
  const [allVideoIds, setAllVideoIds] = useState<string[]>(DEFAULT_VIDEO_IDS);
  const [displayedVideos, setDisplayedVideos] = useState<string[]>([]);
  const [rotationCount, setRotationCount] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  const fetchVideos = async () => {
    // In a completely static environment, we don't have an API. 
    // We just rely on the fallback IDs to populate the carousel immediately.
    pickRandomVideos(DEFAULT_VIDEO_IDS);
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
    <div className="relative w-full h-screen bg-[#050300] overflow-hidden [perspective:1200px]">
      
      {/* Brick texture background */}
      <div 
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
              backgroundImage: "url('https://www.transparenttextures.com/patterns/brick-wall.png')",
              backgroundRepeat: 'repeat',
          }}
      ></div>
      {/* Dark vignette effect focusing light in the center */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_60%,rgba(0,0,0,1)_100%)] pointer-events-none"></div>

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
            className="absolute flex items-center justify-center pointer-events-none w-full h-full" 
            style={{ transform: 'translateZ(0px)' }}
          >
              {/* 3D Canvas Context for GLB model */}
              <div className="absolute inset-0 z-0">
                  <Canvas 
                    camera={{ position: [0, 0, 6], fov: 50 }} 
                    gl={{ alpha: true, antialias: true }}
                  >
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[5, 10, 5]} intensity={1.5} />
                        <spotLight position={[-5, 5, -5]} intensity={1} color="#ffc266" />
                        
                        <ErrorBoundary fallback={null}>
                           <React.Suspense fallback={null}>
                              <MagicWandModel />
                           </React.Suspense>
                        </ErrorBoundary>
                  </Canvas>
              </div>

              {/* Glowing Orb (Kept for the magic effect, placed over the top of the wand) */}
              <div className="absolute flex items-center justify-center z-10 transition-transform">
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
