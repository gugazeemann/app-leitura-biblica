'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Lock } from 'lucide-react';
import { BADGES, GROWTH_LEVELS } from '@/lib/constants';
import { GrowthLevel } from '@/lib/types';

export default function GamificationPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState<GrowthLevel>('seed');
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [versesRead, setVersesRead] = useState(0);
  const [interpretations, setInterpretations] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marca que estamos no cliente
    setIsClient(true);

    // Carrega dados apenas no cliente
    if (typeof window !== 'undefined') {
      const savedPoints = parseInt(localStorage.getItem('points') || '0');
      const savedStreak = parseInt(localStorage.getItem('streak') || '0');
      const savedVersesRead = parseInt(localStorage.getItem('versesRead') || '0');
      const savedInterpretations = parseInt(localStorage.getItem('interpretations') || '0');
      const savedBadges = JSON.parse(localStorage.getItem('badges') || '[]');

      setPoints(savedPoints);
      setStreak(savedStreak);
      setVersesRead(savedVersesRead);
      setInterpretations(savedInterpretations);
      setEarnedBadges(savedBadges);

      // Determina nível
      const currentLevel = Object.entries(GROWTH_LEVELS).find(
        ([_, levelData]) => savedPoints >= levelData.minPoints && savedPoints <= levelData.maxPoints
      )?.[0] as GrowthLevel || 'seed';
      
      setLevel(currentLevel);
    }
  }, []);

  const levelData = GROWTH_LEVELS[level];
  const allLevels = Object.entries(GROWTH_LEVELS);

  const checkBadgeEarned = (badgeId: string): boolean => {
    if (earnedBadges.includes(badgeId)) return true;

    // Lógica de verificação
    switch (badgeId) {
      case 'flame_alive':
        return streak >= 7;
      case 'scholar':
        return versesRead >= 50;
      case 'reflective':
        return interpretations >= 20;
      default:
        return false;
    }
  };

  const isPremium = isClient && typeof window !== 'undefined' ? localStorage.getItem('isPremium') : null;

  // Renderiza loading enquanto não está no cliente
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/90 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>

          <div className="text-center text-white">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">
              Conquistas
            </h1>
            <p className="text-purple-100">
              Sua jornada de crescimento espiritual
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-4">
        {/* Current Level */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{levelData.icon}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {levelData.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {levelData.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {points}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                pontos
              </p>
            </div>
          </div>
        </div>

        {/* All Levels */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Níveis de Crescimento
          </h3>
          <div className="space-y-3">
            {allLevels.map(([levelKey, levelInfo]) => {
              const isUnlocked = points >= levelInfo.minPoints;
              const isCurrent = levelKey === level;

              return (
                <div
                  key={levelKey}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCurrent
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : isUnlocked
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl ${!isUnlocked && 'grayscale opacity-50'}`}>
                      {levelInfo.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {levelInfo.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {levelInfo.description}
                      </p>
                    </div>
                    <div className="text-right">
                      {isUnlocked ? (
                        <div className="text-green-600 dark:text-green-400 font-medium text-sm">
                          {isCurrent ? 'Atual' : 'Desbloqueado'}
                        </div>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          {levelInfo.minPoints} pts
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Distintivos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BADGES.map((badge) => {
              const isEarned = checkBadgeEarned(badge.id);
              const isLocked = badge.isPremium && !isPremium;

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    isEarned
                      ? 'border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                      : isLocked
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-50'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className={`text-4xl mb-2 ${!isEarned && 'grayscale opacity-50'}`}>
                    {badge.icon}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {badge.description}
                  </p>
                  {isLocked ? (
                    <div className="flex items-center justify-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                      <Lock className="w-3 h-3" />
                      Premium
                    </div>
                  ) : isEarned ? (
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Conquistado!
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {badge.requirement} para desbloquear
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Encouragement */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Continue sua jornada! Cada passo conta. 🌟
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex justify-around items-center">
          <button
            onClick={() => router.push('/')}
            className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-xs font-medium">Início</span>
          </button>
          <button
            onClick={() => router.push('/study')}
            className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs font-medium">Estudo</span>
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                ?
            </div>
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
