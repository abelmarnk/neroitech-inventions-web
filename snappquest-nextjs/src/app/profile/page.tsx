"use client";
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackToTopButton } from '@/components/BackToTopButton';
import { FaTwitter, FaTelegram, FaHeart, FaComment, FaTasks, FaDownload, FaWallet, FaIdCard, FaEnvelope, FaUserFriends, FaCalendarCheck, FaRetweet, FaShare, FaLaptopCode, FaCommentDots, FaMicrophone, FaQuestionCircle } from 'react-icons/fa';

// Mock data matching vanilla profile
interface Task {
  description: string;
  status: 'pending' | 'completed';
  icon: React.ReactNode;
  link?: string;
}

interface Quest {
  id: number;
  title: string;
  sponsor: string;
  tasks: Task[];
  reward: string;
  completed: boolean;
}

const mockQuests: Quest[] = [
  {
    id: 1,
    title: "Promote Solana DeFi Project",
    sponsor: "SolanaDeFi Inc.",
    tasks: [
      { description: "Follow @SolanaDeFi on X", status: "completed", icon: <FaTwitter />, link: "https://x.com/SolanaDeFi" },
      { description: "Like and retweet the latest announcement", status: "completed", icon: <FaHeart />, link: "https://x.com/SolanaDeFi/status/123456" },
      { description: "Comment with your thoughts on DeFi", status: "completed", icon: <FaComment />, link: "https://x.com/SolanaDeFi/status/123456" }
    ],
    reward: "₦500",
    completed: true
  },
  {
    id: 2,
    title: "Join NFT Community Engagement",
    sponsor: "NFTCollective",
    tasks: [
      { description: "Join the Telegram group", status: "completed", icon: <FaTelegram />, link: "https://t.me/NFTCollective" },
      { description: "Mint a free NFT", status: "completed", icon: <FaTasks />, link: "https://nftcollective.io/mint" },
      { description: "Share your minted NFT on X", status: "completed", icon: <FaTwitter />, link: "https://x.com/NFTCollective" }
    ],
    reward: "₦300",
    completed: true
  },
  {
    id: 3,
    title: "Test New Wallet Feature",
    sponsor: "Phantom Wallet",
    tasks: [
      { description: "Download Phantom Wallet", status: "pending", icon: <FaDownload />, link: "https://phantom.app" },
      { description: "Create a new wallet", status: "pending", icon: <FaWallet />, link: "https://phantom.app" },
      { description: "Complete KYC verification", status: "pending", icon: <FaIdCard />, link: "https://phantom.app/kyc" }
    ],
    reward: "₦750",
    completed: false
  },
  // ... add more quests to match vanilla data
];

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [availableCurrentPage, setAvailableCurrentPage] = useState(1);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(1);
  const questsPerPage = 4;

  // Mock user data
  const userData = {
    name: publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : "User",
    wallet: publicKey?.toBase58() || "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    totalQuests: mockQuests.length,
    completedQuests: mockQuests.filter(q => q.completed).length,
    totalEarnings: 2150
  };

  const availableQuests = useMemo(() => mockQuests.filter(q => !q.completed), []);
  const completedQuests = useMemo(() => mockQuests.filter(q => q.completed), []);

  const paginatedAvailable = useMemo(() => {
    const start = (availableCurrentPage - 1) * questsPerPage;
    return availableQuests.slice(start, start + questsPerPage);
  }, [availableQuests, availableCurrentPage]);

  const paginatedCompleted = useMemo(() => {
    const start = (completedCurrentPage - 1) * questsPerPage;
    return completedQuests.slice(start, start + questsPerPage);
  }, [completedQuests, completedCurrentPage]);

  const completeQuest = useCallback((questId: number) => {
    const quest = mockQuests.find(q => q.id === questId);
    if (quest) {
      setCompletionMessage(`Congratulations! You have completed "${quest.title}" and earned ${quest.reward}.`);
      setCompletionModalOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar variant="profile" />
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{userData.name.charAt(0)}</div>
          <div className="profile-name">{userData.name}</div>
          <div className="profile-wallet">{userData.wallet.substring(0, 8)}...{userData.wallet.slice(-8)}</div>
          <div className="profile-stats">
            <div className="stat">
              <div className="stat-number">{userData.totalQuests}</div>
              <div className="stat-label">Total Quests</div>
            </div>
            <div className="stat">
              <div className="stat-number">{userData.completedQuests}</div>
              <div className="stat-label">Completed Quests</div>
            </div>
            <div className="stat">
              <div className="stat-number">{userData.totalEarnings}</div>
              <div className="stat-label">Earnings (NGN)</div>
            </div>
          </div>
        </div>

        <div className="quests-section" id="available-quests">
          <h2 className="section-title">Available Quests</h2>
          <div className="quests-grid">
            {paginatedAvailable.map(quest => (
              <div key={quest.id} className="quest-card">
                <div className="quest-title">{quest.title}</div>
                <div className="quest-sponsor">Sponsored by: {quest.sponsor}</div>
                <div className="quest-tasks">
                  {quest.tasks.map((task, idx) => (
                    <div key={idx} className="task">
                      <div className="task-icon">{task.icon}</div>
                      <span className="task-description">
                        {task.link ? (
                          <a href={task.link} target="_blank" rel="noopener noreferrer">{task.description}</a>
                        ) : (
                          task.description
                        )}
                      </span>
                      <span className={`task-status ${task.status}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="quest-reward">
                  <span className="reward-amount">{quest.reward}</span>
                  <button 
                    className="complete-btn"
                    onClick={() => completeQuest(quest.id)}
                  >
                    Complete Quest
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination for available quests */}
          <div className="pagination">
            <button 
              className="pagination-btn" 
              disabled={availableCurrentPage === 1}
              onClick={() => setAvailableCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            {Array.from({ length: Math.ceil(availableQuests.length / questsPerPage) }).map((_, i) => (
              <button 
                key={i}
                className={`pagination-btn ${availableCurrentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setAvailableCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="pagination-btn" 
              disabled={availableCurrentPage === Math.ceil(availableQuests.length / questsPerPage)}
              onClick={() => setAvailableCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        <div className="quests-section" id="completed-quests">
          <h2 className="section-title">Completed Quests</h2>
          <div className="quests-grid">
            {paginatedCompleted.map(quest => (
              <div key={quest.id} className="quest-card">
                <div className="quest-title">{quest.title}</div>
                <div className="quest-sponsor">Sponsored by: {quest.sponsor}</div>
                <div className="quest-tasks">
                  {quest.tasks.map((task, idx) => (
                    <div key={idx} className="task">
                      <div className="task-icon">{task.icon}</div>
                      <span className="task-description">
                        {task.link ? (
                          <a href={task.link} target="_blank" rel="noopener noreferrer">{task.description}</a>
                        ) : (
                          task.description
                        )}
                      </span>
                      <span className={`task-status ${task.status}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="quest-reward">
                  <span className="reward-amount">{quest.reward}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination for completed quests */}
          <div className="pagination">
            <button 
              className="pagination-btn" 
              disabled={completedCurrentPage === 1}
              onClick={() => setCompletedCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            {Array.from({ length: Math.ceil(completedQuests.length / questsPerPage) }).map((_, i) => (
              <button 
                key={i}
                className={`pagination-btn ${completedCurrentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCompletedCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="pagination-btn" 
              disabled={completedCurrentPage === Math.ceil(completedQuests.length / questsPerPage)}
              onClick={() => setCompletedCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <BackToTopButton />
      
      <Footer />

      {/* Quest Completion Modal */}
      {completionModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Quest Completed!</h2>
              <span className="close" onClick={() => setCompletionModalOpen(false)}>&times;</span>
            </div>
            <div className="modal-body">
              <p>{completionMessage}</p>
              <button className="modal-close-btn" onClick={() => setCompletionModalOpen(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
