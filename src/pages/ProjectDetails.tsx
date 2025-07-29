import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Carousel from "../components_front/Carousel";
import type { CarouselItem } from "../components_front/Carousel";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ProjectDetails.css";

interface ProjectImage {
  id: number;
  image: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  github_link: string | null;
  live_preview_link: string | null;
  images: ProjectImage[];
}

interface ExtendedCarouselItem extends CarouselItem {
  github_link?: string;
  live_preview_link?: string;
  images: string[];
}

interface ProjectGalleryProps {
  onBack: () => void;
}

export default function ProjectGallery({ onBack }: ProjectGalleryProps) {
  const [carouselItems, setCarouselItems] = useState<ExtendedCarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    axios
      .get("https://portfolio-backend-2s7t.onrender.com/api/projects/")
      .then((res) => {
        const fetched: Project[] = res.data;
        const formattedItems: ExtendedCarouselItem[] = fetched.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          github_link: project.github_link ?? undefined,
          live_preview_link: project.live_preview_link ?? undefined,
          images: project.images.map((img) => img.image),
        }));
        setCarouselItems(formattedItems);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const handleImageClick = (index: number) => {
    setPreviewIndex(index);
    setShowPreview(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (deltaX > 50) {
      handlePrevImage();
    } else if (deltaX < -50) {
      handleNextImage();
    }

    touchStartX.current = null;
  };

  const handleNextImage = () => {
    setPreviewIndex(
      (prev) => (prev + 1) % carouselItems[currentIndex].images.length
    );
  };

  const handlePrevImage = () => {
    setPreviewIndex(
      (prev) =>
        (prev - 1 + carouselItems[currentIndex].images.length) %
        carouselItems[currentIndex].images.length
    );
  };

  const currentProject = carouselItems[currentIndex] || {};

  return (
    <div className="p-4 flex flex-col items-center text-white">
      <div className="w-full flex items-center justify-between mb-4 max-w-[1400px] gap-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition ml-auto"
        >
          ← Back
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.h3
          key={currentProject.title}
          className="project-gallery-title mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {currentProject.title}
        </motion.h3>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentProject.github_link}-${currentProject.live_preview_link}`}
          className="flex gap-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {currentProject.github_link && (
            <a
              href={currentProject.github_link}
              target="_blank"
              rel="noopener noreferrer"
                className="
    bg-gray-900 hover:bg-gray-700 text-white 
    px-4 py-2 rounded transition 
    max-[344px]:text-sm max-[344px]:px-2 max-[344px]:py-1
  "
            >
              🔗 GitHub
            </a>
          )}
          {currentProject.live_preview_link && (
            <a
              href={currentProject.live_preview_link}
              target="_blank"
              rel="noopener noreferrer"
               className="
    bg-green-700 hover:bg-green-600 text-white 
    px-4 py-2 rounded transition
    max-[344px]:text-sm max-[344px]:px-2 max-[344px]:py-1
  "
>

              🚀 Live Preview
            </a>
          )}
        </motion.div>
      </AnimatePresence>

      {carouselItems.length > 0 ? (
        <div className="flex flex-col items-center w-full" style={{ maxWidth: "1400px" }}>
          <Carousel
            items={carouselItems}
            autoplay
            autoplayDelay={8500}
            pauseOnHover
            onIndexChange={(i) => setCurrentIndex(i)}
            onImageClick={() => handleImageClick(0)}
          />
          <p className="text-sm text-gray-300 mt-1">
            {currentIndex + 1} of {carouselItems.length}
          </p>
        </div>
      ) : (
        <p>Loading projects…</p>
      )}

      <AnimatePresence mode="wait">
        <motion.p
          key={currentProject.description}
          className="project-description mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {currentProject.description}
        </motion.p>
      </AnimatePresence>

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
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-2 text-white text-4xl z-50 bg-black bg-opacity-50 rounded-full px-3 py-1"
            >
              ‹
            </button>

            <img
              src={carouselItems[currentIndex]?.images[previewIndex]}
              alt={`Preview ${previewIndex}`}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 text-white text-4xl z-50 bg-black bg-opacity-50 rounded-full px-3 py-1"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
