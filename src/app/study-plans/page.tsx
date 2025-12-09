'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, BookOpen, Users, Lock, CheckCircle, Clock, Target } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export default function StudyPlansPage() {
  const router = useRouter();
  const [isInGroup, setIsInGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([
    {
      id: '1',
      title: 'Fundamentos da Fé',
      description: 'Explore os pilares essenciais da fé cristã através de estudos bíblicos profundos.',
      duration: '4 semanas',
      progress: 65,
      totalLessons: 20,
      completedLessons: 13,
    },
    {
      id: '2',
      title: 'Salmos de Louvor',
      description: 'Mergulhe nos Salmos e descubra a beleza da adoração através da palavra.',
      duration: '3 semanas',
      progress: 30,
      totalLessons: 15,
      completedLessons: 5,
    },
    {
      id: '3',
      title: 'Provérbios para a Vida',
      description: 'Sabedoria prática para o dia a dia através dos ensinamentos de Provérbios.',
      duration: '6 semanas',
      progress: 0,
      totalLessons: 30,
      completedLessons: 0,
    },
  ]);

  useEffect(() => {
    checkGroupMembership();
  }, []);

  const checkGroupMembership = async () => {
    try {
      setLoading(true);

      // Verifica se Supabase está configurado
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback: verifica localStorage
        if (typeof window !== 'undefined') {
          const storedGroupStatus = localStorage.getItem('userInGroup');
          const storedGroupName = localStorage.getItem('userGroupName');
          
          if (storedGroupStatus === 'true') {
            setIsInGroup(true);
            setGroupName(storedGroupName || 'Seu Grupo');
          } else {
            setIsInGroup(false);
          }
        }
        setLoading(false);
        return;
      }

      // Busca usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        // Fallback para localStorage
        if (typeof window !== 'undefined') {
          const storedGroupStatus = localStorage.getItem('userInGroup');
          const storedGroupName = localStorage.getItem('userGroupName');
          
          if (storedGroupStatus === 'true') {
            setIsInGroup(true);
            setGroupName(storedGroupName || 'Seu Grupo');
          }
        }
        setLoading(false);
        return;
      }

      // Verifica se usuário está em algum grupo
      const { data: groupMemberships, error: groupError } = await supabase
        .from('group_members')
        .select(`
          id,
          groups (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1);

      if (!groupError && groupMemberships && groupMemberships.length > 0) {
        setIsInGroup(true);
        const group = groupMemberships[0].groups as any;
        setGroupName(group?.name || 'Seu Grupo');
        
        // Salva no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInGroup', 'true');
          localStorage.setItem('userGroupName', group?.name || 'Seu Grupo');
        }
      } else {
        setIsInGroup(false);
        
        // Remove do localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userInGroup');
          localStorage.removeItem('userGroupName');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar grupo:', error);
      setIsInGroup(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <Home className="w-5 h-5" />
            Início
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Planos de Estudo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isInGroup 
              ? `Trilhas de estudo do grupo ${groupName}`
              : 'Funcionalidade exclusiva para membros de grupos'
            }
          </p>
        </div>

        {/* Conteúdo Condicional */}
        {!isInGroup ? (
          // Estado Desabilitado - Não está em grupo
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
              <Lock className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Planos de Estudo Bloqueados
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Os Planos de Estudo são uma funcionalidade exclusiva para quem está participando de um grupo. 
              Entre em um grupo para desbloquear trilhas de estudo personalizadas!
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Benefícios dos Grupos
              </h3>
              <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Acesso a planos de estudo estruturados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Estude junto com outros membros</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Compartilhe insights e reflexões</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Acompanhe o progresso coletivo</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/groups')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-xl transition-all hover:scale-105"
              >
                Encontrar Grupos
              </button>
              <button
                onClick={() => router.push('/plans')}
                className="px-8 py-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Ver Planos Premium
              </button>
            </div>
          </div>
        ) : (
          // Estado Habilitado - Está em grupo
          <div className="space-y-6">
            {/* Info do Grupo */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6" />
                <h3 className="text-xl font-bold">Grupo: {groupName}</h3>
              </div>
              <p className="text-green-100">
                Você tem acesso aos planos de estudo compartilhados do grupo
              </p>
            </div>

            {/* Lista de Planos */}
            <div className="grid gap-6">
              {studyPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
                  onClick={() => router.push(`/study-plans/${plan.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {plan.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{plan.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{plan.completedLessons}/{plan.totalLessons} lições</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {plan.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${plan.progress}%` }}
                    />
                  </div>

                  {/* Status */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {plan.progress === 0 
                        ? 'Não iniciado'
                        : plan.progress === 100
                        ? 'Concluído'
                        : 'Em progresso'
                      }
                    </span>
                    <button className="text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                      {plan.progress === 0 ? 'Começar' : 'Continuar'} →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA para criar novo plano (se for pastor) */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 text-center border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quer criar seus próprios planos?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Com o plano Pastor, você pode criar e compartilhar planos de estudo personalizados
              </p>
              <button
                onClick={() => router.push('/plans')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all hover:scale-105"
              >
                Conhecer Plano Pastor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
