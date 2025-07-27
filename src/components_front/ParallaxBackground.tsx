import React, { useEffect, useRef, useState } from 'react';
import '../styles/ParallaxBackground.css';

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const ParallaxBackground: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(isMobile);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    const { beta, gamma } = event;

    if (bgRef.current && beta != null && gamma != null) {
      const baseBeta = 30; // 👈 represents natural holding position
      const adjustedBeta = beta - baseBeta;

      const tx = Math.max(-1, Math.min(1, gamma / 15)) * 50;
      const ty = Math.max(-1, Math.min(1, adjustedBeta / 20)) * 50;

      bgRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(1.2)`;
    }
  };

  const enableParallax = () => {
    window.addEventListener('deviceorientation', handleOrientation, true);
  };

  const handleAllowClick = async () => {
    const DeviceOrientationEventAny = DeviceOrientationEvent as any;

    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEventAny.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEventAny.requestPermission();
        if (response === 'granted') {
          enableParallax();
        } else {
          alert('Motion permission denied.');
        }
      } catch (err) {
        console.error('Permission request error:', err);
      }
    } else {
      // Android or desktop
      enableParallax();
    }

    setShowPopup(false);
  };

  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 50;
        const y = (e.clientY / window.innerHeight - 0.5) * 50;
        if (bgRef.current) {
          bgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
        }
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <>
      {showPopup && (
        <div className="permission-popup">
          <div className="popup-content">
            <p>Allow motion access for parallax effect?</p>
            <button onClick={handleAllowClick} className="btn yes">Yes</button>
            <button onClick={() => setShowPopup(false)} className="btn no">No</button>
          </div>
        </div>
      )}
      <div ref={bgRef} className="parallax-bg" />
    </>
  );
};

export default ParallaxBackground;
