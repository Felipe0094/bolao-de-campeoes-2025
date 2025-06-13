import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });

      if (error) {
        console.error('Erro ao fazer login:', error.message);
        return;
      }

      if (data) {
        setSuccessMessage('Login efetuado com sucesso!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 600); // Reduzido para 600ms
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Bolão de Campeões 2025</h1>
          <p className="mt-2 text-gray-600">Faça login para participar</p>
        </div>

        {successMessage && (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
            {successMessage}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Entrar com Google
        </button>
      </div>
    </div>
  );
};

export default Auth; 