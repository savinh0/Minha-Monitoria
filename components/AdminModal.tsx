"use client";
import React, { useState } from 'react';
import { X, Lock, Key, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminModal({ isOpen, onClose, onSuccess }: AdminModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha simples de acesso ao modo admin (Customizável pelo Sávio)
    if (password === 'admin' || password === 'admin123' || password === 'ufdpar') {
      setError('');
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError('Senha de administrador incorreta. Tente "admin" ou "admin123".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Acesso Administrador</h3>
              <p className="text-xs text-slate-300">Gerenciamento de disciplinas e vagas</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Senha do Administrador (Sávio)
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Digite a senha de admin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                autoFocus
              />
              <Key size={18} className="absolute left-3 top-3 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Dica para teste: digite <strong>admin</strong></p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow transition-colors flex items-center gap-2"
            >
              <Lock size={14} /> Entrar no Modo Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
