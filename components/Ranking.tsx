"use client";
import React, { useState } from 'react';

// Dados Falsos para o MVP
const FAKE_STUDENTS = [
  { id: 1, name: "Candidato Anônimo", score: 9.8, ira: 9.5 },
  { id: 2, name: "João Silva", score: 9.5, ira: 8.9 },
  { id: 3, name: "Candidato Anônimo", score: 9.5, ira: 8.9 },
  { id: 4, name: "Maria Oliveira", score: 9.2, ira: 9.1 },
  { id: 5, name: "Candidato Anônimo", score: 9.0, ira: 8.5 },
  { id: 6, name: "Candidato Anônimo", score: 8.8, ira: 8.2 },
  { id: 7, name: "Sávio (Você)", score: 8.7, ira: 9.0 },
  { id: 8, name: "Candidato Anônimo", score: 8.5, ira: 7.9 },
];

export default function Ranking() {
  const [course, setCourse] = useState("Anatomia Humana");
  const VAGAS = 4; // Nota de corte será no 4º lugar

  // Ordenar (já estão ordenados no fake data, mas simulando a lógica real)
  const sorted = [...FAKE_STUDENTS].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.ira - a.ira; // Desempate por IRA
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{course}</h2>
          <p className="text-gray-500 mt-1">Atualizado há 2 horas • Vagas: {VAGAS}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Nota de Corte</p>
          <p className="text-3xl font-bold text-sisuBlue">
            {sorted[VAGAS - 1]?.score.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold w-24 text-center">Posição</th>
              <th className="p-4 font-semibold">Candidato</th>
              <th className="p-4 font-semibold text-right">Nota na Matéria</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sorted.map((student, index) => {
              const position = index + 1;
              const isCutoff = position === VAGAS;
              const isApproved = position <= VAGAS;

              return (
                <React.Fragment key={student.id}>
                  <tr className={`hover:bg-blue-50 transition-colors ${
                    isApproved ? 'bg-green-50/30' : ''
                  } ${student.name.includes("Você") ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}>
                    <td className="p-4 text-center font-bold text-gray-700">
                      {position}º
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${student.name === 'Candidato Anônimo' ? 'text-gray-500 italic' : 'text-gray-900'}`}>
                          {student.name}
                        </span>
                        {isApproved && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Classificado
                          </span>
                        )}
                      </div>
                      {index > 0 && student.score === sorted[index - 1].score && (
                        <p className="text-xs text-orange-500 mt-1">Desempate via IRA aplicado</p>
                      )}
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900">
                      {student.score.toFixed(1)}
                    </td>
                  </tr>
                  
                  {isCutoff && (
                    <tr className="bg-sisuBlue">
                      <td colSpan={3} className="py-2 px-4 text-center text-white text-sm font-bold tracking-widest relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-blue-400 border-dashed"></div>
                        </div>
                        <span className="relative bg-sisuBlue px-4">LINHA DE CORTE</span>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
