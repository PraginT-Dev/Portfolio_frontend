// Carousel.tsx
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ImageSlider from "./ImageSlider";
import "../styles/Carousel_cert.css";

export interface CarouselItem {
  id: number;
  title: string;
  description: string;
  images: string[];
  github_link?: string;
  live_preview_link?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  onIndexChange?: (index: number) => void;
  onImageClick?: () => void;
}

const Carousel = ({
  items,
  autoplay = true,
  autoplayDelay = 8000,
  pauseOnHover = true,
  onIndexChange,
  onImageClick,
}: CarouselProps) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const prevIndex = (index - 1 + items.length) % items.length;
  const nextIndex = (index + 1) % items.length;

  const changeIndex = (newIndex: number) => {
    setIndex(newIndex);
  };

  useEffect(() => {
    if (onIndexChange) onIndexChange(index);
  }, [index, onIndexChange]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % items.length);
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, pauseOnHover, isHovered, items.length]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);
    node.addEventListener("mouseenter", handleEnter);
    node.addEventListener("mouseleave", handleLeave);
    return () => {
      node.removeEventListener("mouseenter", handleEnter);
      node.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) < 35) return;

    if (deltaX > 0) {
      changeIndex(prevIndex); // Swipe right
    } else {
      changeIndex(nextIndex); // Swipe left
    }

    touchStartX.current = null;
  };

  return (
    <div
      ref={ref}
      className="carousel-outer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel-main-track">
        {[prevIndex, index, nextIndex].map((i, ord) => {
          const item = items[i];
          const isActive = i === index;
          let overlayTitleClass = "carousel3-overlay-title";
          if (!isActive) {
            overlayTitleClass +=
              ord === 0
                ? " left-inactive-title"
                : ord === 2
                ? " right-inactive-title"
                : "";
          }

          return (
            <motion.div
              key={item.id}
              className={`carousel-card3 ${isActive ? "active" : "inactive"} ${
                ord === 0 ? "left" : ord === 2 ? "right" : ""
              }`}
              initial={false}
              animate={{ x: 0, opacity: 1, scale: isActive ? 1 : 0.84 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={() => {
                if (!isActive) setIndex(i);
                if (isActive && onImageClick) onImageClick();
              }}
              tabIndex={0}
            >
              <div className="carousel3-image-wrapper">
                <ImageSlider
                  images={item.images}
                  isActive={isActive}
                  onClick={onImageClick}
                />
                {!isActive && (
                  <div className={overlayTitleClass}>{item.title}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
