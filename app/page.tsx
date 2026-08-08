import Ranking from "@/components/Ranking";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Painel do Aluno</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Seu IRA</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">9.0</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Status</p>
            <p className="text-xl font-bold text-gray-900 mt-1">Inscrito</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Próxima Parcial</p>
            <p className="text-xl font-bold text-gray-900 mt-1">21:00 hoje</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-gray-800">Parcial: Anatomia Humana</h2>
        </div>
        <Ranking />
      </section>

      <div className="text-center text-sm text-gray-500 mt-12 pb-8">
        <p>Sistema independente sem fins lucrativos.</p>
        <p>Criptografia AES-256 (Controle Dual) Ativada 🔒</p>
      </div>
    </div>
  );
}
