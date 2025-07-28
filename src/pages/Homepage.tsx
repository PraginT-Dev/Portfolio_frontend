import React, { useEffect, useState } from 'react';
import '../styles/Homepage.css';
import '../styles/TopRightName3D.css';
import TripleAutoScroll from '../components_front/ScrollVelocity';
import ImageSequenceHover from '../components_front/projectSequenceProject';
import ImageSequenceHoverSkills from '../components_front/projectSequenceSkills';
import ImageSequenceHoverAchievements from '../components_front/projectSequenceAchievements';
import ImageSequenceHoverConnect from '../components_front/projectSequenceConnect';

type HomepageProps = {
  onEnterProjects: () => void;
  onEnterSkills: () => void;
  onEnterAchievements: () => void;
  onEnterConnect: () => void;
};

const Homepage: React.FC<HomepageProps> = ({
  onEnterProjects,
  onEnterSkills,
  onEnterAchievements,
  onEnterConnect,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set --vh to handle mobile viewport height properly
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const handleClick = (callback?: () => void) => {
    setIsVisible(false);
    setTimeout(() => {
      callback?.();
    }, 400); // match fade-out transition
  };

  return (
    <div className="homepage-container">
      <div className="name-stack">
        <div className="hi-top">Hi</div>
        <div className="name-3d">T.Pragin</div>
        <div className="role-below">
          <a
            href="https://www.linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/linkedin.svg" alt="LinkedIn" />
          </a>
          <a
            href="https://github.com/your-github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/github.svg" alt="GitHub" />
          </a>
          <span>3D Web Dev</span>
             <a
            href="https://github.com/your-github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/github.svg" alt="GitHub" />
          </a>
        </div>
      </div>

      <img src="/face_low.png" alt="Face Overlay" className="face-overlay" />

      <div
        className={`sequence-below-face ${isVisible ? 'fade-in' : 'fade-out'}`}
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      >
        <div className="sequence-skill-row">
          <div
            className="image-sequence-skill-block"
            onClick={() => handleClick(onEnterProjects)}
          >
            <ImageSequenceHover isVisible={isVisible} />
          </div>
          <div
            className="image-sequence-skill-block"
            onClick={() => handleClick(onEnterSkills)}
          >
            <ImageSequenceHoverSkills isVisible={isVisible} />
          </div>
          <div
            className="image-sequence-skill-block"
            onClick={() => handleClick(onEnterAchievements)}
          >
            <ImageSequenceHoverAchievements isVisible={isVisible} />
          </div>
          <div
            className="image-sequence-skill-block"
            onClick={() => handleClick(onEnterConnect)}
          >
            <ImageSequenceHoverConnect isVisible={isVisible} />
          </div>
        </div>
      </div>

      <TripleAutoScroll />
    </div>
  );
};

export default Homepage;
