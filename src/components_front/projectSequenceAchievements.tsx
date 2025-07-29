// src/components_front/ImageSequence.tsx
import React, { useRef, useEffect, useState } from 'react';
import '../styles/ProjectSequence.css';

interface Props {
  isVisible?: boolean;
  onClick?: () => void;
  autoPlayMobile?: boolean;
  hoverSensitive?: boolean;
  centerRadius?: number;
  framePath?: string;
  frameCount?: number;
  speed?: number;
}

const ImageSequenceHoverAchievements: React.FC<Props> = ({
  isVisible = true,
  onClick,
  autoPlayMobile = true,
  hoverSensitive = true,
  centerRadius = 150,
  framePath = '/framesAchievements/',
  frameCount = 25,
  speed = 0.4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const requestRef = useRef<number | null>(null);
  const directionRef = useRef<1 | -1>(1); // Ensure it's restricted to 1 or -1
  const currentFrame = useRef(0);
  
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${framePath}${String(i).padStart(4, '0')}.png`;
    }
  };

  const renderFrame = () => {
    const frameIndex = String(Math.floor(currentFrame.current) + 1).padStart(4, '0');
    if (imgRef.current) {
      imgRef.current.src = `${framePath}${frameIndex}.png`;
    }
  };

  const animate = () => {
    currentFrame.current += speed * directionRef.current;

    if (currentFrame.current >= frameCount - 1) {
      currentFrame.current = frameCount - 1;
      cancelAnimationFrame(requestRef.current!);
      requestRef.current = null;
      return;
    }

    if (currentFrame.current <= 0) {
      currentFrame.current = 0;
      cancelAnimationFrame(requestRef.current!);
      requestRef.current = null;
      return;
    }

    renderFrame();
    requestRef.current = requestAnimationFrame(animate);
  };

  const startAnimation = (dir: 1 | -1) => {
    directionRef.current = dir; // Now assigning only 1 or -1
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animate);
  };

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Intersection Observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) preloadImages();
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Mobile autoplay logic (ping-pong)
  useEffect(() => {
    if (!inView || !isVisible || !isMobile || !autoPlayMobile) return;

    const interval = setInterval(() => {
      directionRef.current = directionRef.current === 1 ? -1 : 1; // Toggle between 1 and -1
      startAnimation(directionRef.current);
    }, 3000);

    return () => clearInterval(interval);
  }, [inView, isVisible, isMobile, autoPlayMobile]);

  // Desktop hover logic
  useEffect(() => {
    if (!inView || !isVisible || isMobile || !hoverSensitive) return;
    if (hovered) startAnimation(1);
    else startAnimation(-1);
  }, [hovered, inView, isVisible, isMobile, hoverSensitive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverSensitive || isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    setHovered(distance < centerRadius);
  };

  return (
    <div
      ref={containerRef}
      className="image-sequence-wrapper"
      onClick={onClick}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(false)}
        className={`fade-wrapper ${isVisible ? 'fade-in' : 'fade-out'}`}
        style={{ width: '100%', height: '100%' }}
      >
        <img
          ref={imgRef}
          src={`${framePath}0001.png`}
          alt="Animation"
          className="image-sequence-img"
        />
      </div>
    </div>
  );
};

export default ImageSequenceHoverAchievements;
