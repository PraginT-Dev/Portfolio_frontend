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

const ImageSequenceHoverSkills: React.FC<Props> = ({
  isVisible = true,
  onClick,
  autoPlayMobile = true,
  hoverSensitive = true,
  centerRadius = 150,
  framePath = '/framesSkills/',
  frameCount = 25,
  speed = 0.4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const requestRef = useRef<number | null>(null);
  const directionRef = useRef<1 | -1>(1); // Ensuring that directionRef can only be 1 or -1
  const currentFrame = useRef(0);

  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Track if animation is running

  // Preload images for the animation sequence
  const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${framePath}${String(i).padStart(4, '0')}.png`;
    }
  };

  // Render the current frame for the animation
  const renderFrame = () => {
    const frameIndex = String(Math.floor(currentFrame.current) + 1).padStart(4, '0');
    if (imgRef.current) {
      imgRef.current.src = `${framePath}${frameIndex}.png`;
    }
  };

  // Main animation logic
  const animate = () => {
    currentFrame.current += speed * directionRef.current;

    if (currentFrame.current >= frameCount - 1) {
      currentFrame.current = frameCount - 1;
      cancelAnimationFrame(requestRef.current!);
      requestRef.current = null;
      setIsAnimating(false); // Animation ended
      return;
    }

    if (currentFrame.current <= 0) {
      currentFrame.current = 0;
      cancelAnimationFrame(requestRef.current!);
      requestRef.current = null;
      setIsAnimating(false); // Animation ended
      return;
    }

    renderFrame();
    requestRef.current = requestAnimationFrame(animate);
  };

  // Start animation in the given direction (1 or -1)
  const startAnimation = (dir: 1 | -1) => {
    if (isAnimating) return; // Prevent multiple animations running
    setIsAnimating(true);
    directionRef.current = dir;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animate);
  };

  // Detect mobile devices (screen width <= 768px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Intersection Observer to track when the element comes into view
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) preloadImages(); // Preload images when in view
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Mobile autoplay logic (ping-pong effect, toggles between forward and backward every 3 seconds)
  useEffect(() => {
    if (!inView || !isVisible || !isMobile || !autoPlayMobile) return;

    const interval = setInterval(() => {
      if (!isAnimating) { // Only toggle when not already animating
        directionRef.current = directionRef.current === 1 ? -1 : 1; // Toggle between 1 and -1
        startAnimation(directionRef.current);
      }
    }, 3000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [inView, isVisible, isMobile, autoPlayMobile, isAnimating]);

  // Desktop hover effect logic
  useEffect(() => {
    if (!inView || !isVisible || isMobile || !hoverSensitive) return;
    if (hovered) startAnimation(1);
    else startAnimation(-1);
  }, [hovered, inView, isVisible, isMobile, hoverSensitive]);

  // Mouse move logic for hover-sensitive animation on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverSensitive || isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    setHovered(distance < centerRadius); // Trigger animation if within the hover-sensitive area
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

export default ImageSequenceHoverSkills;
