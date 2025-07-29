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

const ImageSequenceHover: React.FC<Props> = ({
  isVisible = true,
  onClick,
  autoPlayMobile = true,
  hoverSensitive = true,
  centerRadius = 150,
  framePath = '/frames/',
  frameCount = 25,
  speed = 0.4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const requestRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1);
  const currentFrame = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isAutoAnimating = useRef(false);

  const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${framePath}${String(i).padStart(4, '0')}.png`;
    }
  };

  const updateFrame = () => {
    const atEnd = directionRef.current === 1 && currentFrame.current >= frameCount - 1;
    const atStart = directionRef.current === -1 && currentFrame.current <= 0;

    if (!atEnd && !atStart) {
      currentFrame.current += speed * directionRef.current;
      currentFrame.current = Math.max(0, Math.min(frameCount - 1, currentFrame.current));
      const frameIndex = String(Math.floor(currentFrame.current) + 1).padStart(4, '0');
      if (imgRef.current) {
        imgRef.current.src = `${framePath}${frameIndex}.png`;
      }
      requestRef.current = requestAnimationFrame(updateFrame);
    } else {
      cancelAnimationFrame(requestRef.current);
      setIsPlaying(false);
      isAutoAnimating.current = false;
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          preloadImages();
        } else {
          setInView(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ Mobile autoplay every 3s
  useEffect(() => {
    if (!inView || !isVisible || !isMobile || !autoPlayMobile) return;
    const interval = setInterval(() => {
      if (!isPlaying) {
        directionRef.current *= -1;
        isAutoAnimating.current = true;
        setIsPlaying(true);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [inView, isVisible, isMobile, autoPlayMobile, isPlaying]);

  // ✅ Desktop hover: play forward/reverse
  useEffect(() => {
    if (!inView || !isVisible || isMobile || !hoverSensitive) return;
    if (!isPlaying) {
      directionRef.current = hovered ? 1 : -1;
      setIsPlaying(true);
    }
  }, [hovered, inView, isVisible, isMobile, hoverSensitive, isPlaying]);

  // ✅ Run frame animation
  useEffect(() => {
    if (!isPlaying) return;
    cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

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

export default ImageSequenceHover;
