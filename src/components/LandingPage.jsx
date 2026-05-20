import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Camera, ArrowRight, Shield, Layers, HelpCircle, Cpu, Sun, Moon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// Retro Neobrutalist Glass GUI Window Component
// ─────────────────────────────────────────────────────────────────────────────
const RetroWindow = ({ title, children, className = "", delay = 0, style = {}, isDarkMode }) => {
  const borderCol = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#000000';
  const bgCol = isDarkMode ? 'rgba(10, 8, 16, 0.75)' : 'rgba(255, 255, 255, 0.65)';
  const shadowCol = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.95)';

  return (
    <div
      style={{
        border: `1.5px solid ${borderCol}`,
        borderRadius: '16px',
        background: bgCol,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: `8px 8px 0px ${shadowCol}`,
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        animationDelay: `${delay}s`,
        ...style
      }}
      className={`hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[11px_11px_0px_rgba(0,0,0,1)] hover:border-black dark:hover:shadow-[11px_11px_0px_rgba(255,255,255,0.08)] dark:hover:border-white transition-all duration-300 ${className}`}
    >
      {/* Header Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: isDarkMode ? '#13111C' : '#000000',
          borderBottom: `1.5px solid ${borderCol}`,
          color: '#ffffff',
        }}
        className="font-mono-retro"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ width: '12px', height: '1.5px', background: '#ffffff' }} />
            <div style={{ width: '12px', height: '1.5px', background: '#ffffff' }} />
            <div style={{ width: '12px', height: '1.5px', background: '#ffffff' }} />
          </div>
          <span style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 700 }} className="uppercase text-white">
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56', border: '1px solid #000000' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e', border: '1px solid #000000' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f', border: '1px solid #000000' }} />
        </div>
      </div>
      
      {/* Window Body */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Interactive layered Device & Translucent Card holding portal
// ─────────────────────────────────────────────────────────────────────────────
const CardAndHandPortal = ({ isDarkMode, mouseX, mouseY }) => {
  const containerRef = useRef();
  const cardRef = useRef();
  const phoneRef = useRef();

  useEffect(() => {
    // Smooth magnetic float parallax using coordinates
    if (cardRef.current && phoneRef.current) {
      const tiltX = mouseY * 15; // Max 15 deg tilt
      const tiltY = mouseX * 15;
      
      gsap.to(cardRef.current, {
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(30px)`,
        duration: 0.5,
        ease: 'power2.out'
      });

      gsap.to(phoneRef.current, {
        transform: `perspective(1000px) rotateX(${tiltX * 0.4}deg) rotateY(${tiltY * 0.4}deg)`,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [mouseX, mouseY]);

  const borderCol = isDarkMode ? 'rgba(255, 255, 255, 0.25)' : '#000000';
  const cardOverlayBg = isDarkMode 
    ? 'radial-gradient(circle at 50% 30%, rgba(124, 58, 237, 0.3) 0%, rgba(10, 8, 16, 0.9) 100%)' 
    : 'radial-gradient(circle at 50% 30%, rgba(167, 139, 250, 0.35) 0%, rgba(255, 255, 255, 0.9) 100%)';

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1500px',
        overflow: 'visible'
      }}
    >
      {/* 1. Stylized background circular radar rings */}
      <div 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          border: `1.5px dashed ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          zIndex: 1,
          animation: 'spinRadar 40s linear infinite'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: `1.5px dashed ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          zIndex: 1,
          animation: 'spinRadarReverse 25s linear infinite'
        }}
      />

      {/* 2. Sleek OLED Device Mockup Container */}
      <div 
        id="oled-phone-container"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          perspective: '1500px',
          overflow: 'visible',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          ref={phoneRef}
          style={{
            position: 'relative',
            width: '260px',
            height: '520px',
            background: '#0B0A0F',
            border: `4px solid ${borderCol}`,
            borderRadius: '40px',
            boxShadow: isDarkMode ? '0 30px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 30px 60px rgba(0,0,0,0.25)',
            zIndex: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transformStyle: 'preserve-3d'
          }}
          className="transition-transform duration-300"
        >
          {/* Phone Notch */}
          <div style={{ width: '100px', height: '22px', background: '#000000', borderRadius: '0 0 16px 16px', margin: '0 auto', zIndex: 10, borderBottom: `1px solid ${borderCol}` }} />
          
          {/* Device Active screen contents */}
          <div style={{ padding: '24px 18px', flex: 1, display: 'flex', flexDirection: 'column', color: '#ffffff', fontFamily: '"JetBrains Mono", monospace', position: 'relative' }}>
            {/* Card Synced Overlay */}
            <div 
              id="phone-sync-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background: '#0B0A0F',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '24px',
                opacity: 0,
                zIndex: 20,
                transition: 'opacity 0.5s ease',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.05em' }}>LEDGER SYNCED</p>
                <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.02em' }}>AUTHENTICATING ACCESS PORTAL...</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.4)' }}>AURA.WALLETS</span>
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#10B981' }}>// SECURE</span>
            </div>

            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>LEDGER BALANCE</p>
            <h3 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '32px', color: '#ffffff' }}>$12,854.20</h3>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>CARD LIMITS</p>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: '#7C3AED' }} />
                </div>
              </div>

              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>MEMBERSHIP</p>
                <span style={{ fontSize: '9px', fontWeight: 900, color: '#a78bfa' }}>STANDARD SUITE</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'rgba(255,255,255,0.3)', marginTop: 'auto' }}>
              <span>PORT_ID: 4242</span>
              <span>ENG_V: 1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Gorgeous Floating Translucent Credit Card (Overlay) */}
      <div 
        id="floating-credit-card-container"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -35%)',
          zIndex: 5,
          perspective: '1000px',
          overflow: 'visible',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          ref={cardRef}
          style={{
            width: '320px',
            height: '196px',
            background: cardOverlayBg,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `2px solid ${borderCol}`,
            borderRadius: '16px',
            boxShadow: isDarkMode ? '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 40px rgba(124,58,237,0.2)' : '0 25px 50px -12px rgba(0,0,0,0.2)',
            zIndex: 5,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(40px)',
            color: isDarkMode ? '#ffffff' : '#000000'
          }}
          className="transition-transform duration-300 hover:cursor-grab active:cursor-grabbing"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.05em', color: isDarkMode ? '#ffffff' : '#000000' }} className="font-mono-retro">AURA</h4>
              <p style={{ fontSize: '8px', color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', marginTop: '2px' }} className="font-mono-retro">DEBIT STANDARD</p>
            </div>
            {/* Gold EMV Chip */}
            <div 
              style={{ 
                width: '42px', 
                height: '34px', 
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', 
                border: `1.5px solid ${borderCol}`, 
                borderRadius: '6px',
                position: 'relative'
              }} 
            >
              {/* Micro chip wireframe */}
              <div style={{ position: 'absolute', inset: '4px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '2px', opacity: 0.5 }} />
            </div>
          </div>

          <p style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.12em', color: isDarkMode ? '#ffffff' : '#000000' }} className="font-mono-retro">
            4242 8888 1234 5678
          </p>

          <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '7px', color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>CARDHOLDER</p>
              <p style={{ fontSize: '10px', fontWeight: 900, color: isDarkMode ? '#ffffff' : '#000000', marginTop: '2px' }}>ALEXANDER PIERCE</p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <p style={{ fontSize: '7px', color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>EXPIRES</p>
              <p style={{ fontSize: '10px', fontWeight: 900, color: isDarkMode ? '#ffffff' : '#000000', marginTop: '2px' }}>12/29</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sleek Minimalist Vector Hand Graphic (Nestling the device and card) */}
      <svg
        id="vector-hand"
        viewBox="0 0 400 400"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-38%, -35%)',
          width: '450px',
          height: '450px',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: isDarkMode ? 0.08 : 0.05
        }}
      >
        <path
          d="M380,400 C320,380 290,300 280,240 C272,190 260,170 240,165 C220,160 190,165 170,160 C150,155 140,140 142,125 C144,110 160,100 180,105 C210,112 250,140 270,150 C290,160 305,145 310,120 C315,95 320,50 320,30 C320,15 305,5 295,5 C285,5 278,15 278,30 C278,60 282,100 250,115 C220,130 180,130 150,115 C130,105 110,85 112,65 C114,45 130,35 150,40 C180,47 210,75 230,85 C245,92 255,80 255,65 C255,50 240,25 210,20 C180,15 140,30 120,40"
          fill="none"
          stroke={isDarkMode ? '#ffffff' : '#000000'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 5. Futuristic Scan Receipt Mockup Widget (Showcased in Segment 3) */}
      <div 
        id="aura-ai-container"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '240px',
          background: isDarkMode ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `2px solid #10B981`,
          borderRadius: '24px',
          boxShadow: isDarkMode ? '0 30px 60px rgba(0,0,0,0.8), 0 0 50px rgba(16, 185, 129, 0.15)' : '0 30px 60px rgba(0,0,0,0.15)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transformStyle: 'preserve-3d',
          opacity: 0,
          zIndex: 4,
          fontFamily: '"JetBrains Mono", monospace',
          overflow: 'hidden'
        }}
      >
        {/* Scanning Laser Line */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #10B981, transparent)',
          boxShadow: '0 0 12px #10B981',
          zIndex: 5,
          animation: 'scanLaser 3s infinite ease-in-out'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981'
            }} />
            <span style={{ fontSize: '9px', fontWeight: 900, color: isDarkMode ? '#ffffff' : '#000000', letterSpacing: '0.1em' }}>OCR.VISION_ACTIVE</span>
          </div>
          <span style={{ fontSize: '8px', color: '#10B981', fontWeight: 'bold' }}>SCANNING...</span>
        </div>

        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          background: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
          border: '1px dashed rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '12px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
            <span>RECEIPT #8421</span>
            <span>2026-05-20</span>
          </div>
          <div style={{ height: '1px', background: 'rgba(16, 185, 129, 0.2)', margin: '4px 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: isDarkMode ? '#ffffff' : '#000000' }}>
            <span style={{ color: '#10B981' }}>✓</span> <span>MERCHANT: STARBUCKS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: isDarkMode ? '#ffffff' : '#000000' }}>
            <span style={{ color: '#10B981' }}>✓</span> <span>AMOUNT: $4.50</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: isDarkMode ? '#ffffff' : '#000000' }}>
            <span style={{ color: '#10B981' }}>✓</span> <span>CATEGORY: FOOD & DINING</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)', marginTop: '8px' }}>
          <span>ACCURACY: 99.8%</span>
          <span>SPEED: 180ms</span>
        </div>
      </div>
      
      {/* Dynamic Keyframe Styles inside Portal */}
      <style>{`
        @keyframes scanLaser {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes pulseAi {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 15px #7C3AED; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes spinRadar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinRadarReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes scrollWheel {
          0% { transform: translateY(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main LandingPage Page Component
// ─────────────────────────────────────────────────────────────────────────────
const LandingPage = ({ onScrollDown, hideText = false, isDarkMode = false, toggleDarkMode }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Unified absolute theme tokens based on isDarkMode
  const BG = isDarkMode ? '#06050A' : '#F5F4EE';
  const TEXT = isDarkMode ? '#F5F5F4' : '#1C1917';
  const BORDER = isDarkMode ? 'rgba(255,255,255,0.2)' : '#000000';
  const SUBTEXT = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

  // Parallax cursor listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouseX(x);
      setMouseY(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax GSAP Scroll Synchronizations for Sections
  useEffect(() => {
    gsap.utils.toArray('.narrative-section').forEach((section) => {
      gsap.fromTo(section,
        { opacity: 0.1, y: 55 },
        {
          opacity: 1, y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 20%',
            scrub: true,
          }
        }
      );
    });

    // Fade out the mouse scroll indicator as user scrolls down
    gsap.to('#scroll-indicator', {
      opacity: 0,
      y: 20,
      scrollTrigger: {
        trigger: '#section-hero',
        start: 'top top',
        end: '30% top',
        scrub: true,
      }
    });

    // Device portal absolute coordinate shift synchronized on scroll
    const isMobileDevice = window.innerWidth < 1024;
    if (isMobileDevice) {
      ScrollTrigger.create({
        trigger: '#scroll-container',
        start: 'bottom bottom',
        onUpdate: (self) => {
          if (self.progress > 0.99) onScrollDown();
        }
      });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.2,
        onUpdate: (self) => {
          if (self.progress > 0.99) onScrollDown();
        }
      }
    });

    const xPos1 = '72%';
    const yPos1 = '50%';
    const xPos2 = '28%';
    const yPos2 = '50%';
    const xPos3 = '72%';
    const yPos3 = '50%';

    // Segment 1: Start at xPos1 (72%)
    tl.fromTo('#fixed-device-portal', 
      { left: '72%', top: '50%', scale: 1 },
      { left: xPos1, top: yPos1, ease: 'power1.inOut', duration: 1.0 }, 
      0
    );

    // Fade out phone and hand instantly as we scroll (starting at 0)
    tl.to('#oled-phone-container', {
      opacity: 0,
      scale: 0.85,
      y: 40,
      ease: 'power2.inOut',
      duration: 1.5
    }, 0);

    tl.to('#vector-hand', {
      opacity: 0,
      ease: 'power2.inOut',
      duration: 1.5
    }, 0);

    tl.to('#floating-credit-card-container', {
      scale: 1.25,
      x: 0,
      y: 0,
      rotateX: 10,
      rotateY: -15,
      rotateZ: 0,
      opacity: 1,
      ease: 'power2.inOut',
      duration: 1.5
    }, 0);

    // Segment 2: Device shifts gracefully to the left for Wallets (starting early as we leave the Hero)
    tl.to('#fixed-device-portal', 
      { left: xPos2, top: yPos2, ease: 'power2.out', duration: 2.0 }, 
      0.8
    );

    // ── WALLETS -> AI HUB: TRANSITION CARD OUT & SCAN RECEIPT WIDGET IN ──
    // Smoothly fade out credit card mockup EARLY as we begin to scroll away from Section 2
    tl.to('#floating-credit-card-container', {
      opacity: 0,
      scale: 0.85,
      y: 60,
      ease: 'power2.inOut',
      duration: 1.0
    }, 5.0);

    // Segment 3: Device shifts RAPIDLY back to the right for AI Hub (before Section 3 text slides up)
    tl.to('#fixed-device-portal', 
      { left: xPos3, top: yPos3, ease: 'power1.inOut', duration: 1.0 }, 
      6.0
    );

    // Smoothly fade in the Scan Receipt Widget only AFTER the portal has safely settled on the right
    tl.to('#aura-ai-container', {
      opacity: 1,
      scale: 1.15,
      rotateX: 10,
      rotateY: -15,
      rotateZ: 2,
      ease: 'power2.inOut',
      duration: 1.0
    }, 7.0);

    // ── AI HUB -> LOGIN (4TH SCREEN): SHOW NORMAL 1ST SCREEN LAYOUT AGAIN ──
    // Clean fade out of the Scan Receipt Widget
    tl.to('#aura-ai-container', {
      opacity: 0,
      scale: 0.85,
      y: -60,
      ease: 'power2.inOut',
      duration: 1.0
    }, 10.0);

    // Fade phone, credit card, and hand outline BACK in together (1st screen layout)
    tl.to('#oled-phone-container', {
      opacity: 1,
      scale: 1,
      y: 0,
      ease: 'power2.inOut',
      duration: 1.0
    }, 11.0);

    tl.to('#floating-credit-card-container', {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      ease: 'power2.inOut',
      duration: 1.0
    }, 11.0);

    tl.to('#vector-hand', {
      opacity: isDarkMode ? 0.08 : 0.05,
      ease: 'power2.inOut',
      duration: 1.0
    }, 11.0);
  }, [onScrollDown]);

  return (
    <div 
      style={{ 
        width: '100%', 
        position: 'relative', 
        overflowX: 'hidden', 
        background: BG,
        color: TEXT,
        transition: 'background-color 0.8s ease, color 0.8s ease'
      }} 
      className="font-sans-premium"
    >
      {/* Light/Dark Mode Toggle Button */}
      {toggleDarkMode && (
        <button
          onClick={toggleDarkMode}
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 100,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: `2px solid ${BORDER}`,
            background: isDarkMode ? '#13111C' : '#FFFFFF',
            color: TEXT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isDarkMode ? '4px 4px 0px rgba(255,255,255,0.06)' : '4px 4px 0px #000000',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          className="hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_rgba(255,255,255,0.08)] active:translate-y-[0px] active:translate-x-[0px]"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      )}

      {/* Noise layer overlay */}
      <div 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          opacity: 0.03, 
          pointerEvents: 'none', 
          zIndex: 10, 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />



      {/* ─────────────────────────────────────────────────────────────────────
          2. FIXED HARDWARE CARD AND DEVICE PORTAL
      ───────────────────────────────────────────────────────────────────── */}
      {!isMobile && (
        <div 
          id="fixed-device-portal"
          style={{
            position: 'fixed',
            left: '72%',
            top: '50%',
            width: '500px',
            height: '600px',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CardAndHandPortal isDarkMode={isDarkMode} mouseX={mouseX} mouseY={mouseY} />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          3. SCROLLABLE NARRATIVE LAYOUT
      ───────────────────────────────────────────────────────────────────── */}
      <div
        id="scroll-container"
        style={{
          position: 'relative',
          zIndex: 2,
          opacity: hideText ? 0 : 1,
          pointerEvents: hideText ? 'none' : 'auto',
          transition: 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        {/* Fill Line */}
        <div style={{ position: 'fixed', left: 0, top: 0, height: '100%', width: '4px', background: 'rgba(0,0,0,0.06)', zIndex: 100 }} className="dark:bg-white/5">
          <div id="progress-fill" style={{ width: '100%', height: '0%', background: '#7C3AED' }} />
        </div>

        {/* SECTION 1: THE BRUTALIST HERO */}
        <section
          id="section-hero"
          className="narrative-section min-h-screen flex items-center justify-start px-6 sm:px-12 lg:pl-[8%] pt-28 relative"
        >
          <div className="max-w-[700px] w-full md:-mt-24 -mt-10" style={{ color: TEXT }}>
            <h1 className="font-serif-luxury text-[clamp(36px,7.5vw,96px)] font-black leading-[1.05] tracking-[-0.04em] mb-8">
              Elegantly.<br />
              Intelligently.<br />
              <span className="font-display-luxury italic font-medium text-[#7C3AED]">Ledger.</span>
            </h1>
            
            <p 
              className="max-w-[480px] font-sans-premium text-[clamp(14px,2.5vw,17px)] leading-relaxed font-medium mb-12"
              style={{ color: SUBTEXT }}
            >
              Say goodbye to simple spreadsheets. Aura connects your transactions, credit cards, and digital assets into a retro-futuristic, high-fidelity ledger.
            </p>

            {isMobile && (
              <div style={{ height: '360px', width: '100%', margin: '24px 0', overflow: 'visible', display: 'flex', justifyContent: 'center', alignItems: 'center', scale: '0.65' }}>
                <CardAndHandPortal isDarkMode={isDarkMode} mouseX={mouseX} mouseY={mouseY} />
              </div>
            )}

            {/* GUI Windows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[550px]">
              <RetroWindow title="LEDGER_STATUS.EXE" delay={0.1} isDarkMode={isDarkMode}>
                <div className="space-y-4 font-mono-retro">
                  <div className="flex justify-between items-center border-b border-black pb-2 dark:border-white/20">
                    <span className="text-[9px]" style={{ color: SUBTEXT }}>NODE</span>
                    <span className="text-[10px] text-green-600 dark:text-emerald-400 font-black">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px]" style={{ color: SUBTEXT }}>TOTAL WALLETS</span>
                    <span className="text-xs font-black" style={{ color: TEXT }}>4 CONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px]" style={{ color: SUBTEXT }}>SYSTEM METRIC</span>
                    <span className="text-xs font-bold text-[#7C3AED]">$12,854.20</span>
                  </div>
                </div>
              </RetroWindow>

              <RetroWindow title="LIVE_TICKER.SYS" delay={0.2} className="hidden sm:block" isDarkMode={isDarkMode}>
                <div className="space-y-3 font-mono-retro">
                  <div className="p-2 border border-black dark:border-white/20 bg-yellow-50 dark:bg-yellow-950/20 flex justify-between items-center rounded-lg">
                    <span className="text-[9px] font-black" style={{ color: TEXT }}>GAS FEE</span>
                    <span className="text-[9px] font-black text-amber-600">0.00 GWEI</span>
                  </div>
                  <div className="p-2 border border-black dark:border-white/20 bg-stone-50 dark:bg-stone-900/30 flex justify-between items-center rounded-lg">
                    <span className="text-[9px] font-black" style={{ color: TEXT }}>OCR SCAN</span>
                    <span className="text-[9px] font-black text-green-600">READY</span>
                  </div>
                </div>
              </RetroWindow>
            </div>
          </div>

          {/* Mouse Scroll Indicator */}
          <div 
            id="scroll-indicator"
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'none',
              opacity: 0.8,
              transition: 'opacity 0.3s ease'
            }}
          >
            <div 
              style={{
                width: '24px',
                height: '40px',
                borderRadius: '12px',
                border: `2px solid ${TEXT}`,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '6px'
              }}
            >
              {/* Mouse Wheel Dot */}
              <div 
                style={{
                  width: '4px',
                  height: '8px',
                  borderRadius: '2px',
                  background: '#7C3AED',
                  animation: 'scrollWheel 1.6s ease-in-out infinite'
                }}
              />
            </div>
            <span className="font-mono-retro text-[9px] tracking-[0.2em] uppercase font-black" style={{ color: SUBTEXT }}>
              SCROLL TO EXPLORE
            </span>
          </div>
        </section>

        {/* SECTION 2: DIGITAL WALLETS */}
        <section
          id="section-wallets"
          className="narrative-section min-h-screen flex items-center justify-end px-6 sm:px-12 lg:pr-[8%] pt-20"
        >
          <div className="max-w-[650px] w-full text-left md:text-right md:-mt-24 -mt-10" style={{ color: TEXT }}>
            <h2 className="font-serif-luxury text-[clamp(32px,6vw,72px)] font-black leading-[1.1] tracking-[-0.03em] mb-8">
              Seamlessly<br />
              <span className="font-display-luxury italic font-medium text-[#7C3AED]">synchronized.</span>
            </h2>

            <p 
              className="max-w-[460px] md:ml-auto ml-0 font-sans-premium text-[clamp(13px,2vw,16px)] leading-relaxed font-medium mb-12"
              style={{ color: SUBTEXT }}
            >
              Aura connects instantly with your transaction flows, cards, and daily accounts. Keep your ledger automatically synchronized with hyper-sleek visuals and zero manual tracking overhead.
            </p>

            <div className="max-w-[480px] md:ml-auto ml-0">
              <RetroWindow title="RECENT_TRANSACTIONS.EXE" delay={0.3} isDarkMode={isDarkMode}>
                <div className="space-y-3.5 text-left font-sans-premium">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-black/10 dark:border-white/10">
                    <div>
                      <p className="font-black" style={{ color: TEXT }}>Starbucks Coffee</p>
                      <p className="font-mono-retro text-[9px]" style={{ color: SUBTEXT }}>Category: Food & Dining</p>
                    </div>
                    <span className="font-mono-retro font-black text-red-500">-$6.80</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-black/10 dark:border-white/10">
                    <div>
                      <p className="font-black" style={{ color: TEXT }}>Supabase Inc</p>
                      <p className="font-mono-retro text-[9px]" style={{ color: SUBTEXT }}>Category: Cloud Services</p>
                    </div>
                    <span className="font-mono-retro font-black text-red-500">-$25.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-black" style={{ color: TEXT }}>Google AdSense Income</p>
                      <p className="font-mono-retro text-[9px]" style={{ color: SUBTEXT }}>Category: Freelance</p>
                    </div>
                    <span className="font-mono-retro font-black text-green-600">+$1,450.00</span>
                  </div>
                </div>
              </RetroWindow>
            </div>
          </div>
        </section>

        {/* SECTION 3: AI INTELLIGENCE HUB */}
        <section
          id="section-ai"
          className="narrative-section min-h-screen flex items-center justify-start px-6 sm:px-12 lg:pl-[8%] pt-20"
        >
          <div className="max-w-[700px] w-full md:-mt-24 -mt-10" style={{ color: TEXT }}>
            <h2 className="font-serif-luxury text-[clamp(32px,6vw,72px)] font-black leading-[1.1] tracking-[-0.03em] mb-8">
              Next-Gen<br />
              <span className="font-display-luxury italic font-medium text-[#7C3AED]">Aura AI Hub.</span>
            </h2>

            <p 
              className="max-w-[480px] font-sans-premium text-[clamp(13px,2vw,16px)] leading-relaxed font-medium mb-12"
              style={{ color: SUBTEXT }}
            >
              Supercharge your expense intelligence. Scan receipt invoices in real-time, get instant ledger categorization, and consult Aura, your personal financial LLM co-pilot.
            </p>

            <div className="space-y-6 max-w-[500px]">
              <RetroWindow title="LLAMA_3.2_VISION_OCR.SYS" delay={0.4} isDarkMode={isDarkMode}>
                <div className="flex gap-4 items-start font-sans-premium">
                  <div className="p-3 bg-brand/10 text-brand border border-brand/20 rounded-xl">
                    <Camera className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-mono-retro text-[10px] font-black uppercase" style={{ color: TEXT }}>Receipt Capture & Scan</h4>
                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: SUBTEXT }}>
                      Snap a photo or import a receipt. The integrated vision system automatically reads currency, tax, dates, and matches it inside your transaction history.
                    </p>
                  </div>
                </div>
              </RetroWindow>

              <RetroWindow title="AURA_ADVISOR.SYS" delay={0.5} isDarkMode={isDarkMode}>
                <div className="flex gap-4 items-start font-sans-premium">
                  <div className="p-3 bg-green-500/10 text-emerald-500 border border-green-500/20 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-mono-retro text-[10px] font-black uppercase" style={{ color: TEXT }}>Deep Intelligence Co-Pilot</h4>
                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: SUBTEXT }}>
                      Aura parses your transaction lists to generate bespoke saving goals, identifies wasteful subscriptions, and advises you on dynamic asset allocation.
                    </p>
                  </div>
                </div>
              </RetroWindow>
            </div>

            <div className="mt-12">
              <button
                onClick={onScrollDown}
                style={{
                  border: `2.5px solid ${BORDER}`,
                  background: '#7C3AED',
                  color: '#ffffff',
                  boxShadow: isDarkMode ? '6px 6px 0px rgba(255,255,255,0.06)' : '6px 6px 0px #000000',
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  padding: '18px 40px',
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                className="hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_rgba(255,255,255,0.08)] active:translate-y-[0px]"
              >
                Enter Wealth Portal <ArrowRight className="inline-block w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </section>

        <div style={{ height: '60vh' }} />
      </div>

    </div>
  );
};

export default LandingPage;
