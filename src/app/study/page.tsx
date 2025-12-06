'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sprout, Trophy, Calendar, Target, ChevronRight, Flame } from 'lucide-react';
import { GROWTH_LEVELS, DAILY_MISSIONS } from '@/lib/constants';
import { GrowthLevel } from '@/lib/types';

export default function StudyPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState<GrowthLevel>('seed');
  const [streak, setStreak] = useState(0);
  const [versesRead, setVersesRead] = useState(0);

  useEffect(() => {
    // Carrega dados do localStorage
    const savedPoints = parseInt(localStorage.getItem('points') || '0');
    const savedStreak = parseInt(localStorage.getItem('streak') || '0');
    const savedVersesRead = parseInt(localStorage.getItem('versesRead') || '0');

    setPoints(savedPoints);
    setStreak(savedStreak);
    setVersesRead(savedVersesRead);

    // Determina o nível baseado nos pontos
    const currentLevel = Object.entries(GROWTH_LEVELS).find(
      ([_, levelData]) => savedPoints >= levelData.minPoints && savedPoints <= levelData.maxPoints
    )?.[0] as GrowthLevel || 'seed';
    
    setLevel(currentLevel);
  }, []);

  const levelData = GROWTH_LEVELS[level];
  const nextLevel = Object.entries(GROWTH_LEVELS).find(
    ([_, data]) => data.minPoints > levelData.maxPoints
  );
  const progressToNextLevel = nextLevel 
    ? ((points - levelData.minPoints) / (nextLevel[1].minPoints - levelData.minPoints)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/90 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              onClick={() => router.push('/gamification')}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <Trophy className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center text-white">
            <div className="text-6xl mb-3">{levelData.icon}</div>
            <h1 className="text-3xl font-bold mb-2">
              {levelData.name}
            </h1>
            <p className="text-green-100 mb-4">
              {levelData.description}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span>{streak} dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>{points} pontos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-4">
        {/* Progress Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Progresso para {nextLevel ? nextLevel[1].name : 'Máximo'}
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {points} / {nextLevel ? nextLevel[1].minPoints : levelData.maxPoints} pts
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {nextLevel 
              ? `Faltam ${nextLevel[1].minPoints - points} pontos para o próximo nível`
              : 'Você alcançou o nível máximo! 🎉'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {versesRead}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Versículos lidos
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {streak}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Dias seguidos
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              0
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Estudos completos
            </p>
          </div>
        </div>

        {/* Daily Missions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Missões de Hoje
            </h3>
          </div>
          <div className="space-y-3">
            {DAILY_MISSIONS.slice(0, 3).map((mission) => (
              <div
                key={mission.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {mission.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    +{mission.points} pontos
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">0/{mission.requirement.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Plans */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Planos de Estudo
            </h3>
            <button className="text-sm text-green-600 dark:text-green-400 hover:underline">
              Ver todos
            </button>
          </div>

          <div className="space-y-3">
            {/* Plano Iniciante */}
            <button className="w-full p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 hover:shadow-md transition-all text-left">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Primeiros Passos na Fé
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    30 dias • Iniciante
                  </p>
                  <div className="mt-2 w-full bg-green-200 dark:bg-green-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-green-600 dark:bg-green-400 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
              </div>
            </button>

            {/* Plano Intermediário */}
            <button className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all text-left">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Salmos de Conforto
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    14 dias • Intermediário
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
              </div>
            </button>

            {/* Plano Avançado (Premium) */}
            <button className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all text-left relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Teologia Profunda
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    60 dias • Avançado
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
                  Premium
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Calendar Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Calendário de Consistência
            </h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                  i < streak
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 text-center">
            {streak > 0 
              ? `Parabéns! ${streak} dias de leitura consecutiva 🔥`
              : 'Comece sua jornada hoje!'
            }
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
          <button className="flex flex-col items-center gap-1 text-green-600 dark:text-green-400">
            <Sprout className="w-6 h-6" />
            <span className="text-xs font-medium">Estudo</span>
          </button>
          <button
            onClick={() => router.push('/gamification')}
            className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs font-medium">Conquistas</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
