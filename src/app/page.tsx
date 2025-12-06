'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Sprout, Lightbulb, Sparkles, Search, X } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [userName, setUserName] = useState<string>('');
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [greeting, setGreeting] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [versesReadToday, setVersesReadToday] = useState(0);
  const [dailyGoal] = useState(2); // Meta diária de leituras
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Calcula saudação apenas no cliente
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bom dia');
    } else if (hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }

    // Carrega dados do usuário
    loadUserData();

    // Atualiza a cada 30 segundos para refletir mudanças
    const interval = setInterval(loadUserData, 30000);
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
          .select('id, book_id, chapter_number, verse_number, text')
          .ilike('text', `%${searchQuery}%`)
          .limit(10);

        if (error) {
          console.error('Erro na query:', error);
          setSearchResults([]);
        } else if (data && data.length > 0) {
          console.log('Resultados encontrados:', data.length);
          setSearchResults(data);
        } else {
          console.log('Nenhum resultado encontrado para:', searchQuery);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Erro ao buscar versículos:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce: espera 300ms após o usuário parar de digitar
    const timeoutId = setTimeout(searchVerses, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadUserData = async () => {
    try {
      // Verifica autenticação
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Busca dados do perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();

        if (profile) {
          const name = profile.name || localStorage.getItem('userName') || '';
          setUserName(name);
          
          // Atualiza localStorage
          if (name) localStorage.setItem('userName', name);

          // Verifica se deve mostrar diálogo de boas-vindas (a cada 12h)
          const lastWelcome = localStorage.getItem('lastWelcome');
          const now = Date.now();
          if (!lastWelcome || now - parseInt(lastWelcome) > 12 * 60 * 60 * 1000) {
            setShowWelcomeDialog(true);
            localStorage.setItem('lastWelcome', now.toString());
          }
        }

        // Busca versículos lidos HOJE
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

        const { data: todayProgress, error: progressError } = await supabase
          .from('user_verse_progress')
          .select('id')
          .eq('user_id', user.id)
          .gte('read_at', todayISO);

        if (!progressError && todayProgress) {
          setVersesReadToday(todayProgress.length);
          localStorage.setItem('versesReadToday', todayProgress.length.toString());
        }
      } else {
        // Fallback para localStorage se não estiver autenticado
        const storedName = localStorage.getItem('userName');
        const storedVersesReadToday = parseInt(localStorage.getItem('versesReadToday') || '0');
        
        if (storedName) {
          setUserName(storedName);
          setVersesReadToday(storedVersesReadToday);
          
          const lastWelcome = localStorage.getItem('lastWelcome');
          const now = Date.now();
          if (!lastWelcome || now - parseInt(lastWelcome) > 12 * 60 * 60 * 1000) {
            setShowWelcomeDialog(true);
            localStorage.setItem('lastWelcome', now.toString());
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      
      // Fallback para localStorage em caso de erro
      const storedName = localStorage.getItem('userName');
      const storedVersesReadToday = parseInt(localStorage.getItem('versesReadToday') || '0');
      if (storedName) {
        setUserName(storedName);
        setVersesReadToday(storedVersesReadToday);
      }
    }
  };

  // Calcula progresso do dia (baseado em versículos lidos hoje)
  const dailyProgress = Math.min((versesReadToday / dailyGoal) * 100, 100);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Previne hydration mismatch - não renderiza até montar no cliente
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        {/* Header */}
        <header className="p-6 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Luz da Palavra
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Seu companheiro espiritual diário
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                ?
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-24 pt-8">
          <div className="max-w-4xl mx-auto">
            {/* Saudação - placeholder durante SSR */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                &nbsp;
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Vamos seguir juntos?
              </p>
            </div>

            {/* Três Botões Principais */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Versículo do Dia */}
              <Link
                href="/daily-verse"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Versículo do Dia
                  </h3>
                  <p className="text-blue-100">
                    Sua palavra diária de inspiração
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Estudo Permanente */}
              <Link
                href="/study"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sprout className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Estudo Permanente
                  </h3>
                  <p className="text-green-100">
                    Continue crescendo na palavra
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Quero uma Luz */}
              <Link
                href="/light"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-600 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Quero uma Luz
                  </h3>
                  <p className="text-yellow-100">
                    Encontre conforto e direção
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Progresso do Dia */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Seu progresso hoje
                </h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  0 / 2 leituras
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: '0%' }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Continue assim! Cada passo conta na sua jornada. 🌱
              </p>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-2xl">
          <div className="max-w-4xl mx-auto flex justify-around items-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-purple-600 dark:text-purple-400"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </Link>
            <Link
              href="/study"
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Sprout className="w-6 h-6" />
              <span className="text-xs font-medium">Estudo</span>
            </Link>
            <Link
              href="/profile"
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                ?
              </div>
              <span className="text-xs font-medium">Perfil</span>
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Header */}
      <header className="p-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Luz da Palavra
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Seu companheiro espiritual diário
              </p>
            </div>
            <Link 
              href="/profile"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
            >
              {userName ? userName.charAt(0).toUpperCase() : '?'}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-24 pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Saudação */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {greeting}{userName ? `, ${userName}` : ''}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Vamos seguir juntos?
            </p>
          </div>

          {/* Campo de Busca */}
          <div className="mb-8 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar versículos, temas ou passagens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 shadow-lg transition-all"
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
                        <p className="font-semibold text-purple-600 dark:text-purple-400 text-sm mb-1">
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
                    Nenhum resultado encontrado para "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Diálogo de Boas-vindas (a cada 12h) */}
          {showWelcomeDialog && userName && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Bem-vindo de volta, {userName}. Como posso te ajudar hoje?
              </p>
              <div className="grid gap-3">
                <Link
                  href="/study"
                  onClick={() => setShowWelcomeDialog(false)}
                  className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    A. Continuar nosso estudo
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Vamos retomar de onde paramos
                  </p>
                </Link>
                <Link
                  href="/light"
                  onClick={() => setShowWelcomeDialog(false)}
                  className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                    B. Precisa de uma luz?
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Vamos encontrar uma palavra para você
                  </p>
                </Link>
              </div>
              <button
                onClick={() => setShowWelcomeDialog(false)}
                className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 w-full text-center"
              >
                Fechar
              </button>
            </div>
          )}

          {/* Três Botões Principais */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Versículo do Dia */}
            <Link
              href="/daily-verse"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Versículo do Dia
                </h3>
                <p className="text-blue-100">
                  Sua palavra diária de inspiração
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Estudo Permanente */}
            <Link
              href="/study"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sprout className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Estudo Permanente
                </h3>
                <p className="text-green-100">
                    Continue crescendo na palavra
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Quero uma Luz */}
              <Link
                href="/light"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-600 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Quero uma Luz
                  </h3>
                  <p className="text-yellow-100">
                    Encontre conforto e direção
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Progresso do Dia */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Seu progresso hoje
                </h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.min(versesReadToday, dailyGoal)} / {dailyGoal} leituras
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${dailyProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                {versesReadToday >= dailyGoal 
                  ? 'Parabéns! Você atingiu sua meta de hoje! 🎉'
                  : 'Continue assim! Cada passo conta na sua jornada. 🌱'
                }
              </p>
            </div>

            {/* CTA Onboarding (se não completou) */}
            {!userName && (
              <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 shadow-2xl text-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Bem-vindo! 👋
                </h3>
                <p className="text-purple-100 mb-6">
                  Vamos personalizar sua experiência para te ajudar melhor?
                </p>
                <Link
                  href="/onboarding"
                  className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
                >
                  Começar agora
                </Link>
              </div>
            )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-2xl">
          <div className="max-w-4xl mx-auto flex justify-around items-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-purple-600 dark:text-purple-400"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </Link>
            <Link
              href="/study"
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Sprout className="w-6 h-6" />
              <span className="text-xs font-medium">Estudo</span>
            </Link>
            <Link
              href="/profile"
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {userName ? userName.charAt(0).toUpperCase() : '?'}
              </div>
              <span className="text-xs font-medium">Perfil</span>
            </Link>
          </div>
        </nav>
      </div>
    );
  }