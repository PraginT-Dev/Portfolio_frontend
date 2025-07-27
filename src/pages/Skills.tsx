import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/Skills.css";

interface Skill {
  name: string;
  image: string;
}

interface Segment {
  name: string;
  description: string;
  skills: Skill[];
}

interface SkillsProps {
  onBack?: () => void;
}

export default function Skills({ onBack }: SkillsProps) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://portfolio-backend-1-ykyp.onrender.com/api/skills/")
      .then((res) => {
        setSegments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching skills:", err);
        setLoading(false);
      });
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="skills"
        className="p-4 flex flex-col items-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Header Row */}
        <div className="w-full flex items-center justify-between mb-4 max-w-[1400px] gap-4">
          <h2 className="text-2xl font-bold">Skills</h2>

          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading skills…</p>
        ) : (
          <div className="skills-container">
            {segments.map((segment, idx) => (
              <div key={idx} className="segment-block">
                <h4 className="text-xl font-semibold mb-2 text-center">
                  {segment.name}
                </h4>
                <div className="skills-grid">
                  {segment.skills.map((skill, i) => (
                    <div className="skill-item" key={i}>
                      <div className="skill-tooltip-wrapper">
                        <div className="skill-icon">
                          <img src={skill.image} alt={skill.name} />
                        </div>
                        <div className="tooltip">{skill.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
