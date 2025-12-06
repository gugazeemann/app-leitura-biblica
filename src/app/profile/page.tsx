'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Crown, 
  Trophy,
  BookOpen,
  Heart,
  Flame,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { GROWTH_LEVELS } from '@/lib/constants';
import { GrowthLevel } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState<GrowthLevel>('seed');
  const [streak, setStreak] = useState(0);
  const [versesRead, setVersesRead] = useState(0);
  const [interpretations, setInterpretations] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Carrega dados do localStorage
    const name = localStorage.getItem('userName') || 'Amigo';
    const savedPoints = parseInt(localStorage.getItem('points') || '0');
    const savedStreak = parseInt(localStorage.getItem('streak') || '0');
    const savedVersesRead = parseInt(localStorage.getItem('versesRead') || '0');
    const savedInterpretations = parseInt(localStorage.getItem('interpretations') || '0');
    const premium = localStorage.getItem('isPremium') === 'true';

    setUserName(name);
    setPoints(savedPoints);
    setStreak(savedStreak);
    setVersesRead(savedVersesRead);
    setInterpretations(savedInterpretations);
    setIsPremium(premium);

    // Determina o nível
    const currentLevel = Object.entries(GROWTH_LEVELS).find(
      ([_, levelData]) => savedPoints >= levelData.minPoints && savedPoints <= levelData.maxPoints
    )?.[0] as GrowthLevel || 'seed';
    
    setLevel(currentLevel);
  }, []);

  const levelData = GROWTH_LEVELS[level];

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      localStorage.clear();
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/90 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center text-white">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold mx-auto mb-4">
              {userName.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {userName}
            </h1>
            {isPremium && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-medium">
                <Crown className="w-4 h-4" />
                Membro Premium
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12">
        {/* Level Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{levelData.icon}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {levelData.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {levelData.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {points}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                pontos
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {streak}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Dias seguidos
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {versesRead}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Versículos lidos
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {interpretations}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Reflexões
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  0
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Distintivos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
          <button
            onClick={() => router.push('/gamification')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                Conquistas e Distintivos
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => router.push('/favorites')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                Versículos Favoritos
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                Configurações
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Premium CTA (se não for premium) */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 shadow-2xl text-center mb-6">
            <Crown className="w-12 h-12 text-white mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">
              Upgrade para Premium
            </h3>
            <p className="text-purple-100 mb-4 text-sm">
              Desbloqueie modo artístico, comunidades, estudos avançados e muito mais!
            </p>
            <button
              onClick={() => router.push('/premium')}
              className="px-6 py-3 rounded-xl bg-white text-purple-600 font-medium hover:bg-purple-50 transition-colors shadow-lg"
            >
              Ver planos
            </button>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </button>
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
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Estudo</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-purple-600 dark:text-purple-400">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
