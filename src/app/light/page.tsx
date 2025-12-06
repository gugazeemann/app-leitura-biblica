'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lightbulb, Heart, Share2, RefreshCw, Sparkles } from 'lucide-react';
import { getRandomVerseByEmotion, formatVerseReference } from '@/lib/data';
import { EmotionalState, Verse } from '@/lib/types';
import { EMOTIONAL_MESSAGES } from '@/lib/constants';

const EMOTIONS = [
  { value: 'anxious' as EmotionalState, label: 'Ansioso', icon: '😰', color: 'orange' },
  { value: 'sad' as EmotionalState, label: 'Triste', icon: '😢', color: 'blue' },
  { value: 'discouraged' as EmotionalState, label: 'Desanimado', icon: '😔', color: 'gray' },
  { value: 'confused' as EmotionalState, label: 'Confuso', icon: '😕', color: 'purple' },
  { value: 'grateful' as EmotionalState, label: 'Agradecido', icon: '🙏', color: 'green' },
  { value: 'peaceful' as EmotionalState, label: 'Em paz', icon: '😌', color: 'cyan' },
  { value: 'seeking_answers' as EmotionalState, label: 'Em busca de respostas', icon: '🤔', color: 'yellow' },
  { value: 'prefer_not_say' as EmotionalState, label: 'Prefiro não dizer', icon: '🤐', color: 'gray' },
];

export default function LightPage() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState | null>(null);
  const [verse, setVerse] = useState<Verse | null>(null);
  const [message, setMessage] = useState<string>('');
  const [showInterpretation, setShowInterpretation] = useState(false);

  const handleEmotionSelect = (emotion: EmotionalState) => {
    setSelectedEmotion(emotion);
    
    // Seleciona mensagem aleatória
    const messages = EMOTIONAL_MESSAGES[emotion];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);

    // Seleciona versículo aleatório
    const randomVerse = getRandomVerseByEmotion(emotion);
    setVerse(randomVerse || null);
  };

  const handleNewSuggestion = () => {
    if (selectedEmotion) {
      const randomVerse = getRandomVerseByEmotion(selectedEmotion);
      setVerse(randomVerse || null);
    }
  };

  const handleShare = async () => {
    if (!verse) return;

    const text = `${verse.text}\n\n${formatVerseReference(verse)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Uma luz para você',
          text: text,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Versículo copiado!');
    }
  };

  // Tela de seleção de emoção
  if (!selectedEmotion || !verse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-yellow-900/10 dark:to-orange-900/10 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 mb-4">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Quero uma Luz
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Como você está se sentindo agora?
            </p>
          </div>

          {/* Emotions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => handleEmotionSelect(emotion.value)}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-600 hover:shadow-lg transition-all group"
              >
                <div className="text-4xl mb-2">{emotion.icon}</div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  {emotion.label}
                </p>
              </button>
            ))}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Escolha como você está se sentindo e vamos encontrar uma palavra especial para você 💛
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tela de interpretação
  if (showInterpretation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-yellow-900/10 dark:to-orange-900/10 p-6">
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Como ele te ajudou hoje?
                </label>
                <textarea
                  placeholder="De que forma essa palavra tocou seu coração?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ganha +15 pontos ao compartilhar
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowInterpretation(false);
                    router.push('/');
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium hover:shadow-lg transition-all"
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

  // Tela do versículo
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-yellow-900/10 dark:to-orange-900/10 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              setSelectedEmotion(null);
              setVerse(null);
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Verse Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl mb-6">
          <div className="mb-6">
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4">
              "{verse.text}"
            </p>
            <p className="text-center text-sm font-medium text-yellow-600 dark:text-yellow-400">
              {formatVerseReference(verse)}
            </p>
          </div>

          {/* Tags */}
          {verse.tags && verse.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {verse.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs font-medium"
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
            onClick={handleNewSuggestion}
            className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-yellow-400 dark:border-yellow-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Nova sugestão
          </button>

          <button
            onClick={() => setShowInterpretation(true)}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium hover:shadow-lg transition-all"
          >
            Compartilhar minha reflexão
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Voltar ao início
          </button>
        </div>

        {/* Encouragement */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Você não está sozinho. Estamos juntos nessa caminhada 💛
          </p>
        </div>
      </div>
    </div>
  );
}
