import { FaTasks } from 'react-icons/fa';
import { FaTwitter, FaTelegram } from 'react-icons/fa';

interface FooterProps {
  onLearnMoreClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLearnMoreClick }) => (
  <footer>
    <div className="footer-container">
      <div className="footer-row">
        <div className="footer-col footer-info">
          <h2>SnappQuest</h2>
          <p>The Engage-to-Earn layer for Solana, where every action matters. Whether it's liking, retweeting, commenting, or gaining followers, each interaction adds value and rewards the community.</p>
        </div>

        <div className="footer-col">
          <h2>Quick Links</h2>
          <ul className="footer-link">
            <li><a href="#hero">Home</a></li>
            <li><a href="#create-quest">Create Quest</a></li>
            <li><a href="https://t.me/SnappQuest/134" target="_blank">Join Quest</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onLearnMoreClick?.(); }}>How It Works</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>Other Tools</h2>
          <ul className="footer-link">
            <li><a href="https://t.me/EarnlyQuestBot" target="_blank"><FaTasks />Earnly Bot</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>Custom Quest</h2>
          <p>Reach out on Telegram for partnerships or customized quests.
              Create your own custom quest by contacting the team!</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright-text">
          <p>&copy; 2025 SnappQuest. All rights reserved.</p>
        </div>
        <div className="social-icons">
          <ul>
            <li><a href="https://x.com/SnappQuest" target="_blank"><FaTwitter /> X (Twitter)</a></li>
            <li><a href="https://t.me/SnappQuest" target="_blank"><FaTelegram /> Telegram</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);
