import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "../components_front/Carousel_cert";
import type { CarouselItem } from "../components_front/Carousel_cert";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import "../styles/ProjectDetails.css";

interface Certificate {
  id: number;
  title: string;
  description: string;
  image: string;
  verify_link?: string;
  segment: string;
  skills: { name: string; image: string }[];
}

interface CarouselItemExtended extends CarouselItem {
  verify_link?: string;
  segment?: string;
  skills?: { name: string; image: string }[];
}

interface AchievementsProps {
  onBack: () => void;
}

export default function Achievements({ onBack }: AchievementsProps) {
  const [carouselItems, setCarouselItems] = useState<CarouselItemExtended[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    axios
      .get("https://portfolio-backend-2s7t.onrender.com/api/certificates/")
      .then((res) => {
        const fetched: Certificate[] = res.data;
        const formatted: CarouselItemExtended[] = fetched.map((cert) => ({
          id: cert.id,
          title: cert.title,
          description: cert.description,
          images: [cert.image],
          verify_link: cert.verify_link,
          segment: cert.segment,
          skills: cert.skills,
        }));
        setCarouselItems(formatted);
      })
      .catch((err) => console.error("Error fetching achievements:", err));
  }, []);

  const current = carouselItems[currentIndex] || {};

  return (
    <div className="p-4 flex flex-col items-center text-white">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 max-w-[1400px] gap-4">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition ml-auto"
        >
          ← Back
        </button>
      </div>

      {/* Title */}
      <AnimatePresence mode="wait">
        <motion.h3
          key={current.title}
          className="project-gallery-title mb-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {current.title}
        </motion.h3>
      </AnimatePresence>

      {/* Verify Button */}
<AnimatePresence mode="wait">
  <motion.div
    key={current.verify_link}
    className="flex gap-4 mb-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4 }}
  >
    {current.verify_link && (
      <a
        href={current.verify_link}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded transition text-sm sm:text-base sm:px-5 sm:py-2.5"
      >
        🔗 Verify
      </a>
    )}
  </motion.div>
</AnimatePresence>


      {/* Carousel */}
      {carouselItems.length > 0 ? (
        <div className="flex flex-col items-center w-full max-w-[1000px]">
          <Carousel
            items={carouselItems}
            autoplay
            autoplayDelay={8000}
            pauseOnHover
            onIndexChange={setCurrentIndex}
            onImageClick={() => setShowPreview(true)}
          />
          <p className="text-sm text-gray-300 mt-1">
            {currentIndex + 1} of {carouselItems.length}
          </p>
        </div>
      ) : (
        <p>Loading achievements…</p>
      )}

      {/* Skills */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.skills?.map((s) => s.name).join(",")}
          className="mt-0 flex flex-wrap gap-0 justify-center max-w-full px-1 sm:gap-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {current.skills?.map((skill, idx) => (
  <Tilt
  key={idx}
  tiltMaxAngleX={10}
  tiltMaxAngleY={10}
  className="w-12 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 lg:w-18 lg:h-14 flex items-center justify-center p-1"
>
<img
  src={skill.image}
  alt={skill.name}
  title={skill.name}
  style={{
    maxWidth: '50%',
    height: 'auto',
  }}
/>

</Tilt>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Description (AFTER skills) */}
      <AnimatePresence mode="wait">
        <motion.p
          key={current.description}
          className="project-description"

          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {current.description}
        </motion.p>
      </AnimatePresence>

      {/* Fullscreen Preview */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center"
          onClick={() => setShowPreview(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPreview(false);
            }}
            className="absolute top-4 right-4 text-white text-2xl z-50 bg-black bg-opacity-60 px-3 py-1 rounded-full"
          >
            ✕
          </button>

          <div
            className="relative flex items-center justify-center w-full px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={carouselItems[currentIndex]?.images?.[0]}
              alt={`Preview`}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
