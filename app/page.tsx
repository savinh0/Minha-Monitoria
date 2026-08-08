"use client";
import React, { useState, useEffect } from 'react';
import Ranking from "@/components/Ranking";
import AdminDashboard from "@/components/AdminDashboard";
import AdminModal from "@/components/AdminModal";
import StudentFormModal from "@/components/StudentFormModal";
import { 
  Discipline, 
  CandidateSubmission, 
  getStoredDisciplines, 
  saveStoredDisciplines, 
  getStoredSubmissions, 
  saveStoredSubmissions 
} from "@/lib/store";
import { AlertTriangle, ShieldCheck, Lock, PlusCircle, Shield, RefreshCw } from 'lucide-react';

export default function Home() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [activeDisciplineId, setActiveDisciplineId] = useState<string>('');

  // Modais State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentModalDefaultDisc, setStudentModalDefaultDisc] = useState<string>('');

  // Carregar dados no client-side
  useEffect(() => {
    const loadedDisc = getStoredDisciplines();
    const loadedSub = getStoredSubmissions();

    setDisciplines(loadedDisc);
    setSubmissions(loadedSub);

    if (loadedDisc.length > 0) {
      setActiveDisciplineId(loadedDisc[0].id);
    }
  }, []);

  // --- AÇÕES ADMIN ---
  const handleAddDiscipline = (discData: Omit<Discipline, 'id' | 'createdAt'>) => {
    const newDisc: Discipline = {
      ...discData,
      id: `disc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...disciplines, newDisc];
    setDisciplines(updated);
    saveStoredDisciplines(updated);
    setActiveDisciplineId(newDisc.id);
  };

  const handleUpdateDiscipline = (id: string, updatedFields: Partial<Discipline>) => {
    const updated = disciplines.map(d => d.id === id ? { ...d, ...updatedFields } : d);
    setDisciplines(updated);
    saveStoredDisciplines(updated);
  };

  const handleDeleteDiscipline = (id: string) => {
    const updatedDisc = disciplines.filter(d => d.id !== id);
    const updatedSub = submissions.filter(s => s.disciplineId !== id);

    setDisciplines(updatedDisc);
    setSubmissions(updatedSub);
    saveStoredDisciplines(updatedDisc);
    saveStoredSubmissions(updatedSub);

    if (activeDisciplineId === id && updatedDisc.length > 0) {
      setActiveDisciplineId(updatedDisc[0].id);
    }
  };

  const handleClearSubmissions = (disciplineId: string) => {
    const updated = submissions.filter(s => s.disciplineId !== disciplineId);
    setSubmissions(updated);
    saveStoredSubmissions(updated);
  };

  // --- AÇÃO ALUNO ---
  const handleStudentSubmitScore = (subData: Omit<CandidateSubmission, 'id' | 'trend' | 'submittedAt'>) => {
    const newSub: CandidateSubmission = {
      ...subData,
      id: `sub-${Date.now()}`,
      trend: 'up',
      submittedAt: new Date().toISOString(),
    };

    // Substitui se o mesmo nome/aluno já enviou para a mesma disciplina
    const filteredExisting = submissions.filter(
      s => !(s.disciplineId === subData.disciplineId && s.candidateName.toLowerCase() === subData.candidateName.toLowerCase() && !s.isAnonymous)
    );

    const updated = [newSub, ...filteredExisting];
    setSubmissions(updated);
    saveStoredSubmissions(updated);

    setActiveDisciplineId(subData.disciplineId);
  };

  const handleOpenStudentModal = (discId?: string) => {
    setStudentModalDefaultDisc(discId || activeDisciplineId || (disciplines[0]?.id || ''));
    setIsStudentModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* HEADER / NAVIGATION DE BARRAS */}
      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-sisuBlue text-white font-black text-xl px-3 py-1.5 rounded-xl">
            MM
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg tracking-tight">Minha Monitoria</h1>
            <p className="text-xs text-gray-500">Simulador Comunitário & Não-Oficial de Parciais</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenStudentModal()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center gap-2"
          >
            <PlusCircle size={16} /> Simular Minha Nota
          </button>

          {!isAdminMode ? (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
            >
              <Lock size={14} /> Modo Admin (Sávio)
            </button>
          ) : (
            <button
              onClick={() => setIsAdminMode(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
            >
              <Shield size={14} /> Painel Admin Ativo
            </button>
          )}
        </div>
      </div>

      {/* AVISO LEGAL E DE ISENÇÃO DE RESPONSABILIDADE (DISCLAIMER) */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-l-4 border-orange-500 p-5 rounded-r-2xl shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wider">
              Aviso Importante: Sistema Independente e Não-Oficial
            </h3>
            <p className="text-xs text-orange-800 leading-relaxed">
              Este aplicativo é um <strong>simulador comunitário alimentado pelos alunos</strong> (estilo <em>Olho na Vaga</em>) e <strong>NÃO</strong> possui qualquer vínculo oficial com a universidade ou com as comissões de monitoria. 
              As posições e notas de corte aqui exibidas são estimativas baseadas exclusivamente nos dados auto-declarados pelos participantes. 
              <strong>A classificação final oficial depende unicamente do edital publicado pela universidade.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* PAINEL ADMIN (APARECE SE ATIVADO) */}
      {isAdminMode && (
        <AdminDashboard
          disciplines={disciplines}
          submissions={submissions}
          onAddDiscipline={handleAddDiscipline}
          onUpdateDiscipline={handleUpdateDiscipline}
          onDeleteDiscipline={handleDeleteDiscipline}
          onClearSubmissions={handleClearSubmissions}
          onExitAdmin={() => setIsAdminMode(false)}
        />
      )}

      {/* SEÇÃO PRINCIPAL DE RANQUEAMENTO E PARCIAIS */}
      <section>
        <Ranking
          disciplines={disciplines}
          submissions={submissions}
          activeDisciplineId={activeDisciplineId}
          onSelectDiscipline={setActiveDisciplineId}
          onOpenSubmitModal={handleOpenStudentModal}
        />
      </section>

      {/* FOOTER COM SEGURANÇA E LICENÇA OPEN SOURCE */}
      <footer className="text-center text-xs text-gray-500 space-y-2 pt-8 border-t border-gray-200">
        <div className="flex justify-center items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Arquitetura de Segurança com Criptografia AES-256 e Controle Dual (XOR)</span>
        </div>
        <p>Minha Monitoria — Projeto de Código Aberto (Open Source) para a comunidade acadêmica.</p>
      </footer>

      {/* MODAIS */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => setIsAdminMode(true)}
      />

      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        disciplines={disciplines}
        defaultDisciplineId={studentModalDefaultDisc}
        onSubmitScore={handleStudentSubmitScore}
      />
    </div>
  );
}
