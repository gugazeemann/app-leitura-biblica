'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, BookOpen, Trophy, Loader2, Share2, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Verse {
  id: number;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  text: string;
  book_name?: string;
}

// Mapeamento de book_id para nomes em português
const BOOK_NAMES: Record<string, string> = {
  'genesis': 'Gênesis',
  'exodus': 'Êxodo',
  'leviticus': 'Levítico',
  'numbers': 'Números',
  'deuteronomy': 'Deuteronômio',
  'joshua': 'Josué',
  'judges': 'Juízes',
  'ruth': 'Rute',
  '1samuel': '1 Samuel',
  '2samuel': '2 Samuel',
  '1kings': '1 Reis',
  '2kings': '2 Reis',
  '1chronicles': '1 Crônicas',
  '2chronicles': '2 Crônicas',
  'ezra': 'Esdras',
  'nehemiah': 'Neemias',
  'esther': 'Ester',
  'job': 'Jó',
  'psalms': 'Salmos',
  'proverbs': 'Provérbios',
  'ecclesiastes': 'Eclesiastes',
  'song': 'Cantares',
  'isaiah': 'Isaías',
  'jeremiah': 'Jeremias',
  'lamentations': 'Lamentações',
  'ezekiel': 'Ezequiel',
  'daniel': 'Daniel',
  'hosea': 'Oséias',
  'joel': 'Joel',
  'amos': 'Amós',
  'obadiah': 'Obadias',
  'jonah': 'Jonas',
  'micah': 'Miquéias',
  'nahum': 'Naum',
  'habakkuk': 'Habacuque',
  'zephaniah': 'Sofonias',
  'haggai': 'Ageu',
  'zechariah': 'Zacarias',
  'malachi': 'Malaquias',
  'matthew': 'Mateus',
  'mark': 'Marcos',
  'luke': 'Lucas',
  'john': 'João',
  'acts': 'Atos',
  'romans': 'Romanos',
  '1corinthians': '1 Coríntios',
  '2corinthians': '2 Coríntios',
  'galatians': 'Gálatas',
  'ephesians': 'Efésios',
  'philippians': 'Filipenses',
  'colossians': 'Colossenses',
  '1thessalonians': '1 Tessalonicenses',
  '2thessalonians': '2 Tessalonicenses',
  '1timothy': '1 Timóteo',
  '2timothy': '2 Timóteo',
  'titus': 'Tito',
  'philemon': 'Filemom',
  'hebrews': 'Hebreus',
  'james': 'Tiago',
  '1peter': '1 Pedro',
  '2peter': '2 Pedro',
  '1john': '1 João',
  '2john': '2 João',
  '3john': '3 João',
  'jude': 'Judas',
  'revelation': 'Apocalipse'
};

