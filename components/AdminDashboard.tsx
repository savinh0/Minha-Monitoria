"use client";
import React, { useState } from 'react';
import { Discipline, CandidateSubmission } from '@/lib/store';
import { Plus, Edit2, Trash2, Shield, BookOpen, DollarSign, Award, RefreshCw, X, Check, Lock } from 'lucide-react';

interface AdminDashboardProps {
  disciplines: Discipline[];
  submissions: CandidateSubmission[];
  onAddDiscipline: (discipline: Omit<Discipline, 'id' | 'createdAt'>) => void;
  onUpdateDiscipline: (id: string, updated: Partial<Discipline>) => void;
  onDeleteDiscipline: (id: string) => void;
  onClearSubmissions: (disciplineId: string) => void;
  onExitAdmin: () => void;
}

export default function AdminDashboard({
  disciplines,
  submissions,
  onAddDiscipline,
  onUpdateDiscipline,
  onDeleteDiscipline,
  onClearSubmissions,
  onExitAdmin,
}: AdminDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [vagasRemuneradas, setVagasRemuneradas] = useState<number>(1);
  const [vagasVoluntarias, setVagasVoluntarias] = useState<number>(1);
  const [status, setStatus] = useState<'abertas' | 'encerradas'>('abertas');

  const handleOpenAdd = () => {
    setName('');
    setCourse('Medicina');
    setVagasRemuneradas(2);
    setVagasVoluntarias(2);
    setStatus('abertas');
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleOpenEdit = (disc: Discipline) => {
    setEditingId(disc.id);
    setName(disc.name);
    setCourse(disc.course);
    setVagasRemuneradas(disc.vagasRemuneradas);
    setVagasVoluntarias(disc.vagasVoluntarias);
    setStatus(disc.status);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !course.trim()) return;

    if (editingId) {
      onUpdateDiscipline(editingId, {
        name,
        course,
        vagasRemuneradas: Number(vagasRemuneradas),
        vagasVoluntarias: Number(vagasVoluntarias),
        status,
      });
    } else {
      onAddDiscipline({
        name,
        course,
        vagasRemuneradas: Number(vagasRemuneradas),
        vagasVoluntarias: Number(vagasVoluntarias),
        status,
      });
    }

    setShowAddForm(false);
    setEditingId(null);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-6">
      
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Painel Administrativo do Criador</h2>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold">
                Sávio (Admin)
              </span>
            </div>
            <p className="text-xs text-slate-400">Cadastre disciplinas, edite vagas remuneradas e voluntárias ou resete dados.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Plus size={16} /> Nova Disciplina
          </button>
          <button
            onClick={onExitAdmin}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <X size={16} /> Sair do Admin
          </button>
        </div>
      </div>

      {/* FORMULÁRIO DE ADIÇÃO/EDIÇÃO (COLLAPSIBLE / MODAL INLINE) */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/90 p-5 rounded-xl border border-slate-700 space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2">
              <BookOpen size={16} /> {editingId ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina para Monitoria'}
            </h3>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Disciplina</label>
              <input
                type="text"
                placeholder="Ex: Histologia Médica"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Curso / Departamento</label>
              <input
                type="text"
                placeholder="Ex: Medicina, Biomedicina, Enfermagem"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                <DollarSign size={14} /> Vagas Remuneradas (Bolsa)
              </label>
              <input
                type="number"
                min="0"
                value={vagasRemuneradas}
                onChange={(e) => setVagasRemuneradas(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1">
                <Award size={14} /> Vagas Voluntárias (Sem Bolsa)
              </label>
              <input
                type="number"
                min="0"
                value={vagasVoluntarias}
                onChange={(e) => setVagasVoluntarias(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status das Inscrições na Simulação</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'abertas' | 'encerradas')}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="abertas">🟢 Inscrições Abertas para Alunos</option>
                <option value="encerradas">🔴 Inscrições Encerradas (Edital Finalizado)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg text-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-lg text-white shadow"
            >
              {editingId ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE DISCIPLINAS GERENCIADAS */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Disciplinas Ativas ({disciplines.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disciplines.map((disc) => {
            const count = submissions.filter(s => s.disciplineId === disc.id).length;

            return (
              <div key={disc.id} className="bg-slate-800 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-600 transition-colors">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base text-white">{disc.name}</h4>
                      <p className="text-xs text-slate-400">{disc.course}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      disc.status === 'abertas' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {disc.status === 'abertas' ? 'Abertas' : 'Encerradas'}
                    </span>
                  </div>

                  {/* VAGAS INFO */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/50 text-xs">
                    <div className="bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-lg text-emerald-300">
                      <span className="block font-bold text-base">{disc.vagasRemuneradas}</span>
                      <span className="text-[10px] uppercase text-emerald-400">Vagas Remuneradas</span>
                    </div>
                    <div className="bg-amber-950/40 border border-amber-800/40 p-2 rounded-lg text-amber-300">
                      <span className="block font-bold text-base">{disc.vagasVoluntarias}</span>
                      <span className="text-[10px] uppercase text-amber-400">Vagas Voluntárias</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Inscritos na simulação: <strong>{count} alunos</strong>
                  </p>
                </div>

                {/* AÇÕES DA DISCIPLINA */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                  <button
                    onClick={() => onClearSubmissions(disc.id)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    title="Limpar submissões de teste"
                  >
                    <RefreshCw size={12} /> Resete ({count})
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(disc)}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 text-blue-300 rounded-lg transition-colors"
                      title="Editar Vagas ou Nome"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteDiscipline(disc.id)}
                      className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg border border-red-800/40 transition-colors"
                      title="Excluir Disciplina"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
