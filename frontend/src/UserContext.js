import React, { createContext, useState } from 'react';

export const UserContext = createContext();

// Unique, vibrant color palette for the app
export const nourishTheme = {
  primary: '#23c483', // healthy green
  accent: '#ff1e56', // bold pink-red
  gold: '#ffb36a',   // gold for achievements
  sky: '#6aeaff',    // sky blue
  purple: '#b36aff', // playful purple
  background: 'linear-gradient(135deg, #fff9f3 0%, #eaf6ef 100%)',
  badgeGradient: 'linear-gradient(90deg, #ffb36a 0%, #23c483 100%)',
  streak: '#ff6a6a',
};

// Fun badge generator (emoji + title)
const badgeList = [
  { emoji: '💪', name: 'Protein Pro' },
  { emoji: '💸', name: 'Budget Boss' },
  { emoji: '🥦', name: 'Green Chef' },
  { emoji: '🔥', name: 'Waste Warrior' },
  { emoji: '🌟', name: 'Streak Star' },
  { emoji: '🥇', name: 'Macro Master' },
  { emoji: '🧠', name: 'LLM Legend' },
];
// Rare badges for special achievements
const rareBadges = [
  { emoji: '🦄', name: 'Unicorn Chef' },
  { emoji: '👑', name: 'Legendary Nourisher' },
  { emoji: '🧬', name: 'Genome Gourmet' },
  { emoji: '🚀', name: 'Streak Rocket' },
];
function getRandomBadge() {
  const idx = Math.floor(Math.random() * badgeList.length);
  return badgeList[idx];
}
function getRandomRareBadge() {
  const idx = Math.floor(Math.random() * rareBadges.length);
  return rareBadges[idx];
}
// Fun avatar generator (emoji-based)
const avatarList = ['🦊','🐻','🐯','🦁','🐸','🐧','🦄','🐼','🐨','🐙','🦉','🐝','🦋','🐢','🐳','🦕','🦖','🦩','🦚','🦜'];
function getRandomAvatar() {
  const idx = Math.floor(Math.random() * avatarList.length);
  return avatarList[idx];
}
// Fun color generator
function getRandomColor() {
  const colors = ['#23c483','#ff1e56','#ffb36a','#6aeaff','#b36aff','#ff6a6a','#ff7eb9','#f7d716','#00c2ff','#a259ff'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function UserProvider({ children }) {
  // Immutable and mutable user profile data
  const [userProfile, setUserProfile] = useState({
    height: '',
    weight: '',
    allergies: [],
    budget: '',
    fitnessGoals: '',
    subscription: 'free',
    email: '',
    username: '',
    // Unique color and avatar for each user
    theme: nourishTheme,
    avatar: getRandomAvatar(),
    userColor: getRandomColor(),
  });
  // Inventory as a hash map for O(1) lookup
  const [inventory, setInventory] = useState({});
  // History stack for skipped recipes
  const [history, setHistory] = useState([]);
  // Gamification
  const [badges, setBadges] = useState([getRandomBadge()]);
  const [streak, setStreak] = useState(0);
  // AI usage tracking
  const [aiUsage, setAiUsage] = useState(0);
  const maxAiUsage = userProfile.subscription === 'premium' ? 50 : 5;

  // Add/Remove inventory helpers
  const addInventoryItem = (item, tags) => {
    setInventory(prev => ({ ...prev, [item]: { tags } }));
    // Award a badge for adding healthy items
    if (tags.includes('Vegetable') || tags.includes('Protein')) {
      setBadges(prev => [...prev, { emoji: '🥦', name: 'Green Chef' }]);
    }
    // Rare badge for 10+ unique items
    if (Object.keys(inventory).length + 1 >= 10 && !badges.some(b => b.name === 'Unicorn Chef')) {
      setBadges(prev => [...prev, getRandomRareBadge()]);
    }
  };
  const removeInventoryItem = (item) => {
    setInventory(prev => {
      const copy = { ...prev };
      delete copy[item];
      return copy;
    });
  };

  // History stack helpers
  const pushHistory = (recipeId) => setHistory(prev => [recipeId, ...prev]);
  const popHistory = () => setHistory(prev => prev.slice(1));

  // AI usage helpers
  const incrementAiUsage = () => setAiUsage(u => u + 1);
  const resetAiUsage = () => setAiUsage(0);

  // Unique streak system: reward every 3 days with a badge, and rare badge at 15 days
  React.useEffect(() => {
    if (streak > 0 && streak % 3 === 0) {
      setBadges(prev => [...prev, { emoji: '🌟', name: 'Streak Star' }]);
    }
    if (streak > 0 && streak % 15 === 0) {
      setBadges(prev => [...prev, getRandomRareBadge()]);
    }
  }, [streak]);

  return (
    <UserContext.Provider value={{
      userProfile, setUserProfile,
      inventory, addInventoryItem, removeInventoryItem,
      history, pushHistory, popHistory,
      badges, setBadges,
      streak, setStreak,
      aiUsage, incrementAiUsage, resetAiUsage, maxAiUsage,
      theme: userProfile.theme,
      avatar: userProfile.avatar,
      userColor: userProfile.userColor,
    }}>
      {children}
    </UserContext.Provider>
  );
}
