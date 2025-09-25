import { motion } from "framer-motion";
import { FaPlusCircle, FaUsers } from "react-icons/fa";

export const Hero = () => (
  <section id="hero">
    <div className="hero-content">
      <h1>Welcome to SnappQuest</h1>
      <p>The Engage-to-Earn Tool for Solana Community</p>
      <div className="journey-text">No Bots. Real Engagement.</div>
      <div className="action-icons">
        <a href="#create-quest" className="action-icon">
          <FaPlusCircle />
          <span>Create Quest</span>
        </a>
        <a
          href="https://t.me/SnappQuest/134"
          className="action-icon"
          target="_blank"
        >
          <FaUsers />
          <span>Join Quest</span>
        </a>
      </div>
    </div>
  </section>
);
