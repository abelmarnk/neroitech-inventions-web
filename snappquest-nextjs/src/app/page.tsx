"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { BackToTopButton } from "@/components/BackToTopButton";
import {
  LearnMoreModal,
  CreateQuestModal,
  CopyConfirmationModal,
} from "@/components/modals";
import { Quest } from "@/types/quest";

export default function Home() {
  const [learnOpen, setLearnOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [lastSummary, setLastSummary] = useState<string | undefined>();
  const [quests, setQuests] = useState<Quest[]>([]);

  // Handle create quest link clicks
  useEffect(() => {
    const handleCreateQuestClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute("href") === "#create-quest") {
        e.preventDefault();
        setCreateOpen(true);
      }
    };

    document.addEventListener("click", handleCreateQuestClick);
    return () => document.removeEventListener("click", handleCreateQuestClick);
  }, []);

  const handleCreated = (quest: Quest, summary: string) => {
    setQuests((q) => [quest, ...q]);
    setLastSummary(summary);
    setCreateOpen(false);
    setCopyOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <Hero />

      <HowItWorks />

      <Footer onLearnMoreClick={() => setLearnOpen(true)} />

      <BackToTopButton />

      {/* Modals */}
      <LearnMoreModal open={learnOpen} onClose={() => setLearnOpen(false)} />
      <CreateQuestModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
      <CopyConfirmationModal
        open={copyOpen}
        onClose={() => setCopyOpen(false)}
        copiedText={lastSummary}
      />
    </div>
  );
}
