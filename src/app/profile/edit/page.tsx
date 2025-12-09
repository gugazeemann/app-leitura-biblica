'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Mail,
  Calendar,
  Save,
  Camera,
  Check
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function EditProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Verifica se Supabase está configurado
      if (isSupabaseConfigured() && supabase) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (!authError && user) {
          // Busca dados do perfil no Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, email, birth_date, bio')
            .eq('id', user.id)
            .single();

          if (profile) {
            setUserName(profile.name || '');
            setEmail(profile.email || user.email || '');
            setBirthDate(profile.birth_date || '');
            setBio(profile.bio || '');
            return;
          }
        }
      }

      // Fallback para localStorage
      if (typeof window !== 'undefined') {
        const storedName = localStorage.getItem('userName') || '';
        const storedEmail = localStorage.getItem('userEmail') || '';
        const storedBirthDate = localStorage.getItem('userBirthDate') || '';
        const storedBio = localStorage.getItem('userBio') || '';
        
        setUserName(storedName);
        setEmail(storedEmail);
        setBirthDate(storedBirthDate);
        setBio(storedBio);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback para localStorage em caso de erro
      if (typeof window !== 'undefined') {
        setUserName(localStorage.getItem('userName') || '');
        setEmail(localStorage.getItem('userEmail') || '');
        setBirthDate(localStorage.getItem('userBirthDate') || '');
        setBio(localStorage.getItem('userBio') || '');
      }
    }
  };

  const handleSave = async () => {
    if (!userName.trim()) {
      alert('Por favor, preencha seu nome');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Tenta salvar no Supabase se estiver configurado
      if (isSupabaseConfigured() && supabase) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (!authError && user) {
          const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              name: userName.trim(),
              email: email.trim(),
              birth_date: birthDate || null,
              bio: bio.trim(),
              updated_at: new Date().toISOString()
            });

          if (!updateError) {
            // Atualiza localStorage também
            if (typeof window !== 'undefined') {
              localStorage.setItem('userName', userName.trim());
              localStorage.setItem('userEmail', email.trim());
              localStorage.setItem('userBirthDate', birthDate);
              localStorage.setItem('userBio', bio.trim());
            }

            setSaveSuccess(true);
            setTimeout(() => {
              router.push('/profile');
            }, 1500);
            return;
          }
        }
      }

      // Fallback: salva apenas no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userName', userName.trim());
        localStorage.setItem('userEmail', email.trim());
        localStorage.setItem('userBirthDate', birthDate);
        localStorage.setItem('userBio', bio.trim());
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <div className="max-w-2xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h1 className="text-xl font-bold text-white">
              Editar Perfil
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Avatar Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                {userName ? userName.charAt(0).toUpperCase() : '?'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Clique para alterar foto
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Nome */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Nome completo
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
            />
          </div>

          {/* Email */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
            />
          </div>

          {/* Data de Nascimento */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Data de nascimento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
            />
          </div>

          {/* Bio */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Sobre você
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre sua jornada espiritual..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {bio.length}/200 caracteres
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving || saveSuccess}
          className={`w-full mt-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            saveSuccess
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:scale-[1.02]'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Salvando...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Salvo com sucesso!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Salvar alterações
            </>
          )}
        </button>

        {/* Info */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Suas informações são privadas e seguras
        </p>
      </div>
    </div>
  );
}
