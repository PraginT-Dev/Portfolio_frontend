// components_front/AnimatedContentControlled.tsx

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface AnimatedContentControlledProps {
  children: React.ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  trigger: 'enter' | 'exit'; // control animation manually
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  delay?: number;
  onComplete?: () => void;
}

const AnimatedContentControlled: React.FC<AnimatedContentControlledProps> = ({
  children,
  distance = 100,
  direction = 'horizontal',
  trigger = 'enter',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0.2,
  animateOpacity = true,
  scale = 1.1,
  delay = 0,
  onComplete,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === 'horizontal' ? 'x' : 'y';
    const offset = reverse ? -distance : distance;

    if (trigger === 'enter') {
      gsap.fromTo(
        el,
        {
          [axis]: offset,
          scale,
          opacity: animateOpacity ? initialOpacity : 1,
        },
        {
          [axis]: 0,
          scale: 1,
          opacity: 1,
          duration,
          ease,
          delay,
          onComplete,
        }
      );
    } else {
      // exit animation
      gsap.to(el, {
        [axis]: offset,
        scale,
        opacity: 0,
        duration,
        ease,
        delay,
        onComplete,
      });
    }

    return () => {
      gsap.killTweensOf(el);
    };
  }, [trigger, distance, direction, reverse, duration, ease, animateOpacity, scale, delay, onComplete]);

  return <div ref={ref}>{children}</div>;
};

export default AnimatedContentControlled;
