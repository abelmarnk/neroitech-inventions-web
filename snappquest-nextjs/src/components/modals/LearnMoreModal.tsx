"use client";
import { BaseModal } from "./BaseModal";
import { motion } from "framer-motion";
import { FaLightbulb, FaUsersCog, FaTasks } from "react-icons/fa";
import { ReactNode } from "react";

interface LearnMoreModalProps {
  open: boolean;
  onClose: () => void;
}

interface BulletProps {
  icon: ReactNode;
  title: string;
  text: string;
}
const Bullet: React.FC<BulletProps> = ({ icon, title, text }) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="flex gap-4 items-start"
  >
    <div className="text-indigo-600 text-xl mt-1">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
    </div>
  </motion.li>
);

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <BaseModal open={open} onClose={onClose} title="What is SnappQuest?">
      <div className="space-y-8">
        <p className="text-gray-700 text-base leading-relaxed">
          SnappQuest is a lightweight quest management and community engagement
          concept. It lets creators define goal‑oriented quests with structured
          tasks, reward logic, and social proof components. This prototype
          showcases a Next.js + Framer Motion modernization of a prior static
          site.
        </p>
        <ul className="space-y-6">
          <Bullet
            icon={<FaLightbulb />}
            title="Create Engaging Quests"
            text="Design multi-step experiences—each task can represent a learning, social, or on‑chain interaction milestone."
          />
          <Bullet
            icon={<FaUsersCog />}
            title="Grow Community"
            text="Encourage participation through transparent progress tracking and rewarding early adopters or power users."
          />
          <Bullet
            icon={<FaTasks />}
            title="Track & Iterate"
            text="Analyze which tasks drive the most engagement and refine quests for better retention."
          />
        </ul>
        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
          <h5 className="font-semibold text-indigo-800 mb-2">Why a Rebuild?</h5>
          <p className="text-indigo-700 text-sm leading-relaxed">
            Migrating from a static HTML bundle to a componentized Next.js
            architecture enables scalability, dynamic wallet integration,
            animation, and better developer ergonomics.
          </p>
        </div>
      </div>
    </BaseModal>
  );
};
