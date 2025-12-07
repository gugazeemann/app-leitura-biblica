'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sprout, Trophy, Calendar, Target, ChevronRight, Flame, Search, X } from 'lucide-react';
import { GROWTH_LEVELS, DAILY_MISSIONS } from '@/lib/constants';
import { GrowthLevel } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function StudyPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState<GrowthLevel>('seed');
  const [streak, setStreak] = useState(0);
  const [versesRead, setVersesRead] = useState(0);
  const [versesReadToday, setVersesReadToday] = useState(0);
  const [reflectionsSharedToday, setReflectionsSharedToday] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadUserData();

    // Atualiza a cada 3 segundos para refletir mudanças em tempo real
    const interval = setInterval(loadUserData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Busca versículos quando o usuário digita
  useEffect(() => {
    const searchVerses = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        // Busca versículos que contenham o texto da busca
        const { data, error } = await supabase
          .from('verses')
          .select('*')
          .ilike('text', `%${searchQuery}%`)
          .limit(10);

        if (!error && data) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Erro ao buscar versículos:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce: espera 500ms após o usuário parar de digitar
    const timeoutId = setTimeout(searchVerses, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadUserData = async () => {
    try {
      // Verifica autenticação
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Busca dados do perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('points, verses_read, streak_days')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError);
          
          // Se perfil não existe, cria um novo
          if (profileError.code === 'PGRST116') {
            console.log('➕ Criando novo perfil...');
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                points: 0,
                verses_read: 0,
                streak_days: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (!createError) {
              console.log('✅ Perfil criado com sucesso!');
              setPoints(0);
              setVersesRead(0);
              setStreak(0);
            }
          }
        } else if (profile) {
          const userPoints = profile.points || 0;
          const userVersesRead = profile.verses_read || 0;
          const userStreak = profile.streak_days || 0;

          setPoints(userPoints);
          setVersesRead(userVersesRead);
          setStreak(userStreak);

          // Atualiza localStorage
          localStorage.setItem('points', userPoints.toString());
          localStorage.setItem('versesRead', userVersesRead.toString());
          localStorage.setItem('streak', userStreak.toString());

          // Determina o nível baseado nos pontos
          const currentLevel = Object.entries(GROWTH_LEVELS).find(
            ([_, levelData]) => userPoints >= levelData.minPoints && userPoints <= levelData.maxPoints
          )?.[0] as GrowthLevel || 'seed';
          
          setLevel(currentLevel);
        }

        // Busca versículos lidos HOJE - ajustado para fuso horário do Brasil (UTC-3)
        console.log('🔍 Buscando versículos lidos hoje (Brasil)...');
        
        const now = new Date();
        // Ajusta para horário do Brasil (UTC-3)
        const brazilOffset = -3 * 60; // -3 horas em minutos
        const localOffset = now.getTimezoneOffset(); // offset do navegador
        const totalOffset = brazilOffset - localOffset;
        
        const brazilNow = new Date(now.getTime() + totalOffset * 60 * 1000);
        const startOfDay = new Date(brazilNow.getFullYear(), brazilNow.getMonth(), brazilNow.getDate(), 0, 0, 0);
        const endOfDay = new Date(brazilNow.getFullYear(), brazilNow.getMonth(), brazilNow.getDate(), 23, 59, 59);
        
        // Converte de volta para UTC para a query
        const startOfDayUTC = new Date(startOfDay.getTime() - totalOffset * 60 * 1000);
        const endOfDayUTC = new Date(endOfDay.getTime() - totalOffset * 60 * 1000);
        
        console.log('📅 Período de busca (Brasil):', {
          inicio: startOfDay.toLocaleString('pt-BR'),
          fim: endOfDay.toLocaleString('pt-BR'),
          inicioUTC: startOfDayUTC.toISOString(),
          fimUTC: endOfDayUTC.toISOString()
        });
        
        const { data: todayVerses, error: versesError } = await supabase
          .from('user_verse_progress')
          .select('id, read_at', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('read_at', startOfDayUTC.toISOString())
          .lte('read_at', endOfDayUTC.toISOString());

        if (!versesError) {
          const count = todayVerses?.length || 0;
          setVersesReadToday(count);
          localStorage.setItem('versesReadToday', count.toString());
          console.log('✅ Versículos lidos hoje:', count);
          if (todayVerses && todayVerses.length > 0) {
            console.log('📖 Registros encontrados:', todayVerses.map(v => ({
              id: v.id,
              read_at: new Date(v.read_at).toLocaleString('pt-BR')
            })));
          }
        } else {
          console.error('❌ Erro ao buscar versículos de hoje:', versesError);
          setVersesReadToday(0);
        }

        // Busca reflexões compartilhadas HOJE - ajustado para fuso horário do Brasil
        console.log('🔍 Buscando reflexões compartilhadas hoje (Brasil)...');

        const { data: todayReflections, error: reflectionsError } = await supabase
          .from('user_reflections_v2')
          .select('id, shared_at', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('shared', true)
          .gte('shared_at', startOfDayUTC.toISOString())
          .lte('shared_at', endOfDayUTC.toISOString());

        if (!reflectionsError) {
          const count = todayReflections?.length || 0;
          setReflectionsSharedToday(count);
          console.log('✅ Reflexões compartilhadas hoje:', count);
          if (todayReflections && todayReflections.length > 0) {
            console.log('💭 Registros encontrados:', todayReflections.map(r => ({
              id: r.id,
              shared_at: new Date(r.shared_at).toLocaleString('pt-BR')
            })));
          }
        } else {
          console.error('❌ Erro ao buscar reflexões de hoje:', reflectionsError);
          setReflectionsSharedToday(0);
        }
      } else {
        // Fallback para localStorage se não estiver autenticado
        const savedPoints = parseInt(localStorage.getItem('points') || '0');
        const savedStreak = parseInt(localStorage.getItem('streak') || '0');
        const savedVersesRead = parseInt(localStorage.getItem('versesRead') || '0');
        const savedVersesReadToday = parseInt(localStorage.getItem('versesReadToday') || '0');

        setPoints(savedPoints);
        setStreak(savedStreak);
        setVersesRead(savedVersesRead);
        setVersesReadToday(savedVersesReadToday);

        const currentLevel = Object.entries(GROWTH_LEVELS).find(
          ([_, levelData]) => savedPoints >= levelData.minPoints && savedPoints <= levelData.maxPoints
        )?.[0] as GrowthLevel || 'seed';
        
        setLevel(currentLevel);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const levelData = GROWTH_LEVELS[level];
  const nextLevel = Object.entries(GROWTH_LEVELS).find(
    ([_, data]) => data.minPoints > levelData.maxPoints
  );
  const progressToNextLevel = nextLevel 
    ? ((points - levelData.minPoints) / (nextLevel[1].minPoints - levelData.minPoints)) * 100
    : 100;

  // Calcula progresso das missões baseado EXCLUSIVAMENTE no progresso DE HOJE
  const dailyMissionsProgress = DAILY_MISSIONS.slice(0, 3).map(mission => {
    let current = 0;
    
    if (mission.requirement.type === 'read_verses') {
      // Usa versículos lidos HOJE
      current = versesReadToday;
      console.log(`📊 Missão "${mission.title}": ${current}/${mission.requirement.count} versículos hoje`);
    } else if (mission.requirement.type === 'share_reflection') {
      // Usa reflexões compartilhadas HOJE
      current = reflectionsSharedToday;
      console.log(`📊 Missão "${mission.title}": ${current}/${mission.requirement.count} reflexões hoje`);
    } else if (mission.requirement.type === 'daily_verse') {
      // Verifica se leu pelo menos 1 versículo hoje
      current = versesReadToday > 0 ? 1 : 0;
      console.log(`📊 Missão "${mission.title}": ${current}/${mission.requirement.count} (leu hoje: ${versesReadToday > 0 ? 'sim' : 'não'})`);
    } else if (mission.requirement.type === 'study_plan') {
      // TODO: Implementar progresso em planos de estudo
      current = 0;
      console.log(`📊 Missão "${mission.title}": ${current}/${mission.requirement.count} (não implementado)`);
    }

    const completed = current >= mission.requirement.count;
    console.log(`${completed ? '✅' : '⏳'} Missão "${mission.title}": ${completed ? 'COMPLETA' : 'EM PROGRESSO'}`);

    return {
      ...mission,
      current,
      completed
    };
  });

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

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
        {/* Campo de Busca */}
        <div className="mb-6 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar versículos, temas ou passagens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 shadow-lg transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Resultados da Busca */}
          {searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  Buscando...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((verse) => (
                    <Link
                      key={verse.id}
                      href={`/study/read?verse=${verse.id}`}
                      className="block p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={clearSearch}
                    >
                      <p className="font-semibold text-green-600 dark:text-green-400 text-sm mb-1">
                        {verse.book_id} {verse.chapter_number}:{verse.verse_number}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                        {verse.text}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          )}
        </div>

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
              {versesReadToday}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Leituras hoje
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
            {dailyMissionsProgress.map((mission) => (
              <div
                key={mission.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  mission.completed
                    ? 'bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex-1">
                  <p className={`font-medium text-sm ${
                    mission.completed 
                      ? 'text-white' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {mission.title}
                  </p>
                  <p className={`text-xs mt-1 ${
                    mission.completed 
                      ? 'text-green-100' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    +{mission.points} pontos
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  mission.completed
                    ? 'bg-white text-green-600'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {mission.completed ? (
                    <span className="text-xl">✓</span>
                  ) : (
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {mission.current}/{mission.requirement.count}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start/Continue Reading Button */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center text-white">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="text-xl font-bold mb-2">
              Leitura Permanente
            </h3>
            <p className="text-green-100 mb-4 text-sm">
              {versesRead > 0 
                ? `Você já leu ${versesRead} versículo${versesRead > 1 ? 's' : ''}. Continue sua jornada!`
                : 'Leia versículos sequencialmente e ganhe pontos a cada leitura'
              }
            </p>
            <button
              onClick={() => router.push('/study/read')}
              className="w-full py-3 bg-white text-green-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ChevronRight className="w-5 h-5" />
              {versesRead > 0 ? 'Continuar Leitura' : 'Começar Leitura'}
            </button>
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
                    <div 
                      className="h-full bg-green-600 dark:bg-green-400 rounded-full transition-all" 
                      style={{ width: '0%' }} 
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Não iniciado
                  </p>
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
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-blue-600 dark:bg-blue-400 rounded-full" style={{ width: '0%' }} />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Não iniciado
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
