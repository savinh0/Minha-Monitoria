"use client";
import React, { useState } from 'react';
import { Discipline, CandidateSubmission } from '@/lib/store';
import { Search, Info, TrendingUp, TrendingDown, Minus, BookOpen, AlertCircle, Lock, DollarSign, Award, PlusCircle, CheckCircle2 } from 'lucide-react';

interface RankingProps {
  disciplines: Discipline[];
  submissions: CandidateSubmission[];
  activeDisciplineId: string;
  onSelectDiscipline: (id: string) => void;
  onOpenSubmitModal: (disciplineId?: string) => void;
  userId: string | null;
}

export default function Ranking({
  disciplines,
  submissions,
  activeDisciplineId,
  onSelectDiscipline,
  onOpenSubmitModal,
  userId,
}: RankingProps) {
  const [disciplineSearchTerm, setDisciplineSearchTerm] = useState("");
  const [filterModality, setFilterModality] = useState<'todas' | 'remunerada' | 'voluntaria'>('todas');
  const [showHistory, setShowHistory] = useState(false);

  const selectedDiscipline = disciplines.find(c => c.id === activeDisciplineId) || disciplines[0];
  
  if (!selectedDiscipline) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border text-gray-500">
        Nenhuma disciplina cadastrada. Acesse o Modo Administrador para criar uma.
      </div>
    );
  }

  const filteredDisciplines = disciplines.filter(disc => {
    const term = disciplineSearchTerm.toLowerCase();
    return disc.name.toLowerCase().includes(term) || disc.course.toLowerCase().includes(term);
  });

  // Cálculo das Janelas de 5 horas
  const now = new Date();
  const h = now.getHours();
  const boundaryHour = Math.floor(h / 5) * 5;
  const lastBoundary = new Date(now);
  lastBoundary.setHours(boundaryHour, 0, 0, 0);
  const nextBoundary = new Date(lastBoundary);
  nextBoundary.setHours(boundaryHour + 5);

  // Filtrar submissões da disciplina atual E que respeitam o limite de tempo
  const currentSubmissions = submissions.filter(s => {
    if (s.disciplineId !== selectedDiscipline.id) return false;
    const subDate = new Date(s.submittedAt);
    return subDate <= lastBoundary;
  });

  // Ordenar: Nota Final (descendente) -> IRA (desempate)
  const sortedSubmissions = [...currentSubmissions].sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    return b.ira - a.ira;
  });

  const totalVagasRemuneradas = selectedDiscipline.vagasRemuneradas || 0;
  const totalVagasVoluntarias = selectedDiscipline.vagasVoluntarias || 0;
  const totalVagasGeral = totalVagasRemuneradas + totalVagasVoluntarias;

  // Cálculo das Notas de Corte
  const cutoffRemunerada = sortedSubmissions[totalVagasRemuneradas - 1]?.finalScore || 0;
  const cutoffVoluntaria = sortedSubmissions[totalVagasGeral - 1]?.finalScore || 0;

  // Encontrar posição do candidato "Você" (se houver) na PARCIAL
  const userIndex = sortedSubmissions.findIndex(s => s.userId === userId);
  const userSubmission = userIndex >= 0 ? sortedSubmissions[userIndex] : null;
  const userRank = userIndex >= 0 ? userIndex + 1 : null;

  // Gerar histórico dinâmico real (últimas 3 parciais)
  const getHistoricalCutoffs = (hoursAgo: number) => {
    const boundary = new Date(lastBoundary);
    boundary.setHours(boundary.getHours() - hoursAgo);
    
    const pastSubs = submissions.filter(s => {
      if (s.disciplineId !== selectedDiscipline.id) return false;
      const subDate = new Date(s.submittedAt);
      return subDate <= boundary;
    }).sort((a, b) => {
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      return b.ira - a.ira;
    });

    const rem = pastSubs[totalVagasRemuneradas - 1]?.finalScore || 0;
    const vol = pastSubs[totalVagasGeral - 1]?.finalScore || 0;

    return { time: boundary, rem, vol };
  };

  const hist5h = getHistoricalCutoffs(5);
  const hist10h = getHistoricalCutoffs(10);
  const hist15h = getHistoricalCutoffs(15);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all">
      
      {/* BUSCA E ABAS DE DISCIPLINAS */}
      <div className="bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row items-center p-3 gap-3">
        <div className="relative w-full md:w-80 flex-shrink-0">
          <input 
            type="text" 
            placeholder="Buscar disciplina ou curso..." 
            value={disciplineSearchTerm}
            onChange={(e) => setDisciplineSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sisuBlue/50"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar flex-1 gap-2 w-full">
          {filteredDisciplines.length > 0 ? (
            filteredDisciplines.map(disc => (
              <button
                key={disc.id}
                onClick={() => onSelectDiscipline(disc.id)}
                className={`py-2 px-4 font-semibold text-sm rounded-xl transition-all whitespace-nowrap flex items-center gap-2.5
                  ${activeDisciplineId === disc.id 
                    ? 'bg-sisuBlue text-white shadow-md shadow-blue-600/20' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'}
                `}
              >
                <BookOpen size={16} />
                <span>{disc.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeDisciplineId === disc.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {disc.course}
                </span>
              </button>
            ))
          ) : (
            <div className="py-2 px-4 text-sm text-gray-500 italic">
              Nenhuma disciplina ou curso encontrado para "{disciplineSearchTerm}".
            </div>
          )}
        </div>
      </div>

      {/* PAINEL INFORMATIVO DA DISCIPLINA */}
      <div className="bg-blue-50/50 border-b border-blue-100 p-2 text-center text-xs text-blue-800 font-medium">
        ⏱️ Ranking Parcial estático. Última atualização: <strong>{lastBoundary.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong> — Próxima parcial: <strong>{nextBoundary.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border-b border-gray-100">
        <div className="col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedDiscipline.name}</h2>
            <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg font-bold border border-gray-200">
              {selectedDiscipline.course}
            </span>
          </div>

          {/* VAGAS E STATUS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-lg font-bold">
              <DollarSign size={14} className="text-emerald-600" />
              {selectedDiscipline.vagasRemuneradas} Vaga(s) Remunerada(s)
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs px-3 py-1 rounded-lg font-bold">
              <Award size={14} className="text-amber-600" />
              {selectedDiscipline.vagasVoluntarias} Vaga(s) Voluntária(s)
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <AlertCircle size={13} /> {currentSubmissions.length} participantes simulados
            </span>
          </div>
        </div>

        {/* NOTAS DE CORTE EM DESTAQUE */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Corte Remunerada</span>
            <span className="text-2xl font-black text-emerald-700 mt-0.5">
              {cutoffRemunerada > 0 ? cutoffRemunerada.toFixed(2) : '--'}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">pts</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Corte Voluntária</span>
            <span className="text-2xl font-black text-amber-700 mt-0.5">
              {cutoffVoluntaria > 0 ? cutoffVoluntaria.toFixed(2) : '--'}
            </span>
            <span className="text-[10px] text-amber-600 font-medium">pts</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO HISTÓRICO REAL */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
        >
          {showHistory ? <Minus size={16} /> : <PlusCircle size={16} />} 
          Ver Histórico do Ranking (Parciais Anteriores)
        </button>
        
        {showHistory && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2 animate-in fade-in slide-in-from-top-2">
            {[hist5h, hist10h, hist15h].map((h, i) => (
              <div key={i} className="bg-white border rounded-xl p-3 shadow-sm">
                <span className="text-xs font-bold text-gray-500">
                  {h.time.toLocaleDateString('pt-BR')} às {h.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                <div className="mt-2 text-sm">
                  <p>Corte Remunerada: <strong className="text-emerald-700">{h.rem > 0 ? h.rem.toFixed(2) : '--'} pts</strong></p>
                  <p>Corte Voluntária: <strong className="text-amber-700">{h.vol > 0 ? h.vol.toFixed(2) : '--'} pts</strong></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BANNER SE VOCÊ ESTIVER SIMULADO */}
      {userSubmission && userRank && (
        <div className="mx-6 mt-6 p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-bold">SUA SIMULAÇÃO</span>
              <p className="font-bold text-gray-900 text-base">
                Sua Posição Estimada: {userRank}º lugar de {currentSubmissions.length} inscritos
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {userRank <= totalVagasRemuneradas && '🟢 Você está temporariamente classificado para vaga REMUNERADA!'}
              {userRank > totalVagasRemuneradas && userRank <= totalVagasGeral && '🟡 Você está temporariamente classificado para vaga VOLUNTÁRIA!'}
              {userRank > totalVagasGeral && '🔴 Você está temporariamente abaixo da linha de corte.'}
            </p>
          </div>
          
          <div className="text-right">
            <span className="text-xs text-blue-600 font-bold uppercase">Sua Nota Final</span>
            <p className="text-2xl font-black text-sisuBlue">{userSubmission.finalScore.toFixed(2)} pts</p>
          </div>
        </div>
      )}

      {/* FERRAMENTAS E BOTAO DE INSERIR NOTA */}
      <div className="p-6 flex flex-col md:flex-row justify-end items-stretch md:items-center gap-4">
        <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-xl border border-gray-200">
          <Lock size={13} className="mr-1 text-gray-400" /> Nomes protegidos
        </div>

        <button
          onClick={() => onOpenSubmitModal(selectedDiscipline.id)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> Simular Minha Nota Nesta Matéria
        </button>
      </div>

      {/* TABELA DE PARCIAIS COM DUPLA LINHA DE CORTE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider border-y border-gray-200">
              <th className="py-3 px-6 font-bold w-20 text-center">Posição</th>
              <th className="py-3 px-6 font-bold">Candidato Simulado</th>
              <th className="py-3 px-6 font-bold text-center">Status Vaga</th>
              <th className="py-3 px-6 font-bold text-right">Nota Matéria</th>
              <th className="py-3 px-6 font-bold text-right">IRA</th>
              <th className="py-3 px-6 font-bold text-right text-sisuBlue bg-blue-50/50">Nota Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedSubmissions
              .map((student, index) => {
                const position = index + 1;
                const isRemunerada = position <= totalVagasRemuneradas;
                const isVoluntaria = !isRemunerada && position <= totalVagasGeral;
                const isCutoffRemunerada = position === totalVagasRemuneradas;
                const isCutoffVoluntaria = position === totalVagasGeral;
                const isUser = student.userId === userId;

                return (
                  <React.Fragment key={student.id}>
                    <tr className={`hover:bg-gray-50 transition-colors ${
                      isUser ? 'bg-yellow-50/70 border-l-4 border-yellow-400' : ''
                    }`}>
                      
                      {/* POSIÇÃO */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                          isRemunerada ? 'bg-emerald-100 text-emerald-800' :
                          isVoluntaria ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {position}º
                        </span>
                      </td>

                      {/* CANDIDATO */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            student.isAnonymous ? 'text-gray-400 italic' : 'text-gray-900'
                          } ${isUser ? 'text-yellow-900 font-bold' : ''}`}>
                            {student.candidateName}
                          </span>
                          {isUser && (
                            <span className="bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded font-bold">
                              VOCÊ
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STATUS DA VAGA */}
                      <td className="py-4 px-6 text-center">
                        {isRemunerada && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                            <DollarSign size={12} /> Classificado (Remunerada)
                          </span>
                        )}
                        {isVoluntaria && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                            <Award size={12} /> Classificado (Voluntária)
                          </span>
                        )}
                        {!isRemunerada && !isVoluntaria && (
                          <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                            Abaixo do corte
                          </span>
                        )}
                      </td>

                      {/* NOTA MATÉRIA */}
                      <td className="py-4 px-6 text-right font-medium text-gray-700">
                        {student.subjectScore.toFixed(1)}
                      </td>

                      {/* IRA */}
                      <td className="py-4 px-6 text-right font-medium text-gray-700">
                        {student.ira.toFixed(1)}
                      </td>

                      {/* NOTA FINAL */}
                      <td className="py-4 px-6 text-right text-base font-extrabold text-sisuBlue bg-blue-50/20">
                        {student.finalScore.toFixed(2)}
                      </td>
                    </tr>

                    {/* 1ª LINHA DE CORTE - VAGAS REMUNERADAS */}
                    {isCutoffRemunerada && (
                      <tr className="bg-emerald-600 text-white font-bold">
                        <td colSpan={6} className="py-2.5 px-6 text-center text-xs tracking-wider uppercase">
                          🟢 1ª LINHA DE CORTE — FIM DAS VAGAS REMUNERADAS ({totalVagasRemuneradas} Vaga(s))
                        </td>
                      </tr>
                    )}

                    {/* 2ª LINHA DE CORTE - VAGAS VOLUNTÁRIAS */}
                    {isCutoffVoluntaria && (
                      <tr className="bg-amber-500 text-white font-bold">
                        <td colSpan={6} className="py-2.5 px-6 text-center text-xs tracking-wider uppercase">
                          🟡 2ª LINHA DE CORTE — FIM DAS VAGAS VOLUNTÁRIAS (Total {totalVagasGeral} Vagas)
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

            {sortedSubmissions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  Nenhum candidato simulado nesta disciplina ainda. Seja o primeiro a clicar em "Simular Minha Nota"!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
