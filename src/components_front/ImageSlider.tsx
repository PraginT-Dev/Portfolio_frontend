import { useEffect, useState, useRef } from "react";
import "../styles/ImageSlider.css";

interface Props {
  images: string[];
  isActive: boolean;
  onClick?: (img: string) => void;
}

const ArrowSVG = ({ direction = "right" }: { direction?: "left" | "right" }) => (
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
    style={{ transform: direction === "left" ? "rotate(180deg)" : undefined }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke="black"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ImageSlider({ images, isActive, onClick }: Props) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHovered, setIsHovered] = useState(false);
  const firstRender = useRef(true);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIndex(0);
    setPrevIndex(0);
  }, [images]);

  useEffect(() => {
    if (!isActive) {
      setIndex(0);
      setPrevIndex(0);
      clearInterval(autoplayRef.current!);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive && !isHovered && images.length > 1) {
      autoplayRef.current = setInterval(() => {
        slideTo((index + 1) % images.length, 1);
      }, 3000); //valus
    }

    return () => clearInterval(autoplayRef.current!);
  }, [isActive, isHovered, index, images]);

  const slideTo = (toIdx: number, dir: 1 | -1) => {
    setPrevIndex(index);
    setIndex(toIdx);
    setDirection(dir);
    firstRender.current = false;
  };

  const goPrev = () => slideTo((index - 1 + images.length) % images.length, -1);
  const goNext = () => slideTo((index + 1) % images.length, 1);

  return (
    <div
      className="imageslider-root"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="imageslider-frame">
        {images.map((img, i) => {
          const isCurrent = i === index;
          const wasPrev = i === prevIndex;

          let className = "imageslider-img";
          if (isCurrent) {
            className += " shown";
            if (!firstRender.current) {
              className += direction === 1 ? " slidein-right" : " slidein-left";
            }
          } else if (wasPrev && !firstRender.current) {
            className += direction === 1 ? " slideout-left" : " slideout-right";
          }

          return (
            <img
              key={img}
              src={img}
              alt={`Slide ${i}`}
              className={className}
              draggable={false}
              style={{ zIndex: isCurrent ? 2 : 1 }}
              onClick={() => {
                if (isActive && onClick) onClick(images[index]);
              }}
            />
          );
        })}
        {isActive && images.length > 1 && (
          <>
            <button className="imageslider-arrow left"
              onClick={e => { e.stopPropagation(); goPrev(); }}
              tabIndex={-1} aria-label="Previous">
              <ArrowSVG direction="left" />
            </button>
            <button className="imageslider-arrow right"
              onClick={e => { e.stopPropagation(); goNext(); }}
              tabIndex={-1} aria-label="Next">
              <ArrowSVG direction="right" />
            </button>
          </>
        )}
      </div>
      {isActive && images.length > 1 && (
        <div className="imageslider-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`imageslider-dot${i === index ? " active" : ""}`}
              onClick={e => {
                e.stopPropagation();
                slideTo(i, i > index ? 1 : -1);
              }}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
