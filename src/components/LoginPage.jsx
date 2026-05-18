// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { signInWithGoogle } from '../services/auth';

function LoginPage({ isDarkMode }) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setVisible(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try { await signInWithGoogle(); }
    catch (e) { console.error('Login failed:', e.message); }
    finally { setLoading(false); }
  };

  const theme = {
    bg: isDarkMode ? '#05070a' : '#f8fafc',
    text: isDarkMode ? '#ffffff' : '#0f172a',
    sub: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.5)',
    accent: '#6366f1',
    glass: isDarkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.7)',
    border: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
  };

  const slideIn = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(20px)',
    transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)'
  };

  // ── MOBILE LAYOUT ──
  if (isMobile) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'transparent', 
        color: theme.text, 
        display: 'flex', 
        flexDirection: 'column',
        fontFamily: '"Inter", sans-serif',
        overflowX: 'hidden',
        padding: '80px 24px 40px 24px',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Logo Section */}
        <div style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: theme.accent, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>AURORA</span>
        </div>

        {/* Content Box */}
        <div style={{ width: '100%', maxWidth: 360, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: theme.accent, marginBottom: 12 }}>
            Secure Authentication
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16 }}>
            Wealth <br/><span style={{ opacity: 0.3 }}>Management.</span>
          </h1>
          <p style={{ fontSize: 13, color: theme.sub, lineHeight: 1.5, marginBottom: 24 }}>
            Enter the portal to manage your digital assets with institutional-grade security and minimalist design.
          </p>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 150,
              height: 150,
              background: theme.accent,
              filter: 'blur(60px)',
              opacity: 0.3,
              borderRadius: '50%',
              zIndex: 0
            }} />
            
            <div style={{ 
              position: 'relative',
              zIndex: 1,
              background: isDarkMode ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)', 
              backdropFilter: 'blur(30px)', 
              WebkitBackdropFilter: 'blur(30px)',
              border: `1px solid ${theme.border}`, 
              borderRadius: 24, 
              padding: '32px 24px',
              boxShadow: '0 30px 60px -15px rgba(0,0,0,0.4)'
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>Welcome Back</h2>
              <p style={{ fontSize: 12, color: theme.sub, marginBottom: 24 }}>Sync your financial ledger in one click.</p>
  
              <button 
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  background: isDarkMode ? '#ffffff' : '#000000',
                  color: isDarkMode ? '#000000' : '#ffffff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}
              >
                {loading ? 'Initializing...' : (
                  <>
                    <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="G" style={{ width: 16, height: 16 }} />
                    Continue with Google
                  </>
                )}
              </button>
              
              <p style={{ fontSize: 9, textAlign: 'center', color: theme.sub, marginTop: 16, letterSpacing: '0.02em', fontWeight: 600, textTransform: 'uppercase' }}>
                Protected by AES-256 bank-level encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: theme.sub, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
          &copy; 2026 Aurora Financial Ecosystem. All rights reserved.
        </div>
      </div>
    );
  }

  // ── DESKTOP ORIGINAL LAYOUT (UNTOUCHED) ──
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'transparent', 
      color: theme.text, 
      display: 'flex', 
      fontFamily: '"Inter", sans-serif',
      overflow: 'hidden',
      width: '100%'
    }}>
      
      {/* Left Side: Minimalist Login Panel */}
      <div style={{ 
        flex: '0 0 45%', 
        padding: '60px 80px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        ...slideIn
      }}>
        {/* Logo Section */}
        <div style={{ position: 'absolute', top: 60, left: 80, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: theme.accent, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>AURORA</span>
        </div>

        <div style={{ maxWidth: 400 }}>
          <p style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: theme.accent, marginBottom: 24 }}>
            Secure Authentication
          </p>
          <h1 style={{ fontSize: 64, fontWeight: 950, letterSpacing: '-0.05em', lineHeight: 1.1, marginBottom: 32 }}>
            Wealth <br/><span style={{ opacity: 0.3 }}>Management.</span>
          </h1>
          <p style={{ fontSize: 16, color: theme.sub, lineHeight: 1.6, marginBottom: 48 }}>
            Enter the portal to manage your digital assets with institutional-grade security and minimalist design.
          </p>

          <div style={{ position: 'relative', marginTop: 40 }}>
            {/* Ambient Glow behind the glass */}
            <div style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 200,
              height: 200,
              background: theme.accent,
              filter: 'blur(80px)',
              opacity: 0.4,
              borderRadius: '50%',
              zIndex: 0
            }} />
            
            <div style={{ 
              position: 'relative',
              zIndex: 1,
              background: isDarkMode ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)', 
              backdropFilter: 'blur(40px)', 
              WebkitBackdropFilter: 'blur(40px)',
              border: `1px solid ${theme.border}`, 
              borderTop: `1px solid rgba(255,255,255,0.2)`,
              borderLeft: `1px solid rgba(255,255,255,0.2)`,
              borderRadius: 32, 
              padding: '48px 40px',
              boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Welcome Back</h2>
              <p style={{ fontSize: 14, color: theme.sub, marginBottom: 40 }}>Sync your financial ledger in one click.</p>
  
              <button 
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  background: isDarkMode ? '#ffffff' : '#000000',
                  color: isDarkMode ? '#000000' : '#ffffff',
                  border: 'none',
                  padding: '18px',
                  borderRadius: 16,
                  fontSize: 14,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  boxShadow: isDarkMode ? '0 10px 30px -10px rgba(255,255,255,0.3)' : '0 10px 30px -10px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
              >
                {loading ? 'Initializing...' : (
                  <>
                    <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="G" style={{ width: 20, height: 20 }} />
                    Continue with Google
                  </>
                )}
              </button>
              
              <p style={{ fontSize: 11, textAlign: 'center', color: theme.sub, marginTop: 24, letterSpacing: '0.02em' }}>
                Protected by AES-256 bank-level encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 60, left: 80, fontSize: 12, color: theme.sub }}>
          &copy; 2026 Aurora Financial Ecosystem. All rights reserved.
        </div>
      </div>

      {/* Right Side: Transparent so LandingPage Canvas shows through */}
      <div style={{ flex: 1, position: 'relative', background: 'transparent' }}>
        
        <div style={{ width: '100%', height: '100%' }}>
           {/* Canvas removed: We now rely purely on the LandingPage Canvas underneath for a perfectly seamless transition! */}
        </div>

        {/* Overlaid Detail Text (Optional / Subtle) */}
        <div style={{ position: 'absolute', bottom: 60, right: 80, textAlign: 'right' }}>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', opacity: 0.3 }}>
            Powered by Next-Gen 3D Engine
          </p>
        </div>
      </div>

    </div>
  );
}

export default LoginPage;
