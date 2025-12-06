'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { getDailyVerse, formatVerseReference } from '@/lib/data';
import { Verse } from '@/lib/types';

export default function DailyVersePage() {
  const router = useRouter();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);

  useEffect(() => {
    const dailyVerse = getDailyVerse();
    setVerse(dailyVerse);

    // Verifica se está nos favoritos
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(dailyVerse.id));
  }, []);

  const handleFavorite = () => {
    if (!verse) return;

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== verse.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(verse.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleShare = async () => {
    if (!verse) return;

    const text = `${verse.text}\n\n${formatVerseReference(verse)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Versículo do Dia',
          text: text,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(text);
      alert('Versículo copiado!');
    }
  };

  if (!verse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-purple-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando sua palavra do dia...</p>
        </div>
      </div>
    );
  }

  if (showInterpretation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowInterpretation(false)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>

          {/* Verse Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {formatVerseReference(verse)}
            </p>
            <p className="text-gray-700 dark:text-gray-300 italic">
              "{verse.text.substring(0, 100)}..."
            </p>
          </div>

          {/* Interpretation Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Compartilhe sua reflexão
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Como você interpreta esse versículo?
                </label>
                <textarea
                  placeholder="Compartilhe o que esse versículo significa para você..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Opcional • Suas reflexões são privadas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Como ele te ajudou hoje?
                </label>
                <textarea
                  placeholder="De que forma essa palavra tocou seu coração?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Opcional • Ganha +15 pontos ao compartilhar
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Salva interpretação
                    setShowInterpretation(false);
                    router.push('/');
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all"
                >
                  Enviar reflexão
                </button>
                <button
                  onClick={() => {
                    setShowInterpretation(false);
                    router.push('/');
                  }}
                  className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Pular
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verse Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Versículo do Dia
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4">
              "{verse.text}"
            </p>
            <p className="text-center text-sm font-medium text-purple-600 dark:text-purple-400">
              {formatVerseReference(verse)}
            </p>
          </div>

          {/* Tags */}
          {verse.tags && verse.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {verse.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid gap-4">
          <button
            onClick={() => setShowInterpretation(true)}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all flex items-center justify-between"
          >
            <span>Compartilhar minha reflexão</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>

        {/* Encouragement */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Que essa palavra ilumine seu dia! ✨
          </p>
        </div>
      </div>
    </div>
  );
}
