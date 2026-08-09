"use client";
import React, { useState } from 'react';
import { Discipline, CandidateSubmission } from '@/lib/store';
import { X, Calculator, EyeOff, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  disciplines: Discipline[];
  submissions: CandidateSubmission[];
  defaultDisciplineId?: string;
  userEmail: string | null;
  userId: string | null;
  onSubmitScore: (submission: Omit<CandidateSubmission, 'id' | 'trend' | 'submittedAt'>) => void;
}

export default function StudentFormModal({
  isOpen,
  onClose,
  disciplines,
  submissions,
  defaultDisciplineId,
  userEmail,
  userId,
  onSubmitScore,
}: StudentFormModalProps) {
  const [disciplineId, setDisciplineId] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [subjectScore, setSubjectScore] = useState<string>('9.0');
  const [ira, setIra] = useState<string>('9.0000');
  const [isSubjectLocked, setIsSubjectLocked] = useState(false);
  const [isIraLocked, setIsIraLocked] = useState(false);
  const [modalityPreference, setModalityPreference] = useState<'remunerada' | 'voluntaria'>('remunerada');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const initialDisc = defaultDisciplineId || disciplines[0]?.id || '';
      setDisciplineId(initialDisc);
      setIsAnonymous(false);
      setModalityPreference('remunerada');
      setErrorMsg(null);
      setShowConfirm(false);

      if (userId && submissions) {
        const userSubs = submissions.filter(s => s.userId === userId);
        const currentDiscSub = userSubs.find(s => s.disciplineId === initialDisc);

        if (currentDiscSub) {
          setSubjectScore(currentDiscSub.subjectScore.toString());
          setIra(currentDiscSub.ira.toFixed(4));
          setIsSubjectLocked(true);
          setIsIraLocked(true);
          setModalityPreference(currentDiscSub.modalityPreference);
          setIsAnonymous(currentDiscSub.isAnonymous);
        } else if (userSubs.length > 0) {
          setSubjectScore('9.0');
          setIra(userSubs[0].ira.toFixed(4));
          setIsSubjectLocked(false);
          setIsIraLocked(true);
        } else {
          setSubjectScore('9.0');
          setIra('9.0000');
          setIsSubjectLocked(false);
          setIsIraLocked(false);
        }
      }
    }
  }, [isOpen, defaultDisciplineId, disciplines, submissions, userId]);

  const handleDisciplineChange = (newDiscId: string) => {
    setDisciplineId(newDiscId);
    if (userId && submissions) {
      const userSubs = submissions.filter(s => s.userId === userId);
      const currentDiscSub = userSubs.find(s => s.disciplineId === newDiscId);

      if (currentDiscSub) {
        setSubjectScore(currentDiscSub.subjectScore.toString());
        setIra(currentDiscSub.ira.toFixed(4));
        setIsSubjectLocked(true);
        setIsIraLocked(true);
        setModalityPreference(currentDiscSub.modalityPreference);
        setIsAnonymous(currentDiscSub.isAnonymous);
      } else if (userSubs.length > 0) {
        setSubjectScore('9.0');
        setIra(userSubs[0].ira.toFixed(4));
        setIsSubjectLocked(false);
        setIsIraLocked(true);
      } else {
        setSubjectScore('9.0');
        setIra('9.0000');
        setIsSubjectLocked(false);
        setIsIraLocked(false);
      }
    }
  };

  if (!isOpen) return null;

  // Extrair nome do e-mail
  const candidateBaseName = userEmail ? userEmail.split('@')[0] : 'Desconhecido';
  const finalCandidateName = isAnonymous ? 'Candidato Anônimo' : candidateBaseName;

  const validateInputs = () => {
    // 1. Limites 0-10
    const numSubj = parseFloat(subjectScore.replace(',', '.'));
    const numIra = parseFloat(ira.replace(',', '.'));
    if (isNaN(numSubj) || numSubj < 0 || numSubj > 10) return "Nota da matéria deve estar entre 0 e 10.";
    if (isNaN(numIra) || numIra < 0 || numIra > 10) return "IRA deve estar entre 0 e 10.";

    // 2. 4 casas decimais obrigatórias no IRA
    // Aceita coisas como "9.1234" ou "10.0000"
    const iraRegex = /^([0-9]|10)[.,][0-9]{4}$/;
    if (!iraRegex.test(ira)) {
      return "O IRA deve possuir OBRIGATORIAMENTE 4 casas decimais (Ex: 9.1234 ou 9,1234).";
    }

    // 3. Consistência de vírgula/ponto
    const hasCommaSubj = subjectScore.includes(',');
    const hasCommaIra = ira.includes(',');
    const hasDotSubj = subjectScore.includes('.');
    const hasDotIra = ira.includes('.');

    if ((hasCommaSubj && hasDotIra) || (hasDotSubj && hasCommaIra)) {
      return "Use o mesmo separador decimal para a Nota e para o IRA (ou ambos com ponto, ou ambos com vírgula).";
    }

    return null;
  };

  const handleFirstSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateInputs();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg(null);
    setShowConfirm(true);
  };

  const handleFinalSubmit = () => {
    if (!disciplineId) return;

    const numSubj = parseFloat(subjectScore.replace(',', '.'));
    const numIra = parseFloat(ira.replace(',', '.'));

    onSubmitScore({
      disciplineId,
      candidateName: finalCandidateName,
      isAnonymous,
      subjectScore: numSubj,
      ira: numIra,
      finalScore: numSubj + numIra,
      modalityPreference,
    });

    onClose();
  };

  const parsedSubject = parseFloat(subjectScore.replace(',', '.')) || 0;
  const parsedIra = parseFloat(ira.replace(',', '.')) || 0;
  const calculatedFinalScore = parsedSubject + parsedIra;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        
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

        {!showConfirm ? (
          <form onSubmit={handleFirstSubmit} className="p-6 space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Selecione a Disciplina da Monitoria
              </label>
              <select
                value={disciplineId}
                onChange={(e) => handleDisciplineChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-sisuBlue/50"
              >
                {disciplines.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.course}) — {d.vagasRemuneradas} Rem. / {d.vagasVoluntarias} Vol.
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Sua Identidade
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
              <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed flex items-center">
                {finalCandidateName} <span className="ml-2 text-xs opacity-70">({userEmail})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Nota na Matéria {isSubjectLocked && <span className="text-red-500 ml-1">(Travado)</span>}
                </label>
                <input
                  type="text"
                  value={subjectScore}
                  onChange={(e) => setSubjectScore(e.target.value)}
                  placeholder="Ex: 9.5"
                  required
                  disabled={isSubjectLocked}
                  className={`w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-sisuBlue/50 ${isSubjectLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Seu IRA (4 casas) {isIraLocked && <span className="text-red-500 ml-1">(Travado)</span>}
                </label>
                <input
                  type="text"
                  value={ira}
                  onChange={(e) => setIra(e.target.value)}
                  placeholder="Ex: 9.1234"
                  required
                  disabled={isIraLocked}
                  className={`w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-sisuBlue/50 ${isIraLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Preferência de Vaga
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
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
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Sua Nota Final Simulação</span>
                <p className="text-xs text-gray-500">Média ({parsedSubject.toFixed(1)}) + IRA ({parsedIra.toFixed(4)})</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-sisuBlue">{calculatedFinalScore.toFixed(4)}</span>
                <span className="text-xs text-gray-500 font-medium ml-1">/ 20</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-start gap-2">
                <AlertTriangle size={16} className="flex-shrink-0" />
                <p>{errorMsg}</p>
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
                className="px-6 py-2.5 text-sm font-bold text-white bg-sisuBlue hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Revisar Envio
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="text-amber-900 font-bold text-sm uppercase tracking-wider">Dupla Verificação: IRA Imutável</h4>
                <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                  Confirme com atenção as suas notas. <strong>A sua Nota da Matéria e o valor do seu IRA não poderão ser alterados em hipótese alguma</strong> após o primeiro envio. Apenas a modalidade poderá ser trocada.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p><strong>Identidade:</strong> {finalCandidateName}</p>
              <p><strong>Nota na Matéria:</strong> {subjectScore}</p>
              <p><strong>IRA:</strong> {ira}</p>
              <p><strong>Modalidade:</strong> {modalityPreference}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Voltar e Corrigir
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 text-sm font-bold text-white bg-sisuBlue hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <CheckCircle2 size={16} /> Confirmar e Enviar Definitivo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
