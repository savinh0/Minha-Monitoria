"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Ranking from "@/components/Ranking";
import AdminDashboard from "@/components/AdminDashboard";
import StudentFormModal from "@/components/StudentFormModal";
import { Discipline, CandidateSubmission } from "@/lib/store";
import { AlertTriangle, ShieldCheck, Settings, PlusCircle, Shield, LogOut } from 'lucide-react';

export default function Home() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [activeDisciplineId, setActiveDisciplineId] = useState<string>('');
  
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentModalDefaultDisc, setStudentModalDefaultDisc] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // 1. Verificar Sessão Auth
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email || null;
      const id = session?.user?.id || null;
      setUserEmail(email);
      setUserId(id);
      
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (email && email === adminEmail) {
        setIsAdmin(true);
      }

      // 2. Buscar Dados
      const { data: discData } = await supabase.from('disciplines').select('*').order('created_at', { ascending: true });
      const { data: subData } = await supabase.from('submissions').select('*').order('submitted_at', { ascending: false });

      // Converter camelCase/snake_case do banco
      const formattedDisc: Discipline[] = (discData || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        course: d.course,
        vagasRemuneradas: d.vagas_remuneradas,
        vagasVoluntarias: d.vagas_voluntarias,
        status: d.status,
        createdAt: d.created_at
      }));

      const formattedSub: CandidateSubmission[] = (subData || []).map((s: any) => ({
        id: s.id,
        disciplineId: s.discipline_id,
        userId: s.user_id,
        candidateName: s.candidate_name,
        isAnonymous: s.is_anonymous,
        subjectScore: Number(s.subject_score),
        ira: Number(s.ira),
        finalScore: Number(s.final_score),
        modalityPreference: s.modality_preference,
        trend: s.trend,
        submittedAt: s.submitted_at
      }));

      setDisciplines(formattedDisc);
      setSubmissions(formattedSub);
      if (formattedDisc.length > 0) setActiveDisciplineId(formattedDisc[0].id);
      
      setLoading(false);
    }

    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // --- AÇÕES ADMIN ---
  const handleAddDiscipline = async (discData: Omit<Discipline, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase.from('disciplines').insert([{
      name: discData.name,
      course: discData.course,
      vagas_remuneradas: discData.vagasRemuneradas,
      vagas_voluntarias: discData.vagasVoluntarias,
      status: discData.status
    }]).select();

    if (!error && data) {
      const newDisc: Discipline = {
        id: data[0].id,
        name: data[0].name,
        course: data[0].course,
        vagasRemuneradas: data[0].vagas_remuneradas,
        vagasVoluntarias: data[0].vagas_voluntarias,
        status: data[0].status,
        createdAt: data[0].created_at
      };
      setDisciplines([...disciplines, newDisc]);
      setActiveDisciplineId(newDisc.id);
    }
  };

  const handleUpdateDiscipline = async (id: string, updatedFields: Partial<Discipline>) => {
    const updatePayload: any = {};
    if (updatedFields.name) updatePayload.name = updatedFields.name;
    if (updatedFields.course) updatePayload.course = updatedFields.course;
    if (updatedFields.vagasRemuneradas !== undefined) updatePayload.vagas_remuneradas = updatedFields.vagasRemuneradas;
    if (updatedFields.vagasVoluntarias !== undefined) updatePayload.vagas_voluntarias = updatedFields.vagasVoluntarias;
    if (updatedFields.status) updatePayload.status = updatedFields.status;

    const { error } = await supabase.from('disciplines').update(updatePayload).eq('id', id);
    if (!error) {
      setDisciplines(disciplines.map(d => d.id === id ? { ...d, ...updatedFields } : d));
    }
  };

  const handleDeleteDiscipline = async (id: string) => {
    const { error } = await supabase.from('disciplines').delete().eq('id', id);
    if (!error) {
      const updatedDisc = disciplines.filter(d => d.id !== id);
      setDisciplines(updatedDisc);
      setSubmissions(submissions.filter(s => s.disciplineId !== id));
      if (activeDisciplineId === id && updatedDisc.length > 0) setActiveDisciplineId(updatedDisc[0].id);
    }
  };

  const handleClearSubmissions = async (disciplineId: string) => {
    // Isso deve ser feito via API segura para deletar batch se necessário, ou mock local
    const { error } = await supabase.from('submissions').delete().eq('discipline_id', disciplineId);
    if (!error) {
      setSubmissions(submissions.filter(s => s.disciplineId !== disciplineId));
    }
  };

  // --- AÇÃO ALUNO ---
  const handleStudentSubmitScore = async (subData: Omit<CandidateSubmission, 'id' | 'trend' | 'submittedAt'>) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return;

    // Verificar se já existe ALGUMA submissão desse aluno no sistema INTEIRO (limite de 1 monitoria por aluno)
    const existing = submissions.find(s => s.userId === userId);

    if (existing) {
      // É uma atualização. O trigger do Supabase vai checar o IRA no banco.
      // Se ele trocou de matéria, a discipline_id será atualizada e ele sairá do ranking anterior.
      const { data, error } = await supabase.from('submissions').update({
        discipline_id: subData.disciplineId,
        subject_score: subData.subjectScore,
        ira: subData.ira,
        final_score: subData.finalScore,
        modality_preference: subData.modalityPreference,
        is_anonymous: subData.isAnonymous
      }).eq('id', existing.id).select();

      if (error) {
        alert("Erro ao enviar: " + error.message);
        return;
      }
      if (data) {
        const discName = disciplines.find(d => d.id === subData.disciplineId)?.name || 'a monitoria';
        const modName = subData.modalityPreference === 'remunerada' ? 'Remunerada' : 'Voluntária';
        alert(`Sua simulação para ${discName} (Vaga ${modName}) foi salva!\nVocê pode editar a modalidade depois se quiser, a última é a que vale. No entanto, sua posição parcial só será atualizada no próximo horário de corte de hoje.`);
        const updatedSub: CandidateSubmission = {
          ...existing,
          ...subData,
        };
        setSubmissions(submissions.map(s => s.id === existing.id ? updatedSub : s));
      }
    } else {
      // Nova Inserção
      const { data, error } = await supabase.from('submissions').insert([{
        discipline_id: subData.disciplineId,
        user_id: userId,
        candidate_name: subData.candidateName,
        is_anonymous: subData.isAnonymous,
        subject_score: subData.subjectScore,
        ira: subData.ira,
        final_score: subData.finalScore,
        modality_preference: subData.modalityPreference
      }]).select();

      if (error) {
        alert("Erro ao enviar: " + error.message);
        return;
      }
      
      if (data) {
        const discName = disciplines.find(d => d.id === subData.disciplineId)?.name || 'a monitoria';
        const modName = subData.modalityPreference === 'remunerada' ? 'Remunerada' : 'Voluntária';
        alert(`Sua simulação para ${discName} (Vaga ${modName}) foi salva!\nVocê pode editar a modalidade depois se quiser, a última é a que vale. No entanto, sua posição parcial só será atualizada no próximo horário de corte de hoje.`);
        const newSub: CandidateSubmission = {
          ...subData,
          id: data[0].id,
          userId: userId,
          trend: 'same',
          submittedAt: data[0].submitted_at
        };
        setSubmissions([newSub, ...submissions]);
      }
    }

    setActiveDisciplineId(subData.disciplineId);
  };

  const handleOpenStudentModal = (discId?: string) => {
    setStudentModalDefaultDisc(discId || activeDisciplineId || (disciplines[0]?.id || ''));
    setIsStudentModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Carregando dados da universidade...</p></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-sisuBlue text-white font-black text-xl px-3 py-1.5 rounded-xl">
            MM
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg tracking-tight">Minha Monitoria</h1>
            <p className="text-xs text-gray-500">Simulador Comunitário & Não-Oficial</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenStudentModal()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center gap-2"
          >
            <PlusCircle size={16} /> Simular Minha Nota
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Acesso Administrativo (Oculto)"
            >
              <Settings size={20} />
            </button>
          )}

          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
            title="Sair da Conta"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-l-4 border-orange-500 p-5 rounded-r-2xl shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wider">
              Aviso Importante
            </h3>
            <p className="text-xs text-orange-800 leading-relaxed">
              Este aplicativo <strong>NÃO</strong> possui qualquer vínculo oficial com a universidade. As posições são estimativas. A classificação final oficial depende do edital.
            </p>
          </div>
        </div>
      </div>

      {isAdminMode && isAdmin && (
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

      <section>
        <Ranking
          disciplines={disciplines}
          submissions={submissions}
          activeDisciplineId={activeDisciplineId}
          userId={userId}
          onSelectDiscipline={setActiveDisciplineId}
          onOpenSubmitModal={handleOpenStudentModal}
        />
      </section>

      <footer className="text-center text-xs text-gray-500 space-y-2 pt-8 border-t border-gray-200">
        <div className="flex justify-center items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Autenticação Institucional Obrigatória & Criptografia Ativada</span>
        </div>
        <p>Minha Monitoria — Projeto de Código Aberto (Open Source).</p>
      </footer>

      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        disciplines={disciplines}
        submissions={submissions}
        defaultDisciplineId={studentModalDefaultDisc}
        userEmail={userEmail}
        userId={userId}
        onSubmitScore={handleStudentSubmitScore}
      />
    </div>
  );
}