export default function ReadVersePage() {
  const router = useRouter();
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [totalRead, setTotalRead] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState('');
  const [savingReflection, setSavingReflection] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await loadNextVerse(user.id);
        await loadUserStats(user.id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setError('Erro ao verificar autenticação');
      setLoading(false);
    }
  };

  const loadUserStats = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('user_verse_progress')
        .select('verse_id')
        .eq('user_id', uid);

      if (!error && data) {
        setTotalRead(data.length);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const loadNextVerse = async (uid: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Buscando versículos já lidos...');
      
      // Busca versículos já lidos pelo usuário
      const { data: readVerses, error: readError } = await supabase
        .from('user_verse_progress')
        .select('verse_id')
        .eq('user_id', uid);

      if (readError) {
        console.error('❌ Erro ao buscar progresso:', readError);
        setError(`Erro ao buscar progresso: ${readError.message}`);
        setLoading(false);
        return;
      }

      const readVerseIds = readVerses?.map(v => v.verse_id) || [];
      console.log(`📖 Versículos já lidos: ${readVerseIds.length}`);

      // Busca TODOS os versículos primeiro
      console.log('🔍 Buscando todos os versículos...');
      const { data: allVerses, error: versesError } = await supabase
        .from('verses')
        .select('id, book_id, chapter_number, verse_number, text')
        .order('book_id', { ascending: true })
        .order('chapter_number', { ascending: true })
        .order('verse_number', { ascending: true });

      if (versesError) {
        console.error('❌ Erro ao buscar versículos:', versesError);
        setError(`Erro ao buscar versículos: ${versesError.message}`);
        setLoading(false);
        return;
      }

      if (!allVerses || allVerses.length === 0) {
        console.error('❌ Nenhum versículo encontrado no banco');
        setError('Nenhum versículo encontrado no banco de dados. Verifique se a tabela "verses" está populada.');
        setLoading(false);
        return;
      }

      console.log(`✅ Total de versículos no banco: ${allVerses.length}`);

      // Filtra versículos não lidos no lado do cliente
      const unreadVerses = allVerses.filter(v => !readVerseIds.includes(v.id));
      console.log(`📚 Versículos não lidos: ${unreadVerses.length}`);

      let verseToShow = null;

      if (unreadVerses.length > 0) {
        verseToShow = unreadVerses[0];
        console.log('✅ Próximo versículo não lido encontrado:', verseToShow.id);
      } else {
        // Se todos foram lidos, volta ao primeiro
        verseToShow = allVerses[0];
        console.log('🔄 Todos os versículos foram lidos, voltando ao início');
      }

      // Usa o mapeamento para obter o nome do livro em português
      const bookName = BOOK_NAMES[verseToShow.book_id] || verseToShow.book_id;

      setCurrentVerse({
        id: verseToShow.id,
        book_id: verseToShow.book_id,
        chapter_number: verseToShow.chapter_number,
        verse_number: verseToShow.verse_number,
        text: verseToShow.text,
        book_name: bookName
      });

      console.log('✅ Versículo carregado com sucesso!');
    } catch (error) {
      console.error('❌ Erro inesperado ao carregar versículo:', error);
      setError(`Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const saveReflection = async () => {
    if (!userId || !currentVerse || !reflection.trim() || savingReflection) return;

    setSavingReflection(true);
    try {
      console.log('💾 Salvando reflexão...');
      console.log('📝 Dados:', { userId, verse_id: currentVerse.id, reflection: reflection.trim() });

      // Salva a reflexão no Supabase usando a nova tabela
      const { error: reflectionError } = await supabase
        .from('user_reflections_v2')
        .insert({
          user_id: userId,
          verse_id: currentVerse.id,
          reflection_text: reflection.trim(),
          shared: true,
          shared_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (reflectionError) {
        console.error('❌ Erro ao salvar reflexão:', reflectionError);
        throw new Error(`Erro ao salvar reflexão: ${reflectionError.message}`);
      }

      console.log('✅ Reflexão salva com sucesso!');

      // Adiciona pontos extras por compartilhar reflexão (+5 pontos)
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();

      if (profile) {
        const newPoints = (profile.points || 0) + 5;
        await supabase
          .from('profiles')
          .update({
            points: newPoints,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        localStorage.setItem('points', newPoints.toString());
        console.log('✅ +5 pontos por compartilhar reflexão!');
      }

      // Limpa o formulário e fecha o modal
      setReflection('');
      setShowReflection(false);
      alert('Reflexão compartilhada com sucesso! +5 pontos 🎉');
    } catch (error) {
      console.error('❌ Erro ao salvar reflexão:', error);
      alert(`Erro ao salvar reflexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setSavingReflection(false);
    }
  };

  const markAsRead = async () => {
    if (!userId || !currentVerse || saving) return;

    setSaving(true);
    try {
      console.log('💾 Marcando versículo como lido:', currentVerse.id);

      // Verifica se já foi lido
      const { data: existing } = await supabase
        .from('user_verse_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('verse_id', currentVerse.id)
        .single();

      if (!existing) {
        console.log('➕ Adicionando novo progresso...');
        
        // Marca como lido
        const { error: progressError } = await supabase
          .from('user_verse_progress')
          .insert({
            user_id: userId,
            verse_id: currentVerse.id,
            read_at: new Date().toISOString()
          });

        if (progressError) {
          console.error('❌ Erro ao salvar progresso:', progressError);
          throw new Error(`Erro ao salvar progresso: ${progressError.message}`);
        }

        console.log('✅ Progresso salvo com sucesso!');

        // Busca o perfil atual
        console.log('🔍 Buscando perfil do usuário...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('points, verses_read, streak_days')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('⚠️ Erro ao buscar perfil:', profileError);
          
          // Se o perfil não existe, cria um novo
          if (profileError.code === 'PGRST116') {
            console.log('➕ Criando novo perfil...');
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                points: 10,
                verses_read: 1,
                streak_days: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (createError) {
              console.error('❌ Erro ao criar perfil:', createError);
              throw new Error(`Erro ao criar perfil: ${createError.message}`);
            }

            console.log('✅ Perfil criado com 10 pontos!');
            localStorage.setItem('points', '10');
            localStorage.setItem('versesRead', '1');
            localStorage.setItem('streak', '1');
          } else {
            throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
          }
        } else if (profile) {
          // Atualiza o perfil existente
          console.log('🏆 Atualizando pontos do perfil existente...');
          const newPoints = (profile.points || 0) + 10;
          const newVersesRead = (profile.verses_read || 0) + 1;

          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              points: newPoints,
              verses_read: newVersesRead,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          if (updateError) {
            console.error('❌ Erro ao atualizar perfil:', updateError);
            throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
          }

          console.log(`✅ Perfil atualizado! Pontos: ${newPoints}, Versículos: ${newVersesRead}`);
          localStorage.setItem('points', newPoints.toString());
          localStorage.setItem('versesRead', newVersesRead.toString());
        }

        setTotalRead(prev => prev + 1);
        console.log('🎉 Progresso e pontos salvos com sucesso!');
      } else {
        console.log('ℹ️ Versículo já foi lido anteriormente');
      }

      // Carrega próximo versículo
      console.log('⏭️ Carregando próximo versículo...');
      await loadNextVerse(userId);
    } catch (error) {
      console.error('❌ Erro ao marcar versículo como lido:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao salvar progresso';
      alert(`Erro: ${errorMessage}\n\nTente novamente ou verifique sua conexão.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando versículo...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Faça login para continuar
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Para salvar seu progresso e ganhar pontos, você precisa estar logado.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Erro ao Carregar
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                checkAuth();
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => router.back()}
              className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:shadow-md transition-all"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentVerse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Nenhum versículo disponível no momento.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/90 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <div className="flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">{totalRead} lidos</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center">
            Leitura Permanente
          </h1>
        </div>
      </div>

      {/* Verse Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          {/* Verse Reference */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {currentVerse.book_name} {currentVerse.chapter_number}:{currentVerse.verse_number}
              </span>
            </div>
          </div>

          {/* Verse Text */}
          <div className="mb-8">
            <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed text-center font-serif">
              "{currentVerse.text}"
            </p>
          </div>

          {/* Points Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">+10 pontos ao ler este versículo</span>
            </div>
          </div>

          {/* Reflection Section */}
          {!showReflection ? (
            <button
              onClick={() => setShowReflection(true)}
              className="w-full py-3 mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Compartilhar Reflexão (+5 pontos)
            </button>
          ) : (
            <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Compartilhe sua reflexão
                </h3>
              </div>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="O que este versículo significa para você?"
                className="w-full p-3 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={saveReflection}
                  disabled={!reflection.trim() || savingReflection}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {savingReflection ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Compartilhar
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowReflection(false);
                    setReflection('');
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={markAsRead}
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                Próximo Versículo
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Progress Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Continue lendo para aumentar seu nível e desbloquear conquistas! 🌱
          </p>
        </div>
      </div>
    </div>
  );
}
