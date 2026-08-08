import Ranking from "@/components/Ranking";
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* AVISO IMPORTANTE SOBRE A NATUREZA DO SISTEMA */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-orange-800">ATENÇÃO: SISTEMA NÃO-OFICIAL</h3>
            <div className="mt-2 text-sm text-orange-700">
              <p>
                Este é um simulador paralelo mantido pelos alunos e <strong>NÃO</strong> tem nenhum vínculo com a reitoria ou com o sistema oficial da universidade.
                O ranqueamento e a nota de corte exibidos aqui são estimativas probabilísticas (estilo "Olho na Vaga") baseadas APENAS nos candidatos que voluntariamente inseriram suas notas nesta plataforma.
                <br /><br />
                <strong>Sua posição real no edital oficial pode ser diferente.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Painel do Aluno</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Seu IRA (Auto-declarado)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">9.0</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Status na Simulação</p>
            <p className="text-xl font-bold text-gray-900 mt-1">Participando</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Próxima Parcial</p>
            <p className="text-xl font-bold text-gray-900 mt-1">21:00 hoje</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-gray-800">Simulação de Corte: Anatomia Humana</h2>
        </div>
        <Ranking />
      </section>

      <div className="text-center text-sm text-gray-500 mt-12 pb-8">
        <p>Desenvolvido de alunos para alunos. Código Aberto.</p>
        <p>Criptografia AES-256 Ativada 🔒 — Seus dados acadêmicos estão seguros.</p>
      </div>
    </div>
  );
}
