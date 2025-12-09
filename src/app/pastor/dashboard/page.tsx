'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Plus, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  totalLessons: number;
  activeMembers: number;
  completionRate: number;
  createdAt: string;
}

interface GroupStats {
  totalGroups: number;
  totalMembers: number;
  activePlans: number;
  avgCompletion: number;
}

export default function PastorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<'free' | 'premium' | 'pastor'>('free');
  const [stats, setStats] = useState<GroupStats>({
    totalGroups: 0,
    totalMembers: 0,
    activePlans: 0,
    avgCompletion: 0
  });
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

  useEffect(() => {
    checkPastorAccess();
  }, []);

  const checkPastorAccess = async () => {
    try {
      setLoading(true);

      // Verifica se Supabase está configurado
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback: verifica localStorage
        if (typeof window !== 'undefined') {
          const savedPlan = localStorage.getItem('userPlan') || 'free';
          setUserPlan(savedPlan as 'free' | 'premium' | 'pastor');
          
          if (savedPlan !== 'pastor') {
            router.push('/plans');
            return;
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
          const savedPlan = localStorage.getItem('userPlan') || 'free';
          setUserPlan(savedPlan as 'free' | 'premium' | 'pastor');
          
          if (savedPlan !== 'pastor') {
            router.push('/plans');
            return;
          }
        }
        setLoading(false);
        return;
      }

      // Busca plano do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (!profileError && profile) {
        const plan = profile.subscription_plan || 'free';
        setUserPlan(plan);
        
        // Salva no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('userPlan', plan);
        }

        // Se não for pastor, redireciona
        if (plan !== 'pastor') {
          router.push('/plans');
          return;
        }

        // Carrega estatísticas e planos
        await loadDashboardData(user.id);
      } else {
        router.push('/plans');
      }
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      router.push('/plans');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      // Busca grupos do pastor
      const { data: groups, error: groupsError } = await supabase
        .from('groups')
        .select('id')
        .eq('created_by', userId);

      if (!groupsError && groups) {
        const totalGroups = groups.length;

        // Busca membros dos grupos
        const { data: members, error: membersError } = await supabase
          .from('group_members')
          .select('id')
          .in('group_id', groups.map(g => g.id))
          .eq('status', 'active');

        const totalMembers = members?.length || 0;

        // Busca planos de estudo criados
        const { data: plans, error: plansError } = await supabase
          .from('study_plans')
          .select('*')
          .eq('created_by', userId);

        const activePlans = plans?.length || 0;

        // Calcula taxa média de conclusão (mock por enquanto)
        const avgCompletion = 67;

        setStats({
          totalGroups,
          totalMembers,
          activePlans,
          avgCompletion
        });

        // Formata planos para exibição
        if (plans) {
          const formattedPlans: StudyPlan[] = plans.map(plan => ({
            id: plan.id,
            title: plan.title || 'Plano sem título',
            description: plan.description || '',
            duration: plan.duration || '4 semanas',
            totalLessons: plan.total_lessons || 0,
            activeMembers: Math.floor(Math.random() * 50) + 10, // Mock
            completionRate: Math.floor(Math.random() * 40) + 50, // Mock
            createdAt: plan.created_at
          }));
          setStudyPlans(formattedPlans);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-white/90 hover:text-white"
            >
              <Home className="w-5 h-5" />
              Início
            </button>
            <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              Plano Pastor
            </div>
          </div>

          <div className="text-center text-white">
            <div className="text-5xl mb-3">👨‍🏫</div>
            <h1 className="text-3xl font-bold mb-2">
              Painel de Gestão Pastor
            </h1>
            <p className="text-purple-100">
              Gerencie seus grupos e planos de estudo
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-3">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalGroups}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Grupos Ativos
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalMembers}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Membros Totais
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.activePlans}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Planos Ativos
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.avgCompletion}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Taxa de Conclusão
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => router.push('/pastor/create-plan')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  Criar Novo Plano
                </h3>
                <p className="text-purple-100 text-sm">
                  Desenvolva um plano de estudo personalizado
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/groups')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  Gerenciar Grupos
                </h3>
                <p className="text-blue-100 text-sm">
                  Administre seus grupos e membros
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Study Plans List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Seus Planos de Estudo
            </h2>
            <button
              onClick={() => router.push('/pastor/create-plan')}
              className="px-4 py-2 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Plano
            </button>
          </div>

          {studyPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum plano criado ainda
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Comece criando seu primeiro plano de estudo para compartilhar com seus grupos
              </p>
              <button
                onClick={() => router.push('/pastor/create-plan')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Criar Primeiro Plano
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {studyPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {plan.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {plan.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{plan.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{plan.totalLessons} lições</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{plan.activeMembers} membros</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {plan.completionRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${plan.completionRate}%` }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/pastor/plans/${plan.id}`)}
                      className="flex-1 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => router.push(`/pastor/plans/${plan.id}/edit`)}
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este plano?')) {
                          // TODO: Implementar exclusão
                          console.log('Excluir plano:', plan.id);
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Atividade Recente
            </h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  João Silva completou "Fundamentos da Fé"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Há 2 horas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  3 novos membros entraram no grupo "Jovens"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Há 5 horas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Plano "Salmos de Louvor" atingiu 50% de conclusão
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ontem
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
