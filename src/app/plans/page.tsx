'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Sparkles, Users, BookOpen, Crown, Zap } from 'lucide-react';

const PLANS = [
  {
    id: 'premium',
    name: 'Premium',
    price: 9.90,
    icon: Crown,
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Estudo Permanente ilimitado',
      'Zero anúncios',
      'Modo artístico com ilustrações',
      'Sugestões ilimitadas de luz',
      'Leitura offline',
      'Sincronização entre dispositivos',
      'Estatísticas detalhadas',
      'Trilhas avançadas de estudo',
    ],
    highlight: 'Perfeito para seu crescimento espiritual',
  },
  {
    id: 'pastor',
    name: 'Pastor',
    price: 19.90,
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      'Tudo do plano Premium',
      'Criar grupos de estudo',
      'Convidar outros usuários',
      'Gerenciar comunidades',
      'Compartilhar trilhas personalizadas',
      'Relatórios de progresso do grupo',
      'Ferramentas de liderança',
      'Suporte prioritário',
    ],
    highlight: 'Ideal para líderes e pastores',
    popular: true,
  },
];

export default function PlansPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Aqui você pode adicionar lógica de pagamento/checkout
    alert(`Plano ${planId === 'premium' ? 'Premium' : 'Pastor'} selecionado! Em breve você será redirecionado para o pagamento.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Escolha seu Plano
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Desbloqueie todo o potencial da sua jornada espiritual
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-purple-500 dark:border-purple-400 scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-sm font-bold shadow-lg flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Mais Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {plan.highlight}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">R$</span>
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">/mês</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                    selectedPlan === plan.id
                      ? `bg-gradient-to-r ${plan.gradient} shadow-2xl scale-105`
                      : `bg-gradient-to-r ${plan.gradient} hover:shadow-xl hover:scale-105`
                  }`}
                >
                  {selectedPlan === plan.id ? 'Plano Selecionado' : 'Escolher Plano'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Compare os Planos
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">
                    Recurso
                  </th>
                  <th className="text-center py-4 px-4 text-gray-900 dark:text-white font-semibold">
                    Premium
                  </th>
                  <th className="text-center py-4 px-4 text-gray-900 dark:text-white font-semibold">
                    Pastor
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    Estudo Permanente
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    Zero anúncios
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    Criar grupos
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-gray-400">—</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    Convidar usuários
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-gray-400">—</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    Gerenciar comunidades
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-gray-400">—</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    Ferramentas de liderança
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-gray-400">—</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Dúvidas?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Entre em contato conosco para saber mais sobre os planos
          </p>
          <button
            onClick={() => router.push('/settings')}
            className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Ir para Configurações
          </button>
        </div>
      </div>
    </div>
  );
}
