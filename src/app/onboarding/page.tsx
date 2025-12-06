'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { ONBOARDING_STEPS } from '@/lib/constants';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState('');

  const step = ONBOARDING_STEPS[currentStep];
  const totalSteps = ONBOARDING_STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswer = (value: string) => {
    if (value === 'skip') {
      handleNext();
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [step.field]: value
    }));

    // Avança automaticamente após selecionar
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finaliza onboarding
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = () => {
    // Salva dados do usuário
    localStorage.setItem('userName', userName || 'Amigo');
    localStorage.setItem('onboardingData', JSON.stringify(answers));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Redireciona para home
    router.push('/');
  };

  // Tela de boas-vindas especial (step 0)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Luz da Palavra
            </h1>
            <p className="text-xl text-white/90">
              Seu companheiro espiritual diário
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {step.question}
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Como podemos te chamar?
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid gap-3">
              {step.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    option.value === 'skip'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      : 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-lg hover:scale-105 text-gray-900 dark:text-white font-medium'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pergunta {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {step.question}
          </h2>

          <div className="grid gap-3">
            {step.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`p-4 rounded-xl text-left transition-all ${
                  option.value === 'skip'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    : answers[step.field] === option.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-lg hover:scale-105 text-gray-900 dark:text-white font-medium'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>

            {step.canSkip && (
              <button
                onClick={() => handleAnswer('skip')}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Pular pergunta
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all"
            >
              {currentStep === totalSteps - 1 ? 'Finalizar' : 'Próxima'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skip All */}
        <div className="text-center mt-6">
          <button
            onClick={completeOnboarding}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Pular todas as perguntas
          </button>
        </div>
      </div>
    </div>
  );
}
