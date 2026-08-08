"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validação estrita do domínio institucional
    if (!email.toLowerCase().endsWith('@ufdpar.edu.br')) {
      setMessage({ type: 'error', text: 'Você deve usar um e-mail institucional (@ufdpar.edu.br).' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        }
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Um link mágico foi enviado para o seu e-mail!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Ocorreu um erro ao enviar o link.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-sisuBlue text-white font-black text-3xl px-4 py-2 rounded-xl shadow-lg">
            MM
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Minha Monitoria
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Acesso restrito à comunidade acadêmica
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                E-mail Institucional
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@ufdpar.edu.br"
                  className="focus:ring-sisuBlue focus:border-sisuBlue block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border bg-gray-50 text-gray-900 font-medium"
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                {message.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <ShieldCheck className="w-5 h-5 flex-shrink-0" />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-sisuBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sisuBlue transition-all disabled:opacity-70"
              >
                {loading ? 'Enviando...' : 'Receber Link Mágico'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Como funciona?</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500 text-center">
              Você não precisa de senha. Digite seu e-mail institucional e nós enviaremos um link de acesso direto e seguro para a sua caixa de entrada.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
