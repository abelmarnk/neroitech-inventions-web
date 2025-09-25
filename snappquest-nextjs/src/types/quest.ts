export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardCurrency: 'NGN' | 'USDC';
  createdAt: string; // ISO date
  tasks: Task[];
}

export type QuestWithProgress = Quest & { progress: number };
