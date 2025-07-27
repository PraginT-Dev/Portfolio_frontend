import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "framer-motion";
import "../styles/TripleAutoScroll.css";

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const update = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  return width;
}

interface AutoScrollTextProps {
  text: string;
  velocity?: number;
  direction?: "left" | "right";
  numCopies?: number;
}

const AutoScrollText: React.FC<AutoScrollTextProps> = ({
  text,
  velocity = 20,
  direction = "left",
  numCopies = 4,
}) => {
  const baseX = useMotionValue(0);
  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);
  const dirFactor = direction === "left" ? -1 : 1;

  const wrap = (min: number, max: number, v: number) => {
    const range = max - min;
    return (((v - min) % range) + range) % range + min;
  };

  const x = useTransform(baseX, (v) =>
    copyWidth ? `${wrap(-copyWidth, 0, v)}px` : "0px"
  );

  useAnimationFrame((_, delta) => {
    const moveBy = dirFactor * velocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  const spans = Array.from({ length: numCopies }).map((_, i) => (
    <span
      key={i}
      ref={i === 0 ? copyRef : null}
      className="auto-scroll-span"
    >
      {text}
    </span>
  ));

  return (
    <div className="auto-scroll-text-wrapper">
      <motion.div className="auto-scroll-motion" style={{ x }}>
        {spans}
      </motion.div>
    </div>
  );
};

const TripleAutoScroll: React.FC = () => {
  return (
    <div className="scroll-container">
      <AutoScrollText text="3d Designer" direction="left" velocity={20} numCopies={6} />
      <AutoScrollText text="Full stack Dev" direction="right" velocity={20} numCopies={6} />
      <AutoScrollText text="Ethical Hacker" direction="left" velocity={20} numCopies={6} />
    </div>
  );
};

export default TripleAutoScroll;
