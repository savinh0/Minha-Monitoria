"use client";
import React, { useState } from 'react';
import { Discipline, CandidateSubmission } from '@/lib/store';
import { X, UserCheck, Calculator, EyeOff, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  disciplines: Discipline[];
  defaultDisciplineId?: string;
  onSubmitScore: (submission: Omit<CandidateSubmission, 'id' | 'trend' | 'submittedAt'>) => void;
}

export default function StudentFormModal({
  isOpen,
  onClose,
  disciplines,
  defaultDisciplineId,
  onSubmitScore,
}: StudentFormModalProps) {
  const [disciplineId, setDisciplineId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [subjectScore, setSubjectScore] = useState<string>('9.0');
  const [ira, setIra] = useState<string>('9.0');
  const [modalityPreference, setModalityPreference] = useState<'remunerada' | 'voluntaria' | 'ambas'>('ambas');

  React.useEffect(() => {
    if (isOpen) {
      setDisciplineId(defaultDisciplineId || disciplines[0]?.id || '');
      setCandidateName('');
      setIsAnonymous(false);
      setSubjectScore('9.0');
      setIra('9.0');
      setModalityPreference('ambas');
    }
  }, [isOpen, defaultDisciplineId, disciplines]);

  if (!isOpen) return null;

  const numSubject = Math.min(10, Math.max(0, parseFloat(subjectScore) || 0));
  const numIra = Math.min(10, Math.max(0, parseFloat(ira) || 0));
  const calculatedFinalScore = numSubject + numIra;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disciplineId) return;

    onSubmitScore({
      disciplineId,
      candidateName: isAnonymous ? 'Candidato Anônimo' : candidateName.trim() || 'Candidato Anônimo',
      isAnonymous,
      subjectScore: numSubject,
      ira: numIra,
      finalScore: calculatedFinalScore,
      modalityPreference,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-sisuBlue text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Calculator size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Simular Minha Nota na Monitoria</h3>
              <p className="text-xs text-blue-100">Insira suas notas para calcular sua posição estimada</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* SELEÇÃO DA DISCIPLINA */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Selecione a Disciplina da Monitoria
            </label>
            <select
              value={disciplineId}
              onChange={(e) => setDisciplineId(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-sisuBlue/50"
            >
              {disciplines.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.course}) — {d.vagasRemuneradas} Remunerada(s) / {d.vagasVoluntarias} Voluntária(s)
                </option>
              ))}
            </select>
          </div>

          {/* NOME E OPÇÃO DE ANÔNIMO */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Seu Nome (Visível na lista)
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-gray-600">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300 text-sisuBlue focus:ring-sisuBlue"
                />
                <EyeOff size={14} className="text-gray-500" /> Manter-se Anônimo
              </label>
            </div>
            <input
              type="text"
              placeholder={isAnonymous ? "Sua identidade será oculta como 'Candidato Anônimo'" : "Ex: Sávio ou João da Silva"}
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              disabled={isAnonymous}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sisuBlue/50 ${
                isAnonymous ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* NOTAS: MATÉRIA E IRA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Nota na Matéria (0 a 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={subjectScore}
                onChange={(e) => setSubjectScore(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-sisuBlue/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Seu IRA (0 a 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={ira}
                onChange={(e) => setIra(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-sisuBlue/50"
              />
            </div>
          </div>

          {/* PREFERÊNCIA DE MODALIDADE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Preferência de Vaga
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModalityPreference('remunerada')}
                className={`py-2 px-2 rounded-lg border text-center transition-all ${
                  modalityPreference === 'remunerada' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                Apenas Remunerada
              </button>
              <button
                type="button"
                onClick={() => setModalityPreference('voluntaria')}
                className={`py-2 px-2 rounded-lg border text-center transition-all ${
                  modalityPreference === 'voluntaria' ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                Apenas Voluntária
              </button>
              <button
                type="button"
                onClick={() => setModalityPreference('ambas')}
                className={`py-2 px-2 rounded-lg border text-center transition-all ${
                  modalityPreference === 'ambas' ? 'bg-blue-50 border-blue-500 text-blue-800 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                Ambas (Qualquer uma)
              </button>
            </div>
          </div>

          {/* DISPLAY DA NOTA FINAL CALCULADA */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Sua Nota Final Simulação</span>
              <p className="text-xs text-gray-500">Média ({numSubject.toFixed(1)}) + IRA ({numIra.toFixed(1)})</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-sisuBlue">{calculatedFinalScore.toFixed(2)}</span>
              <span className="text-xs text-gray-500 font-medium ml-1">/ 20.0</span>
            </div>
          </div>

          {/* DISCLAIMER NO MODAL */}
          <p className="text-[11px] text-gray-500 flex items-start gap-1">
            <ShieldCheck size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
            Dados protegidos por criptografia de controle dual. Esta simulação é não-oficial e mantida pelos alunos.
          </p>

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
              className="px-6 py-2.5 text-sm font-bold text-white bg-sisuBlue hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Enviar Minha Nota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
