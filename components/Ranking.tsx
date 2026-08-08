"use client";
import React, { useState } from 'react';
import { Search, Info, TrendingUp, TrendingDown, Minus, BookOpen, AlertCircle, Lock } from 'lucide-react';

const COURSES = [
  { id: "anatomia", name: "Anatomia Humana", vagas: 4 },
  { id: "fisiologia", name: "Fisiologia Médica", vagas: 3 },
  { id: "patologia", name: "Patologia Geral", vagas: 2 },
];

const FAKE_STUDENTS = [
  { id: 1, name: "Candidato Anônimo", subjectScore: 9.8, ira: 9.5, course: "anatomia", trend: 'up' },
  { id: 2, name: "João Silva", subjectScore: 9.5, ira: 8.9, course: "anatomia", trend: 'same' },
  { id: 3, name: "Candidato Anônimo", subjectScore: 9.1, ira: 8.9, course: "anatomia", trend: 'down' },
  { id: 4, name: "Maria Oliveira", subjectScore: 9.0, ira: 8.9, course: "anatomia", trend: 'up' },
  { id: 5, name: "Candidato Anônimo", subjectScore: 8.5, ira: 9.3, course: "anatomia", trend: 'same' },
  { id: 6, name: "Candidato Anônimo", subjectScore: 8.8, ira: 8.2, course: "anatomia", trend: 'down' },
  { id: 7, name: "Sávio (Você)", subjectScore: 8.7, ira: 9.0, course: "anatomia", trend: 'up' },
  { id: 8, name: "Candidato Anônimo", subjectScore: 8.5, ira: 7.9, course: "anatomia", trend: 'same' },
  { id: 9, name: "Candidato Anônimo", subjectScore: 9.9, ira: 9.8, course: "fisiologia", trend: 'same' },
  { id: 10, name: "Sávio (Você)", subjectScore: 9.5, ira: 9.0, course: "fisiologia", trend: 'up' },
  { id: 11, name: "Candidato Anônimo", subjectScore: 9.0, ira: 9.0, course: "fisiologia", trend: 'down' },
  { id: 12, name: "Candidato Anônimo", subjectScore: 8.5, ira: 8.0, course: "fisiologia", trend: 'same' },
];

