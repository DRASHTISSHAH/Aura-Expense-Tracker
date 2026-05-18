import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  PerspectiveCamera,
  Float,
  ContactShadows,
  Text,
  RoundedBox,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Camera } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Design tokens — static (used in 3D scene which is always dark)
const SCENE_COLORS = {
  accent: '#7c3aed',
  indigo: '#4f46e5',
};

// ─────────────────────────────────────────────────────────────────────────────
// The Hero: "Premium 3D Credit Card"
// ─────────────────────────────────────────────────────────────────────────────

export const CreditCardHero = ({ isScanning = false, ...props }) => {
  const cardRef = useRef();
  const scanLineRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const floatSpeed = 0.8;
    if (cardRef.current) {
      const oscillation = Math.sin(time * floatSpeed);
      cardRef.current.position.y = (oscillation - 1) * 0.1;
      cardRef.current.rotation.z = (oscillation + 1) * 0.017;
    }
    if (isScanning && scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(time * 3) * 1.5;
    }
  });

  return (
    <group {...props}>
      <group ref={cardRef}>
        {/* Card body — solid deep violet, premium look */}
        <RoundedBox args={[5, 3.15, 0.12]} radius={0.15} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#0a0514"
            roughness={0.4}
            metalness={0.6}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        {/* Top-face sheen layer */}
        <RoundedBox args={[5, 3.15, 0.01]} radius={0.15} smoothness={4} position={[0, 0, 0.06]}>
          <meshPhysicalMaterial
            color="#2d1b69"
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.4}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </RoundedBox>

        {/* Holographic EMV chip */}
        <group position={[-1.6, 0.4, 0.12]}>
          <mesh>
            <boxGeometry args={[0.7, 0.6, 0.01]} />
            <meshPhysicalMaterial 
              color="#ffd700" 
              emissive="#b8860b"
              emissiveIntensity={0.4}
              roughness={0.1} 
              metalness={1.0} 
              iridescence={1.0} 
              iridescenceIOR={1.5}
              iridescenceThicknessRange={[100, 400]}
              clearcoat={1.0}
            />
          </mesh>
          {/* Chip lines to make it look like a real chip */}
          <mesh position={[0, 0, 0.006]}>
            <boxGeometry args={[0.6, 0.5, 0.01]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffc107" emissiveIntensity={0.8} roughness={0.3} metalness={1} wireframe={true} />
          </mesh>
        </group>

        {/* Contactless Icon */}
        <group position={[-0.8, 0.4, 0.07]} rotation={[0, 0, -Math.PI / 4]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[i * 0.1, i * 0.1, 0]}>
              <ringGeometry args={[0.08 + i*0.06, 0.1 + i*0.06, 32, 1, 0, Math.PI / 2]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3 + i*0.15} />
            </mesh>
          ))}
        </group>

        {/* Card Number */}
        <Text
          position={[-2.0, -0.3, 0.07]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.15}
        >
          4242 4242 4242 4242
        </Text>

        {/* Expiry */}
        <Text
          position={[-0.2, -0.8, 0.07]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          VALID THRU
        </Text>
        <Text
          position={[0.5, -0.8, 0.07]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          12/28
        </Text>

        {/* Cardholder Name */}
        <Text
          position={[-2.0, -1.2, 0.07]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.05}
        >
          ALEXANDER PIERCE
        </Text>

        {/* Minimalist Card Brand Logo */}
        <group position={[1.8, -1.0, 0.07]}>
          <mesh position={[-0.25, 0, 0]}>
            <circleGeometry args={[0.3, 32]} />
            <meshPhysicalMaterial color="#ff3b30" transparent opacity={0.8} roughness={0.2} metalness={0.5} clearcoat={1.0} />
          </mesh>
          <mesh position={[0.25, 0, 0]}>
            <circleGeometry args={[0.3, 32]} />
            <meshPhysicalMaterial color="#ff9500" transparent opacity={0.8} roughness={0.2} metalness={0.5} clearcoat={1.0} />
          </mesh>
        </group>

        {/* Glowing Edge (Purple) */}
        <RoundedBox args={[5.05, 3.2, 0.05]} radius={0.15} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial color={SCENE_COLORS.accent} emissive={SCENE_COLORS.accent} emissiveIntensity={2} transparent opacity={0.3} />
        </RoundedBox>

        {isScanning && (
          <mesh ref={scanLineRef} position={[0, 0, 0.1]} rotation={[0, 0, 0]}>
            <planeGeometry args={[5.2, 0.04]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
          </mesh>
        )}
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Global Preloader
// ─────────────────────────────────────────────────────────────────────────────

const GlobalLoader = () => {
  const { active, progress } = useProgress();
  
  // Lock scroll while loading
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [active]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#03000a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: active ? 1 : 0,
      pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
    }}>
      <div style={{ width: 32, height: 32, background: '#7c3aed', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, animation: 'pulse 2s infinite' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <style>{`@keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(124, 58, 237, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); } }`}</style>
      
      <div style={{ position: 'relative', width: 240, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', left: 0, top: 0, height: '100%', 
          background: '#7c3aed', width: `${progress}%`, transition: 'width 0.3s ease-out',
          boxShadow: '0 0 10px #7c3aed'
        }} />
      </div>
      <p style={{ marginTop: 24, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10 }}>
        Initializing Core... {progress.toFixed(0)}%
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene Controller
// ─────────────────────────────────────────────────────────────────────────────

const Scene = ({ onComplete }) => {
  const { camera } = useThree();
  const groupRef = useRef();
  const cardTransformRef = useRef();
  const [isScanning, setIsScanning] = useState(false);

  // Responsive scale & position coordinates for WebGL viewport aspect ratios
  const isMobile = window.innerWidth < 768;
  const cardScale = isMobile ? 0.95 : 1.8;
  const xPos1 = isMobile ? 0 : 4.5;
  const yPos1 = isMobile ? -3.5 : 0;
  const xPos2 = isMobile ? 0 : -3.5;
  const yPos2 = isMobile ? -3.5 : -0.5;
  const xPos3 = isMobile ? 0 : 3.2;
  const yPos3 = isMobile ? -3.5 : 0;

  const zPosStart = isMobile ? 24 : 15;
  const zPos1 = isMobile ? 20 : 12;
  const zPos2 = isMobile ? 18 : 10;
  const zPos3 = isMobile ? 22 : 15;

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 3, // Even smoother "butter" scrub
        onUpdate: (self) => {
          if (self.progress > 0.99) onComplete();
          // Trigger scanning animation in the OCR section
          setIsScanning(self.progress > 0.6 && self.progress < 0.95);
        }
      }
    });

    // Parallax for text sections (Skip the first one or adjust start)
    gsap.utils.toArray(".narrative-content").forEach((text, i) => {
      // First section is visible by default
      if (i === 0) {
        gsap.to(text, {
          y: -100,
          scrollTrigger: {
            trigger: text,
            start: "top top",
            end: "bottom top",
            scrub: 1.5
          }
        });
      } else {
        gsap.fromTo(text, 
          { y: 100, opacity: 0 }, 
          { 
            y: -100, 
            opacity: 1, 
            scrollTrigger: {
              trigger: text,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5
            }
          }
        );
      }
    });

    // Progress bar
    tl.to("#progress-fill", { height: '100%', duration: 10 }, 0);

    // Camera & Card Storytelling
    // 1. Intro: Text Left, Card Right (Centered for better framing)
    tl.fromTo(camera.position, { z: zPosStart, y: 0, x: 0 }, { z: zPos1, x: 0, y: 0, duration: 2 }, 0);
    tl.fromTo(groupRef.current.position, { x: isMobile ? 0 : 8 }, { x: xPos1, y: yPos1, duration: 2 }, 0);
    tl.fromTo(groupRef.current.rotation, { x: 0.2, y: -0.6 }, { x: 0.1, y: -0.3, duration: 2 }, 0);
    
    // 2. Feature: Digital Wallets (Card spins dramatically to the left)
    tl.to(camera.position, { z: zPos2, x: 0, y: 0, duration: 3 }, 2);
    tl.to(groupRef.current.position, { x: xPos2, y: yPos2, duration: 3 }, 2);
    tl.to(groupRef.current.rotation, { y: Math.PI * 2 + 0.8, x: 0.3, z: 0.1, duration: 3 }, 2);

    // 3. Detail: OCR Scanning (Aligned perfectly with Login Page entry point)
    tl.to(camera.position, { x: 0, y: 0, z: zPos3, duration: 3 }, 5);
    tl.to(groupRef.current.position, { x: xPos3, y: yPos3, duration: 3 }, 5);
    tl.to(groupRef.current.rotation, { x: 0.3, y: -0.4, z: 0, duration: 3 }, 5);
    tl.to(cardTransformRef.current.scale, { x: cardScale, y: cardScale, z: cardScale, duration: 3 }, 5);

    // 4. Outro: Hold position for smooth transition
    tl.to(camera.position, { z: zPos3, x: 0, y: 0, duration: 2 }, 8);
    tl.to(groupRef.current.position, { x: xPos3, y: yPos3, duration: 2 }, 8);
    tl.to(groupRef.current.rotation, { x: 0.3, y: -0.4, z: 0, duration: 2 }, 8);
    tl.to(cardTransformRef.current.scale, { x: cardScale, y: cardScale, z: cardScale, duration: 2 }, 8);

  }, [camera, onComplete, isMobile]);

  return (
    <group ref={groupRef}>
      {/* Arches synced with the card position */}
      <group position={[isMobile ? 0 : 5, isMobile ? -3.5 : 0, -5]}>
        <mesh rotation={[0, 0, 0.2]}>
          <torusGeometry args={[8, 0.04, 16, 100]} />
          <meshBasicMaterial color={SCENE_COLORS.accent} transparent opacity={0.15} />
        </mesh>
        <mesh position={[2, 4, -5]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color={SCENE_COLORS.accent} transparent opacity={0.05} />
        </mesh>
      </group>

      <group ref={cardTransformRef} scale={isMobile ? 1.1 : 1.8}>
        <CreditCardHero isScanning={isScanning} />
      </group>
      <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

const LandingPage = ({ onScrollDown, hideText = false, isDarkMode = false }) => {
  // Dynamic 2D color tokens based on theme
  const BG = isDarkMode ? '#02020a' : '#f5f3ff';
  const TEXT = isDarkMode ? '#ffffff' : '#0a0514';
  const ACCENT = '#7c3aed';
  const GRADIENT = isDarkMode
    ? 'radial-gradient(circle at 70% 30%, #1e1b4b 0%, #02020a 70%)'
    : 'radial-gradient(circle at 70% 30%, #ede9fe 0%, #f5f3ff 70%)';
  useEffect(() => {
    gsap.utils.toArray('.narrative-section').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, x: -50 },
        { 
          opacity: 1, x: 0, 
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          }
        }
      );
      gsap.to(section, {
        opacity: 0, x: 50,
        scrollTrigger: {
          trigger: section,
          start: "bottom 30%",
          end: "bottom top",
          scrub: true,
        }
      });
    });
  }, []);

  return (
    <>
      <div style={{ opacity: hideText ? 0 : 1, transition: 'opacity 0.5s ease', pointerEvents: hideText ? 'none' : 'auto' }}>
        <GlobalLoader />
      </div>
      <div style={{ backgroundColor: BG, width: '100%', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: GRADIENT }} />
      <div style={{ position: 'fixed', inset: 0, opacity: isDarkMode ? 0.05 : 0.03, pointerEvents: 'none', zIndex: 10, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* 3D Canvas */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1 }}>
        <Canvas shadows gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={30} />
          <ambientLight intensity={1.5} />
          <spotLight position={[15, 20, 15]} angle={0.25} penumbra={1} intensity={4} castShadow />
          <pointLight position={[-15, 10, -10]} intensity={2} color="#ffffff" />
          <pointLight position={[15, -10, 10]} intensity={2} color="#ffffff" />
          <directionalLight position={[0, 10, 5]} intensity={1} />
          
          <React.Suspense fallback={null}>
            <Scene onComplete={onScrollDown} />
            <Environment preset="night" />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Scrollable Narrative - Selective hiding for login transition */}
      <div id="scroll-container" style={{ 
        position: 'relative', 
        zIndex: 2,
        opacity: hideText ? 0 : 1,
        pointerEvents: hideText ? 'none' : 'auto',
        transition: 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      }}>
        
        {/* Progress Fill */}
        <div style={{ position: 'fixed', left: '0', top: '0', height: '100%', width: '4px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', zIndex: 100 }}>
           <div id="progress-fill" style={{ width: '100%', height: '0%', background: ACCENT, boxShadow: `0 0 15px ${ACCENT}` }} />
        </div>

        <section className="narrative-section min-h-[120vh] flex items-start pt-24 lg:items-center justify-center lg:justify-start px-6 sm:px-12 lg:pl-[8%] text-center lg:text-left">
          <div className="narrative-content max-w-[850px]" style={{ color: TEXT }}>
            <p style={{ fontSize: '14px', letterSpacing: '0.4em', color: ACCENT, marginBottom: '20px', textTransform: 'uppercase', fontWeight: 900 }}>Financial Ledger</p>
            <h1 style={{ fontSize: 'clamp(32px, 8vw, 110px)', fontWeight: 950, letterSpacing: '-0.06em', lineHeight: 1.1, marginBottom: '40px' }}>
              Manage your <br/><span style={{ color: ACCENT }}>Wealth simply.</span>
            </h1>
            <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', opacity: 0.6, fontWeight: 300, maxWidth: '600px', lineHeight: 1.4, marginLeft: 'auto', marginRight: 'auto', lg: 'marginLeft: 0' }}>
              Experience the next generation of expense tracking.
            </p>
          </div>
        </section>

        <section className="narrative-section min-h-[120vh] flex items-start pt-24 lg:items-center justify-center lg:justify-end px-6 sm:px-12 lg:pr-[10%] text-center lg:text-right">
          <div className="narrative-content max-w-[500px]" style={{ color: TEXT }}>
            <p style={{ fontSize: '14px', letterSpacing: '0.4em', color: ACCENT, marginBottom: '20px', textTransform: 'uppercase', fontWeight: 900 }}>Precision</p>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 70px)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>
              Digital <br/><span style={{ opacity: 0.5 }}>Wallets.</span>
            </h2>
            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', opacity: 0.5, lineHeight: 1.6 }}>
              Manage multiple cards and accounts in one place. 
              Minimalist design meets powerful analytics.
            </p>
          </div>
        </section>

        <section className="narrative-section min-h-[120vh] flex items-start pt-24 lg:items-center justify-center lg:justify-start px-6 sm:px-12 lg:pl-[10%] text-center lg:text-left">
          <div className="narrative-content max-w-[600px]" style={{ color: TEXT }}>
            <p style={{ fontSize: '14px', letterSpacing: '0.4em', color: ACCENT, marginBottom: '20px', textTransform: 'uppercase', fontWeight: 900 }}>AI Intelligence Hub</p>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 70px)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Next-Gen <br/><span style={{ color: ACCENT }}>Aura AI.</span>
            </h2>
            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', opacity: 0.6, lineHeight: 1.6, marginBottom: '32px' }}>
              Supercharge your wealth with the world's most advanced financial intelligence. Own your habits and automate your ledger instantly.
            </p>
            
            {/* Real AI Highlights cards */}
            <div className="space-y-4 mb-10 text-left max-w-md mx-auto lg:mx-0">
              <div className={`p-5 rounded-3xl backdrop-blur-md flex items-start gap-4 transition-all hover:border-brand/40 group border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                <div className="p-3 bg-brand/10 text-brand rounded-2xl group-hover:scale-110 transition-transform flex items-center justify-center">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Aura Advisor</h4>
                  <p className={`text-[11px] mt-1 font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Interactive chat advisor that reads your transaction ledger and builds customized savings suggestions.
                  </p>
                </div>
              </div>
              
              <div className={`p-5 rounded-3xl backdrop-blur-md flex items-start gap-4 transition-all hover:border-brand/40 group border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Llama 3.2 Vision OCR</h4>
                  <p className={`text-[11px] mt-1 font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Point and scan receipts to instantly parse amount, date, merchant, and categorize transactions automatically.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
              style={{
                padding: '18px 45px', borderRadius: '100px', border: 'none',
                background: ACCENT, color: 'white', fontWeight: 900,
                fontSize: '14px', cursor: 'pointer', boxShadow: `0 20px 40px ${ACCENT}44`,
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                textTransform: 'uppercase', letterSpacing: '0.15em'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05) translateY(-5px)';
                e.target.style.boxShadow = `0 30px 60px ${ACCENT}66`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) translateY(0)';
                e.target.style.boxShadow = `0 20px 40px ${ACCENT}44`;
              }}
            >
              Get Started
            </button>
          </div>
        </section>

        <div style={{ height: '20vh' }} />
      </div>

    </div>
    </>
  );
};

export default LandingPage;
