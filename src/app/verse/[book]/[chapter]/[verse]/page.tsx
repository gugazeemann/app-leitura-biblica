'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Lightbulb, BookOpen, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { getVerses, getVerse } from '@/lib/data';
import { BOOKS } from '@/lib/constants';

export default function VersePage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.book as string;
  const chapterNum = parseInt(params.chapter as string);
  const verseNum = parseInt(params.verse as string);

  const [allVerses, setAllVerses] = useState<any[]>([]);
  const [currentVerse, setCurrentVerse] = useState<any>(null);
  const [bookData, setBookData] = useState<any>(null);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [interpretation, setInterpretation] = useState('');

  useEffect(() => {
    // Buscar dados do livro
    const book = BOOKS.find(b => b.id === bookId);
    setBookData(book);

    // Buscar todos os versículos do capítulo
    const verses = getVerses(bookId, chapterNum);
    setAllVerses(verses);

    // Buscar versículo atual
    const verse = getVerse(bookId, chapterNum, verseNum);
    setCurrentVerse(verse);
  }, [bookId, chapterNum, verseNum]);

  if (!currentVerse || !bookData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>

            <div className="flex-1 text-center">
              <Link
                href={`/study?book=${bookId}`}
                className="text-lg font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {bookData.name}
              </Link>
              <span className="mx-2 text-slate-400">·</span>
              <Link
                href={`/chapter/${bookId}/${chapterNum}`}
                className="text-lg font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Capítulo {chapterNum}
              </Link>
            </div>

            <div className="w-9" />
          </div>
        </div>
      </div>

      {/* Conteúdo com rolagem contínua */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {allVerses.map((verse) => (
            <div
              key={verse.verse}
              id={`verse-${verse.verse}`}
              className={`scroll-mt-24 transition-all duration-300 ${
                verse.verse === verseNum
                  ? 'bg-blue-50 dark:bg-blue-950/30 -mx-4 px-4 py-6 rounded-2xl border-l-4 border-blue-500'
                  : 'py-2'
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 text-right">
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
                    {verse.verse}
                  </span>
                </div>
                <p className="flex-1 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  {verse.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Botões de ação */}
        <div className="mt-12 space-y-4">
          <button
            onClick={() => setShowInterpretation(!showInterpretation)}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-lg font-semibold">
              {showInterpretation ? 'Ocultar interpretação' : 'Compartilhar sua interpretação'}
            </span>
          </button>

          {showInterpretation && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Como você interpreta esse versículo?
                </label>
                <textarea
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  placeholder="Compartilhe seus pensamentos..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors min-h-32 resize-none"
                />
              </div>
              <button className="w-full bg-purple-600 text-white rounded-xl py-3 font-semibold hover:bg-purple-700 transition-colors">
                Salvar interpretação
              </button>
            </div>
          )}

          <Link
            href="/light"
            className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-3">
              <Lightbulb className="w-6 h-6" />
              <span className="text-lg font-semibold">Quero uma luz</span>
            </div>
          </Link>

          <Link
            href="/study"
            className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="w-6 h-6" />
              <span className="text-lg font-semibold">Continuar estudo</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