export default function Ranking() {
  const [activeTab, setActiveTab] = useState("anatomia");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCourse = COURSES.find(c => c.id === activeTab) || COURSES[0];
  
  // Regra de Negócio Atualizada: Nota Final = Média na Matéria + IRA
  const processedStudents = FAKE_STUDENTS
    .filter(s => s.course === activeTab)
    .map(s => ({
      ...s,
      finalScore: s.subjectScore + s.ira
    }))
    .sort((a, b) => {
      // Ordenação primária: Nota Final
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      // Desempate: Maior IRA (Critério de desempate comum, ajustável)
      return b.ira - a.ira; 
    });

  const cutoffScore = processedStudents[selectedCourse.vagas - 1]?.finalScore || 0;
  
  // Encontrar posição do usuário atual ("Você")
  const userRank = processedStudents.findIndex(s => s.name.includes("Você")) + 1;
  const isUserApproved = userRank > 0 && userRank <= selectedCourse.vagas;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all">
      {/* HEADER / TABS */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex overflow-x-auto hide-scrollbar">
          {COURSES.map(course => (
            <button
              key={course.id}
              onClick={() => setActiveTab(course.id)}
              className={`flex-1 py-4 px-6 font-medium text-sm transition-colors relative whitespace-nowrap flex items-center justify-center gap-2
                ${activeTab === course.id ? 'text-sisuBlue bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
              `}
            >
              <BookOpen size={16} />
              {course.name}
              {activeTab === course.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sisuBlue"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* PAINEL DE INFORMAÇÕES DA DISCIPLINA */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
        <div className="col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
              {selectedCourse.vagas} VAGAS
            </span>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <AlertCircle size={14} /> Atualizado hoje às 14:00 (Próxima parcial às 19:00)
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 flex flex-col items-center justify-center shadow-inner">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Nota de Corte Atual</p>
          <div className="flex items-baseline gap-1">
            <p className="text-4xl font-extrabold text-sisuBlue">{cutoffScore.toFixed(2)}</p>
            <span className="text-sm text-gray-500 font-medium">pts</span>
          </div>
        </div>
      </div>

      {/* FEEDBACK DO USUÁRIO */}
      {userRank > 0 && (
        <div className={`mx-6 mb-6 p-4 rounded-lg flex items-center justify-between border ${
          isUserApproved ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div>
            <p className="font-bold text-lg">
              {isUserApproved ? '🎉 Você está temporariamente classificado!' : '⚠️ Você está abaixo da nota de corte nesta parcial.'}
            </p>
            <p className="text-sm opacity-90 mt-1">
              Sua posição atual: <strong>{userRank}º de {processedStudents.length} inscritos</strong>.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider opacity-75">Sua Nota Final</p>
            <p className="text-2xl font-bold">{processedStudents[userRank - 1].finalScore.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* FERRAMENTAS (BUSCA) */}
      <div className="px-6 pb-4 flex justify-between items-center">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Buscar candidato..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sisuBlue/50"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          <Lock size={12} /> Nomes anônimos são protegidos por criptografia de ponta
        </div>
      </div>

      {/* TABELA DE CLASSIFICAÇÃO */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider border-y border-gray-200">
              <th className="py-3 px-6 font-semibold w-24 text-center">Posição</th>
              <th className="py-3 px-6 font-semibold">Candidato</th>
              <th className="py-3 px-6 font-semibold text-center">Evolução</th>
              <th className="py-3 px-6 font-semibold text-right">Nota Matéria</th>
              <th className="py-3 px-6 font-semibold text-right">IRA</th>
              <th className="py-3 px-6 font-semibold text-right text-sisuBlue bg-blue-50/50">Nota Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {processedStudents
              .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((student, index) => {
              const position = processedStudents.findIndex(ps => ps.id === student.id) + 1;
              const isCutoff = position === selectedCourse.vagas;
              const isApproved = position <= selectedCourse.vagas;
              const isUser = student.name.includes("Você");

              return (
                <React.Fragment key={student.id}>
                  <tr className={`hover:bg-gray-50 transition-colors group ${
                    isUser ? 'bg-yellow-50/50 hover:bg-yellow-100/50' : ''
                  }`}>
                    {/* POSIÇÃO */}
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        isApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {position}
                      </span>
                    </td>
                    
                    {/* CANDIDATO */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={`font-medium flex items-center gap-2 ${
                          student.name === 'Candidato Anônimo' ? 'text-gray-500 italic' : 'text-gray-900'
                        } ${isUser ? 'text-yellow-700 font-bold' : ''}`}>
                          {student.name}
                          {isUser && <span className="bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded font-bold">VOCÊ</span>}
                        </span>
                      </div>
                    </td>

                    {/* EVOLUÇÃO */}
                    <td className="py-4 px-6 text-center">
                      {student.trend === 'up' && <TrendingUp size={18} className="inline text-green-500" />}
                      {student.trend === 'down' && <TrendingDown size={18} className="inline text-red-500" />}
                      {student.trend === 'same' && <Minus size={18} className="inline text-gray-400" />}
                    </td>

                    {/* NOTA MATÉRIA */}
                    <td className="py-4 px-6 text-right font-medium text-gray-600">
                      {student.subjectScore.toFixed(2)}
                    </td>

                    {/* IRA */}
                    <td className="py-4 px-6 text-right font-medium text-gray-600">
                      {student.ira.toFixed(2)}
                    </td>

                    {/* NOTA FINAL */}
                    <td className="py-4 px-6 text-right text-lg font-bold text-sisuBlue bg-blue-50/20 group-hover:bg-blue-50/50">
                      {student.finalScore.toFixed(2)}
                    </td>
                  </tr>
                  
                  {/* LINHA DE CORTE */}
                  {isCutoff && (
                    <tr className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border-y-2 border-sisuBlue">
                      <td colSpan={6} className="py-2 px-6 text-center">
                        <span className="text-sisuBlue font-black text-sm tracking-[0.2em] flex items-center justify-center gap-4">
                          <span className="h-px bg-sisuBlue flex-1"></span>
                          <Info size={16} /> FIM DA LINHA DE CORTE ({selectedCourse.vagas} VAGAS)
                          <span className="h-px bg-sisuBlue flex-1"></span>
                        </span>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            
            {processedStudents.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  Nenhum candidato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
