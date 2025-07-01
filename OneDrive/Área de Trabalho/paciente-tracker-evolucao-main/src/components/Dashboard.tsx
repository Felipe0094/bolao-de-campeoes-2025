
import React from 'react';
import { Users, TrendingUp, Calendar, FileText, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock data - será substituído por dados reais posteriormente
  const stats = {
    totalPatients: 12,
    measurementsThisWeek: 8,
    pendingConsultations: 3,
    completedGoals: 5
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Bem-vinda, <span className="text-green-600">Gabriela!</span>
        </h1>
        <p className="text-lg text-gray-600">
          Acompanhe a evolução dos seus pacientes de forma simples e eficiente
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medições esta Semana</p>
              <p className="text-3xl font-bold text-blue-600">{stats.measurementsThisWeek}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultas Pendentes</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingConsultations}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Metas Alcançadas</p>
              <p className="text-3xl font-bold text-purple-600">{stats.completedGoals}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/add-patient"
            className="group bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <UserPlus className="h-6 w-6" />
              <span className="font-semibold">Cadastrar Paciente</span>
            </div>
            <p className="text-sm text-green-100 mt-2">
              Adicione um novo paciente ao sistema
            </p>
          </Link>

          <Link
            to="/patients"
            className="group bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6" />
              <span className="font-semibold">Ver Pacientes</span>
            </div>
            <p className="text-sm text-blue-100 mt-2">
              Acesse a lista completa de pacientes
            </p>
          </Link>

          <Link
            to="/import-csv"
            className="group bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6" />
              <span className="font-semibold">Importar CSV</span>
            </div>
            <p className="text-sm text-purple-100 mt-2">
              Importe dados da balança Tanita
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Atividade Recente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                Nova medição adicionada para Maria Silva
              </p>
              <p className="text-xs text-gray-500">Há 2 horas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                Dados da Tanita importados para João Santos
              </p>
              <p className="text-xs text-gray-500">Há 4 horas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                Novo paciente cadastrado: Ana Costa
              </p>
              <p className="text-xs text-gray-500">Ontem</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
