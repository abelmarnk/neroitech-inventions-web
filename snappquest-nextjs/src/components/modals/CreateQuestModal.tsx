"use client";
import { useState, useCallback } from 'react';
import { BaseModal } from './BaseModal';
import { motion } from 'framer-motion';
import { FaPlusCircle, FaTrash, FaClipboard } from 'react-icons/fa';
import { Quest, Task } from '@/types/quest';
import { CURRENCIES, formatAmount } from '@/utils/currency';

interface CreateQuestModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (quest: Quest, rawSummary: string) => void;
}

interface TaskDraft extends Omit<Task, 'completed'> { completed?: boolean; }

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({ open, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState<number>(0);
  const [currency, setCurrency] = useState<'NGN' | 'USDC'>('NGN');
  const [tasks, setTasks] = useState<TaskDraft[]>([]);
  const [creating, setCreating] = useState(false);

  const addTask = () => setTasks(t => [...t, { id: `${Date.now()}-${t.length+1}`, title: '', description: '' }]);
  const updateTask = (id: string, patch: Partial<TaskDraft>) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const reset = () => {
    setTitle(''); setDescription(''); setReward(0); setCurrency('NGN'); setTasks([]);
  };

  const generateSummary = useCallback((quest: Quest) => {
    return [
      `Quest: ${quest.title}`,
      `Description: ${quest.description}`,
      `Reward: ${formatAmount(quest.reward, quest.rewardCurrency)}`,
      'Tasks:',
  ...quest.tasks.map((t: Task, i: number) => `  ${i+1}. ${t.title} - ${t.description}`)
    ].join('\n');
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || tasks.length === 0) return;
    setCreating(true);
    const quest: Quest = {
      id: `${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      reward,
      rewardCurrency: currency,
      createdAt: new Date().toISOString(),
      tasks: tasks.map(t => ({ id: t.id, title: t.title.trim(), description: t.description.trim(), completed: false }))
    };
    const summary = generateSummary(quest);
    try {
      await navigator.clipboard.writeText(summary);
    } catch (e) {
      // swallow clipboard errors; still proceed
    }
    onCreated(quest, summary);
    setCreating(false);
    reset();
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Create a Quest">
              <h3>Quest Options</h3>
        <p>Select the engagement types and quantities for your quest. Minimum price is <span id="minPriceText">₦20</span> per engagement.</p>
        
        <div className="currency-switch">
          <span>NGN</span>
          <label className="switch">
            <input type="checkbox" checked={currency === 'USDC'} onChange={(e) => setCurrency(e.target.checked ? 'USDC' : 'NGN')} />
            <span className="slider"></span>
          </label>
          <span>USDC</span>
        </div>

        <form>
          <div className="quest-option">
            <label>
              <input type="checkbox" /> X Likes
            </label>
            <input type="number" placeholder="Quantity" min="0" />
          </div>
          <div className="quest-option">
            <label>
              <input type="checkbox" /> X RTs
            </label>
            <input type="number" placeholder="Quantity" min="0" />
          </div>
          <div className="quest-option">
            <label>
              <input type="checkbox" /> X Comments
            </label>
            <input type="number" placeholder="Quantity" min="0" />
          </div>
          <div className="quest-option">
            <label>
              <input type="checkbox" /> X Followers
            </label>
            <input type="number" placeholder="Quantity" min="0" />
          </div>
          
          <div className="price-calculation">
            <h3>Total Price: <span id="totalPrice">{currency === 'NGN' ? '₦0' : '0 USDC'}</span></h3>
          </div>

          <div className="buttons-container">
            <button type="button" className="modal-close-btn" onClick={handleCreate}>Create Quest</button>
            <button type="button" className="modal-close-btn" onClick={() => window.open('https://t.me/SnappQuest/146', '_blank')}>Custom Quest</button>
          </div>
        </form>
    </BaseModal>
  );
};
