'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Bell,
  Moon,
  Sun,
  Globe,
  Volume2,
  BookOpen,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  
  // Estados
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [bibleVersion, setBibleVersion] = useState('nvi');
  const [language, setLanguage] = useState('pt-BR');
  const [soundEffects, setSoundEffects] = useState(true);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedDailyReminder = localStorage.getItem('dailyReminder') !== 'false';
    const savedReminderTime = localStorage.getItem('reminderTime') || '08:00';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedBibleVersion = localStorage.getItem('bibleVersion') || 'nvi';
    const savedLanguage = localStorage.getItem('language') || 'pt-BR';
    const savedSoundEffects = localStorage.getItem('soundEffects') !== 'false';

    setNotifications(savedNotifications);
    setDailyReminder(savedDailyReminder);
    setReminderTime(savedReminderTime);
    setDarkMode(savedDarkMode);
    setFontSize(savedFontSize);
    setBibleVersion(savedBibleVersion);
    setLanguage(savedLanguage);
    setSoundEffects(savedSoundEffects);

    // Aplicar dark mode
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Salvar configurações
  const handleToggleNotifications = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('notifications', String(newValue));
  };

  const handleToggleDailyReminder = () => {
    const newValue = !dailyReminder;
    setDailyReminder(newValue);
    localStorage.setItem('dailyReminder', String(newValue));
  };

  const handleReminderTimeChange = (time: string) => {
    setReminderTime(time);
    localStorage.setItem('reminderTime', time);
  };

  const handleToggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  const handleBibleVersionChange = (version: string) => {
    setBibleVersion(version);
    localStorage.setItem('bibleVersion', version);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleToggleSoundEffects = () => {
    const newValue = !soundEffects;
    setSoundEffects(newValue);
    localStorage.setItem('soundEffects', String(newValue));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Configurações</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-4">
        {/* Notificações */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Notificações
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Ativar notificações
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receba lembretes e atualizações
                </p>
              </div>
              <button
                onClick={handleToggleNotifications}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {notifications && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Lembrete diário
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba um lembrete para ler
                    </p>
                  </div>
                  <button
                    onClick={handleToggleDailyReminder}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      dailyReminder ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        dailyReminder ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {dailyReminder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Horário do lembrete
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => handleReminderTimeChange(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Aparência */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              ) : (
                <Sun className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              )}
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Aparência
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Modo escuro
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tema escuro para leitura noturna
                </p>
              </div>
              <button
                onClick={handleToggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Tamanho da fonte
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      fontSize === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {size === 'small' && 'Pequeno'}
                    {size === 'medium' && 'Médio'}
                    {size === 'large' && 'Grande'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leitura */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Leitura
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Versão da Bíblia
              </label>
              <div className="space-y-2">
                {[
                  { value: 'nvi', label: 'Nova Versão Internacional (NVI)' },
                  { value: 'arc', label: 'Almeida Revista e Corrigida (ARC)' },
                  { value: 'naa', label: 'Nova Almeida Atualizada (NAA)' },
                  { value: 'ntlh', label: 'Nova Tradução na Linguagem de Hoje (NTLH)' },
                ].map((version) => (
                  <button
                    key={version.value}
                    onClick={() => handleBibleVersionChange(version.value)}
                    className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                      bibleVersion === version.value
                        ? 'bg-purple-100 dark:bg-purple-900/20 border-2 border-purple-600'
                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {version.label}
                    </span>
                    {bibleVersion === version.value && (
                      <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Som */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Som
              </h2>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Efeitos sonoros
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sons ao completar ações
                </p>
              </div>
              <button
                onClick={handleToggleSoundEffects}
                className={`w-12 h-6 rounded-full transition-colors ${
                  soundEffects ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Idioma */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Idioma
              </h2>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {[
                { value: 'pt-BR', label: 'Português (Brasil)' },
                { value: 'en-US', label: 'English (US)' },
                { value: 'es-ES', label: 'Español' },
              ].map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageChange(lang.value)}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                    language === lang.value
                      ? 'bg-purple-100 dark:bg-purple-900/20 border-2 border-purple-600'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {lang.label}
                  </span>
                  {language === lang.value && (
                    <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Outros */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4">
          <button
            onClick={() => router.push('/privacy')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                Privacidade e Segurança
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => router.push('/help')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                Ajuda e Suporte
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => router.push('/about')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                Sobre o App
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Versão */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Luz da Palavra v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
